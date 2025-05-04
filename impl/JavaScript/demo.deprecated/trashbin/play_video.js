import MP4Box from './MP4box/mp4box.all.js';

// MP4Box.Log.setLogLevel(MP4Box.Log.debug);

export class DataSource {
    #reader = null;
    #bs = 10000;
    constructor(reader, block_size) {
        if (typeof reader !== 'function') throw new TypeError("Invalid reader");
        this.#reader = reader;
        if (block_size) this.#bs = block_size;
    }

    #cb = null;
    get callback() { return this.#cb }
    set callback(value) {
        if (typeof value !== 'function') throw new TypeError("Invalid callback");
        this.#cb = value;
        return true;
    }

    #aborted = false
    abort() {
        this.#aborted = true;
    }

    #nextTick() {
        return new Promise(r => requestAnimationFrame(r));
    }
    #task = [];
    #running = false;
    async #thread() {
        if (this.#running) return;
        this.#running = true;

        let task;
        while (!this.#aborted && this.#task.length) {
            task = this.#task.shift();
            if (!task) continue;

            const { start, end } = task;
            console.log(`%c正在获取数据 ${start}-${end}`, 'color: white; background:rgb(36, 127, 218); font-size: 16px; font-family: NSimsun;');
            const buffer = await this.#reader(start, end);
            buffer.fileStart = start;
            if (this.#aborted) break;
            queueMicrotask(() => this.#cb.call(this, start, end, buffer));

            await this.#nextTick();

            if (this.#aborted) break;
            // if (buffer.length !== 0 && this.#task.length === 0) {
            //     // 继续下载
            //     this.#task.push({
            //         start: end + 1,
            //         end: end + this.#bs
            //     });
            // }
        }

        this.#aborted = false;
        this.#running = false;
    }

    read(start, end) {
        if (!this.#cb) throw new Error("No callback has been set.");
        this.#aborted = false;
        const task = { start, end };
        this.#task.push(task);
        if (!this.#running) queueMicrotask(() => this.#thread());
    }
}

/**
 * 播放MP4视频的简化封装
 * @param {HTMLVideoElement} video - 视频元素
 * @param {MediaSource} ms - 已打开的MediaSource对象
 * @param {function(start: number, end: number): Promise<ArrayBuffer>} fileReader - 文件读取函数
 */
export async function PlayMp4Video(video, ms, fileReader, bs = 1000000) {
    let sb;
    const mp4boxfile = MP4Box.createFile();
    const ds = new DataSource(fileReader, bs);

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
            if (this.is_last) {
                this.ms.endOfStream();
            }
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

        const seek_info = mp4boxfile.seek(0, true);
        loadSegment(seek_info.offset, seek_info.offset + bs)
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

    ds.callback = async function (start, end, buffer) {
        console.log(`%cCallback被调用 ${start}-${end}`, 'color: white; background:rgb(236, 13, 17); font-size: 16px; font-family: NSimsun;');

        buffer.buffer.fileStart = start;
        mp4boxfile.appendBuffer(buffer.buffer, start === end || buffer.length === 0);
        mp4boxfile.flush();

        if (buffer.length === end - start) {
            ds.read(end + 1, end + bs + 1);
        }
    }
    async function loadSegment(start, end) {
        ds.read(start, end + 1);
    }
    console.log('loadSegment=', await loadSegment(0, 999999));

    return video;
}