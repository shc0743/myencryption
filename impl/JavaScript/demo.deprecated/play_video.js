import MP4Box from './MP4box/mp4box.all.js';

let Logs = false;
export function setLogEnabled(enabled) {
    Logs = !!enabled; 
}

// 异常类
export class NotSupportError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotSupportError";
    }
}

/**
 * 播放MP4视频的简化封装
 * @param {HTMLVideoElement} video - 视频元素
 * @param {function(start: number, end: number, abort: AbortController): Promise<ArrayBuffer>} fileReader - 文件读取函数
 * @param {Number} bs - 缓冲区大小，默认为1MB
 * @param {function(end_of_stream_func)|null} [onVideoEnd] - 视频结束时的回调函数，默认为null
 * @returns {Promise<function()>} - 清理函数
 */
export async function PlayMp4Video(video, fileReader, bs = 1000000, onVideoEnd = null) {
    let sb, cleaned;
    // 如果浏览器不支持 MediaSource，这可怎么办呢？
    // 我们直接抛出异常，让调用者自行处理。
    if (Reflect.has(globalThis, 'MediaSource') == false)
        throw new NotSupportError("MediaSource is not supported in this browser or context.");

    const mp4boxfile = MP4Box.createFile();
    /**
     * @type {MediaSource}
     */
    let ms = null;
    const activeSourceBuffers = new Map(); // 跟踪活动的SourceBuffer
    let initSegs;
    let nextLoadShouldPlay = false;

    const createNewMs = async function createNewMs() {
        if (createNewMs.request) return;
        if (Logs) console.log("A new request to create a new MediaSource has been issued.");
        createNewMs.request = true;

        return await new Promise((resolve, reject) => {
            ms = new MediaSource();
            video.src = URL.createObjectURL(ms);
            ms.addEventListener('sourceopen', () => {
                if (Logs) console.log("MediaSource opened successfully");
                resolve();
                
                setTimeout(() => {
                    createNewMs.request = false;
                }, 1000); // 1秒后释放请求
            }, { once: true });
            ms.addEventListener('error', reject);

            setTimeout(reject, 10000, new Error("Timeout waiting for sourceopen"));
        });
    }

    await createNewMs();

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
                if (Logs) console.error("MSE SourceBuffer #", track_id, e);
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
                if (this.ms.readyState === "open" && this.buffered.length > 0) {
                    try {
                        // 保留当前时间点附近的内容，清理之前的内容
                        const currentTime = video.currentTime;
                        for (let i = 0; i < this.buffered.length; i++) {
                            const start = this.buffered.start(i);
                            const end = this.buffered.end(i);
                            if (end < (currentTime - 5)) { // 清理5秒前的内容
                                this.remove(start, end);
                                break;
                            }
                        }
                    } catch (e) {
                        if (Logs) console.warn("Error removing old buffers:", e);
                    }
                }
            }
            if (this.sampleNum) {
                mp4boxfile.releaseUsedSamples(this.id, this.sampleNum);
                delete this.sampleNum;
            }
            if (this.is_last) try {
                if (ms.readyState === "open") {
                    // this.ms.endOfStream();
                    onVideoEnd?.(() => {
                        ms.endOfStream();
                    });
                    if (onVideoEnd) onVideoEnd = null;
                }
                // 处理视频流结束，用户往回seek的情况
            } catch {}
        }
        if (this.updating === false && this.pendingAppends.length > 0) {
            if (this.ms.readyState !== "open") {
                return;
            }
            var obj = this.pendingAppends.shift();
            this.sampleNum = obj.sampleNum;
            this.is_last = obj.is_last;
            try {
                this.appendBuffer(obj.buffer); 
                if (nextLoadShouldPlay) { requestIdleCallback(function preparePlay() {
                    video.play().then(() => {
                        if(Logs) console.log("Video play started due to the nextLoadShouldPlay request");
                    }).catch(e => {
                        if (e && e.name && e.name !== 'NotAllowedError') queueMicrotask(preparePlay);
                    })
                }); nextLoadShouldPlay = false; }
            }
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
        if (Logs) console.log("Application", "Starting to parse movie information");
    }
    mp4boxfile.onReady = function (info) {
        ms.movieInfo = info;
        if (info.isFragmented) {
            ms.duration = ms.original_duration = info.fragment_duration / info.timescale;
        } else {
            ms.duration = ms.original_duration = info.duration / info.timescale;
        }

        if (info) {
            for (const track of info.tracks) addBuffer(track);
            initSegs = mp4boxfile.initializeSegmentation();
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
        // antiTik
        const time = new Date().getTime();
        if (time - doSeek.antiTik < 100) return;
        doSeek.antiTik = time;
        // antiTik end

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
    doSeek.antiTik = 0;
    function onSeeked() {
        if (video.lastSeekTime !== video.currentTime) {
            doSeek();
        }
    }
    function onTimeUpdate() {
        if (isNaN(onTimeUpdate.last_time) || (video.currentTime < onTimeUpdate.last_time) || ((video.currentTime - onTimeUpdate.last_time) > Math.ceil(10 * video.playbackRate))) {
            doSeek();
            onTimeUpdate.last_time = video.currentTime;
        }
    }
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('timeupdate', onTimeUpdate);

    // 检查视频结束
    function onWaiting() {
        if (ms.original_duration - video.currentTime < 1) {
            if (Logs) console.log("Video ended");
            if (video.loop) {
                const seek_info = mp4boxfile.seek(0, true);
                loadSegment(seek_info.offset, seek_info.offset + bs).then(() => video.play());
                video.currentTime = 0;
                nextLoadShouldPlay = true;
            } else {
                // 使得视频在结束的时候自动暂停
                video.pause();
            }
        }
    }
    video.addEventListener('waiting', onWaiting);

    // 添加清理函数
    const cleanup = () => {
        cleaned = true;
        // 移除所有事件监听器
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('timeupdate', onTimeUpdate);
        video.removeEventListener('waiting', onWaiting);

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

        URL.revokeObjectURL(video.src);
        video.src = 'data:null/null,null';

        try { loadSegment.ab?.abort?.(); } catch { }
    };

    async function loadSegment(start, end, id = null, depth = 0) {
        if (id == null && Logs) console.log('loadSegment start; id will be', loadSegmentId + 1);
        if (id == null) {
            id = (++loadSegmentId);
            loadSegment.ab?.abort?.();
            loadSegment.ab = null;
        }
        else if (id !== loadSegmentId) {
            if (Logs) console.log('loadSegment return, reason: another request has been issued, current id=', id, '/another id=', loadSegmentId);
            return true;
        }
        if (cleaned) return -1;
        if (depth > 64) {
            if (Logs) console.log('loadSegment return, reason: max depth has been reached');
            return 3;
        }

        const controller = new AbortController();
        loadSegment.ab = controller;
        try {
            const blob = new Blob([await fileReader(start, end, controller)]);
            if (id !== loadSegmentId) {
                if (Logs) console.log('loadSegment return, reason: since last operation (data fetched) another request has been issued, current id=', id, '/another id=', loadSegmentId);
                return 2;
            }
            if (!blob.size) {
                const ab = new ArrayBuffer(0);
                ab.fileStart = start;
                mp4boxfile.appendBuffer(ab, true);
                mp4boxfile.flush();
                if (Logs) console.log('loadSegment return, reason: EOF; params=', start, end, id, depth);
                return 1;
            }
            const buffer = await blob.arrayBuffer();
            buffer.fileStart = start;
            const mstart = mp4boxfile.appendBuffer(buffer, !!blob.eof);
            mp4boxfile.flush();

            if (mstart) return await loadSegment(mstart, mstart + bs, id, ++depth);
            else if (blob.eof) return false;

            if (Logs) console.log('loadSegment return, reason: no next start position has specified');
        } catch {
            if (Logs) console.log('loadSegment aborted: id=', id);
        }
        return null;
    }
    queueMicrotask(async () => {
        const r = await loadSegment(0, 999999);
        if (Logs) console.log('loadSegment=', r);
    });

    cleanup.getMediaSource = () => {
        return ms;
    };
    return cleanup;
}

