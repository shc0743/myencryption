import MP4Box from './MP4box/mp4box.all.js';


/**
 * 播放MP4视频的简化封装
 * @param {HTMLVideoElement} video - 视频元素
 * @param {MediaSource} ms - 已打开的MediaSource对象
 * @param {function(start: number, end: number): Promise<ArrayBuffer>} fileReader - 文件读取函数
 */
export async function PlayMp4Video(video, ms, fileReader, bs = 1000000) {
    let sb;
    const mp4boxfile = MP4Box.createFile();

    const addBuffer = function addBuffer(mp4track) {
        var track_id = mp4track.id;
        var codec = mp4track.codec;
        var mime = 'video/mp4; codecs=\"' + codec + '\"';
        var trackDefault;
        var trackDefaultSupport = (typeof TrackDefault !== "undefined");
        if (MediaSource.isTypeSupported(mime)) {
            sb = ms.addSourceBuffer(mime);
            if (trackDefaultSupport) {
                sb.trackDefaults = new TrackDefaultList([trackDefault]);
            }
            sb.addEventListener("error", function (e) {
                Log.error("MSE SourceBuffer #" + track_id, e);
            });
            sb.ms = ms;
            sb.id = track_id;
            mp4boxfile.setSegmentOptions(track_id, sb, { nbSamples: 1000 });
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
            this.appendBuffer(obj.buffer);
        }
    }

    mp4boxfile.onMoovStart = function () {
        // console.log("Application", "Starting to parse movie information");
    }
    mp4boxfile.onReady = function (info) {
        // console.log("视频元数据已准备好:", info);

        ms.movieInfo = info;
        if (info.isFragmented) {
            ms.duration = info.fragment_duration / info.timescale;
        } else {
            ms.duration = info.duration / info.timescale;
        }

        // initializeAllSourceBuffers();
        if (info) {
            for (const track of info.tracks) addBuffer(track);
            // initializeSourceBuffers();
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

        // const seek_info = mp4boxfile.seek(0, true);
        // loadSegment(seek_info.offset, seek_info.offset + bs)
    };
    mp4boxfile.onSegment = function (id, user, buffer, sampleNum, is_last) {
        const sb = user;
        sb.segmentIndex++;
        sb.pendingAppends.push({ id: id, buffer: buffer, sampleNum: sampleNum, is_last: is_last });
        onUpdateEnd.call(sb, true, false);
    };
    mp4boxfile.start();

    // 监听seek事件
    video.addEventListener('seeked', function () {
        let i, start, end;
        if (video.lastSeekTime !== video.currentTime) {
            for (i = 0; i < video.buffered.length; i++) {
                start = video.buffered.start(i);
                end = video.buffered.end(i);
                if (video.currentTime >= start && video.currentTime <= end) {
                    return;
                }
            }
            /* Chrome fires twice the seeking event with the same value */
            const seek_info = mp4boxfile.seek(video.currentTime, true);
            loadSegment(seek_info.offset, seek_info.offset + bs)
            video.lastSeekTime = video.currentTime;
        }
    });

    async function loadSegment(start, end) {
        // console.log(`%c正在获取数据 ${start}-${end}`, 'color: white; background:rgb(36, 127, 218); font-size: 16px; font-family: NSimsun;');

        const blob = new Blob([await fileReader(start, end)])//await decrypt_stream(ctx, start, end);
        if (!blob.size) {
            const ab = new ArrayBuffer(0);
            ab.fileStart = start;
            mp4boxfile.appendBuffer(ab, true);
            mp4boxfile.flush();
            return 0;
        }
        const buffer = await blob.arrayBuffer();
        buffer.fileStart = start;
        const mstart = mp4boxfile.appendBuffer(buffer, !!blob.eof);
        mp4boxfile.flush();

        if (mstart) return await loadSegment(mstart, mstart + bs);
        else if (blob.eof) return false;
        else return null;
    }
    console.log('loadSegment=', await loadSegment(0, 999999));

    return video;
}