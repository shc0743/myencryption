import MP4Box from './MP4box/mp4box.all.js';

let Logs = false;
export function setLogEnabled(enabled) {
    Logs = !!enabled; 
}

/**
 * 播放MP4视频的简化封装
 * @param {HTMLVideoElement} video - 视频元素
 * @param {MediaSource} ms - 已打开的MediaSource对象
 * @param {function(start: number, end: number): Promise<ArrayBuffer>} fileReader - 文件读取函数
 */
export async function PlayMp4Video(video, ms, fileReader, bs = 1000000) {
    let sb, cleaned;
    const mp4boxfile = MP4Box.createFile();
    const activeSourceBuffers = new Map(); // 跟踪活动的SourceBuffer

    let loadSegmentId = 1;

    const addBuffer = function addBuffer(mp4track) {
        var track_id = mp4track.id;
        var codec = mp4track.codec;
        var mime = 'video/mp4; codecs=\"' + codec + '\"';
        var trackDefault;
        var trackDefaultSupport = (typeof TrackDefault !== "undefined");
        if (MediaSource.isTypeSupported(mime)) {
            sb = ms.addSourceBuffer(mime);
            activeSourceBuffers.set(track_id, sb); // 存储SourceBuffer
            if (trackDefaultSupport) {
                sb.trackDefaults = new TrackDefaultList([trackDefault]);
            }
            sb.addEventListener("error", function (e) {
                Log.error("MSE SourceBuffer #" + track_id, e);
            });
            sb.ms = ms;
            sb.id = track_id;
            mp4boxfile.setSegmentOptions(track_id, sb, { nbSamples: 10 });
            sb.pendingAppends = [];
        } else {
            console.error("ms not supported")
        }
    }
    const onInitAppended = function onInitAppended(e) {
        const sb = e.target;
        if (sb.ms.readyState === "open") {
            sb.sampleNum = 0;
            sb.removeEventListener('updateend', onInitAppended);
            sb.addEventListener('updateend', onUpdateEnd.bind(sb, true, true));
            /* In case there are already pending buffers we call onUpdateEnd to start appending them*/
            onUpdateEnd.call(sb, false, true);
            sb.ms.pendingInits--;
        }
    }
    const onUpdateEnd = function onUpdateEnd(isNotInit, isEndOfAppend) {
        if (isEndOfAppend === true) {
            if (isNotInit === true) {
                // updateBufferedString(this, "Update ended");
                if (this.ms.readyState === "open" && this.buffered.length > 0) {
                    try {
                        // 保留当前时间点附近的内容，清理之前的内容
                        const currentTime = video.currentTime;
                        for (let i = 0; i < this.buffered.length; i++) {
                            const start = this.buffered.start(i);
                            const end = this.buffered.end(i);
                            if (end < (currentTime - 3)) { // 清理3秒前的内容
                                this.remove(start, end);
                                break;
                            }
                        }
                    } catch (e) {
                        // console.warn("Error removing old buffers:", e);
                    }
                }
            }
            if (this.sampleNum) {
                mp4boxfile.releaseUsedSamples(this.id, this.sampleNum);
                delete this.sampleNum;
            }
            if (this.is_last) try {
                this.ms.endOfStream();
            } catch {}
        }
        if (this.ms.readyState === "open" && this.updating === false && this.pendingAppends.length > 0) {
            var obj = this.pendingAppends.shift();
            this.sampleNum = obj.sampleNum;
            this.is_last = obj.is_last;
            try { this.appendBuffer(obj.buffer); }
            catch (e) {
                if (e.name === 'QuotaExceededError') {
                    this.pendingAppends.splice(0, 0, obj);
                    setTimeout(() => {
                        onUpdateEnd.apply(this, arguments);
                    }, 1000);
                }
                else if (Logs) console.error('[player]', 'unexpected error:', e);
            }
        }
    }

    mp4boxfile.onMoovStart = function () {
        // console.log("Application", "Starting to parse movie information");
    }
    mp4boxfile.onReady = function (info) {
        ms.movieInfo = info;
        if (info.isFragmented) {
            ms.duration = info.fragment_duration / info.timescale;
        } else {
            ms.duration = info.duration / info.timescale;
        }

        if (info) {
            for (const track of info.tracks) addBuffer(track);
            const initSegs = mp4boxfile.initializeSegmentation();
            for (let i = 0; i < initSegs.length; i++) {
                const sb = initSegs[i].user;
                if (i === 0) {
                    sb.ms.pendingInits = 0;
                }
                sb.addEventListener("updateend", onInitAppended);
                sb.appendBuffer(initSegs[i].buffer);
                sb.segmentIndex = 0;
                sb.ms.pendingInits++;
            }
        }
    };
    mp4boxfile.onSegment = function (id, user, buffer, sampleNum, is_last) {
        const sb = user;
        sb.segmentIndex++;
        sb.pendingAppends.push({ id: id, buffer: buffer, sampleNum: sampleNum, is_last: is_last });
        onUpdateEnd.call(sb, true, false);
    };
    mp4boxfile.start();

    // 监听seek事件
    function doSeek() {
        let i, start, end;
        for (i = 0; i < video.buffered.length; i++) {
            start = video.buffered.start(i);
            end = video.buffered.end(i);
            if (video.currentTime >= start && video.currentTime <= (end - Math.ceil(11 * video.playbackRate))) {
                return;
            }
        }
        /* Chrome fires twice the seeking event with the same value */
        const seek_info = mp4boxfile.seek(video.currentTime, true);
        loadSegment(seek_info.offset, seek_info.offset + bs)
        video.lastSeekTime = video.currentTime;
    }
    function onSeeking() {
        if (video.lastSeekTime !== video.currentTime) {
            doSeek();
        }
    }
    function onTimeUpdate() {
        if (isNaN(onTimeUpdate.last_time) || ((video.currentTime - onTimeUpdate.last_time) > Math.ceil(10 * video.playbackRate))) {
            doSeek();
            onTimeUpdate.last_time = video.currentTime;
        }
    }
    video.addEventListener('seeking', onSeeking);
    // video.addEventListener('waiting', doSeek);
    video.addEventListener('timeupdate', onTimeUpdate);

    // 添加清理函数
    const cleanup = () => {
        cleaned = true;
        // 移除所有事件监听器
        video.removeEventListener('seeking', onSeeking);
        video.removeEventListener('timeupdate', onTimeUpdate);

        // 清理SourceBuffer
        activeSourceBuffers.forEach((sb, trackId) => {
            try {
                if (sb.updating) {
                    sb.abort();
                }
                if (ms.readyState === 'open') {
                    ms.removeSourceBuffer(sb);
                }
                sb.removeEventListener('updateend', onUpdateEnd);
                mp4boxfile.releaseUsedSamples(trackId, sb.sampleNum)
            } catch (e) {
                console.warn("Error cleaning up SourceBuffer:", e);
            }
        });
        activeSourceBuffers.clear();

        // 清理MP4Box资源
        if (mp4boxfile) {
            mp4boxfile.flush();
            mp4boxfile.onSegment = null;
            mp4boxfile.onReady = null;
            mp4boxfile.onMoovStart = null;
            mp4boxfile.stop();
        }
    };

    async function loadSegment(start, end, id = null, depth = 0) {
        if (id === null) id = (++loadSegmentId);
        else if (id !== loadSegmentId) return true;
        if (cleaned) return -1;
        if (depth > 64) return 3;

        const blob = new Blob([await fileReader(start, end)])
        if (id !== loadSegmentId) return 2;
        if (!blob.size) {
            const ab = new ArrayBuffer(0);
            ab.fileStart = start;
            mp4boxfile.appendBuffer(ab, true);
            mp4boxfile.flush();
            return 1;
        }
        const buffer = await blob.arrayBuffer();
        buffer.fileStart = start;
        const mstart = mp4boxfile.appendBuffer(buffer, !!blob.eof);
        mp4boxfile.flush();

        if (mstart) return await loadSegment(mstart, mstart + bs, id, ++depth);
        else if (blob.eof) return false;
        else return null;
    }
    queueMicrotask(async () => {
        if (Logs) console.log('loadSegment=', await loadSegment(0, 999999));
    });

    return cleanup;
}

