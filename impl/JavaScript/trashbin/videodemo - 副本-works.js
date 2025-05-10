import {
    crypt_context_create, crypt_context_destroy,
    decrypt_stream_init,
    Stream,
    decrypt_stream
} from '../myencryption/main.js';
const Log = MP4Box.Log;

/**
 * 播放MP4视频的简化封装
 * @param {HTMLVideoElement} video - 视频元素
 * @param {MediaSource} ms - 已打开的MediaSource对象
 * @param {function(start: number, end: number): Promise<ArrayBuffer>} fileReader - 文件读取函数
 */
async function PlayMp4Video(video, ms, fileReader) {
    const mp4boxfile = MP4Box.createFile();

    let videoInfo = null;
    let videoTrackId = null;
    let sourceBuffer = null;

    // 设置MP4Box回调
    mp4boxfile.onReady = function (info) {
        videoInfo = info;
        const videoTrack = info.tracks.find(track => track.type === 'video');
        if (!videoTrack) throw new Error('No video track found');

        videoTrackId = videoTrack.id;
        ms.duration = info.duration / info.timescale;

        const mime = `video/mp4; codecs="${videoTrack.codec}"`;
        if (!MediaSource.isTypeSupported(mime)) {
            throw new Error(`Unsupported codec: ${videoTrack.codec}`);
        }

        sourceBuffer = ms.addSourceBuffer(mime);
        sourceBuffer.addEventListener('error', console.error);
        mp4boxfile.setSegmentOptions(videoTrackId, sourceBuffer);
    };

    // 片段队列处理
    const pendingSegments = [];
    let isAppending = false;

    mp4boxfile.onSegment = (id, user, buffer) => {
        pendingSegments.push(buffer);
        if (!isAppending) processPendingSegments();
    };

    async function processPendingSegments() {
        if (pendingSegments.length === 0 || isAppending) return;

        isAppending = true;
        const buffer = pendingSegments.shift();

        try {
            await waitForBufferReady();
            sourceBuffer.appendBuffer(buffer);
            await new Promise(resolve => {
                sourceBuffer.addEventListener('updateend', resolve, { once: true });
            });
        } catch (error) {
            console.error('Error appending segment:', error);
        } finally {
            isAppending = false;
            processPendingSegments();
        }
    }

    function waitForBufferReady() {
        return new Promise(resolve => {
            const check = () => {
                if (!sourceBuffer.updating &&
                    (sourceBuffer.buffered.length === 0 ||
                        video.currentTime + 2 > sourceBuffer.buffered.end(0))) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    // 初始加载
    let filePosition = 0;
    const chunkSize = 1024 * 1024; // 1MB chunks

    // 加载初始数据以获取moov信息
    const initData = await fileReader(filePosition, filePosition + chunkSize);
    filePosition = mp4boxfile.appendBuffer(initData);

    // 等待元数据就绪
    await new Promise(resolve => {
        if (videoInfo) return resolve();
        const check = () => videoInfo ? resolve() : setTimeout(check, 50);
        check();
    });

    // 初始化SourceBuffer
    const initSegments = mp4boxfile.initializeSegmentation();
    for (const { buffer } of initSegments) {
        // await waitForBufferReady();
        sourceBuffer.appendBuffer(buffer);

    }

    // 持续加载媒体数据
    while (filePosition !== Infinity) {
        const chunk = await fileReader(filePosition, filePosition + chunkSize);
        filePosition = mp4boxfile.appendBuffer(chunk);

    }

    // 等待所有片段处理完成
    while (pendingSegments.length > 0 || isAppending) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    ms.endOfStream();
    await video.play().catch(console.error);
}


// const clgorig = console.info;
// console.info = function (...args) {
//     args.push(new Error("Traceback"));
//     clgorig.apply(this, args);
// }

async function play_Video(fileReader) {
    const video = document.createElement('video');
    video.controls = true;

    // Log.setLogLevel(Log.debug);
    let ms;
    await new Promise((resolve) => {
        ms = new MediaSource();
        video.src = URL.createObjectURL(ms);
        ms.addEventListener('sourceopen', () => {
            resolve()
        }, { once: true });
    });
    let sb;

    // PlayMp4Video(video, ms, async (start, end) => {
    //     console.log(`%c正在获取数据 ${start}-${end}`, 'color: white; background:rgb(36, 127, 218); font-size: 16px; font-family: NSimsun;');
    //     const data = (await (fileReader(start, end))).buffer;
    //     data.fileStart = start;
    //     return data;
    // }).then(() => {
    //     console.log("Success!");
    // }).catch(console.error);

    let pos = 0, bs = 1000000;

    // mp4box funcs
    const mp4boxfile = MP4Box.createFile();
    const addBuffer = function addBuffer(mp4track) {
        var track_id = mp4track.id;
        var codec = mp4track.codec;
        var mime = 'video/mp4; codecs=\"' + codec + '\"';
        var kind = mp4track.kind;
        var trackDefault;
        var trackDefaultSupport = (typeof TrackDefault !== "undefined");
        var html5TrackKind = "";
        if (codec == "wvtt") {
            if (!kind.schemeURI.startsWith("urn:gpac:")) {
                html5TrackKind = "subtitles";
            } else {
                html5TrackKind = "metadata";
            }
        } else {
            if (kind && kind.schemeURI === "urn:w3c:html5:kind") {
                html5TrackKind = kind.value || "";
            }
        }
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
            alert("ms not supported")
        }
    }
    const onInitAppended = function onInitAppended(e) {
        const sb = e.target;
        if (sb.ms.readyState === "open") {
            // updateBufferedString(sb, "Init segment append ended");
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
        console.log("Application", "Starting to parse movie information");
    }
    mp4boxfile.onReady = function (info) {
        console.log("视频元数据已准备好:", info);

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
    mp4boxfile.onSidx = function (sidx) {
        console.log('SIDX:', sidx);
    }
    mp4boxfile.onItem = function (item) {
        const metaHandler = this.getMetaHandler();
        if (metaHandler.startsWith("mif1")) {
            const pitem = this.getPrimaryItem();
            console.log("Found primary item in MP4 of type " + item.content_type);
            if (pitem.id === item.id) {
                video.poster = window.URL.createObjectURL(new Blob([item.data.buffer]));
            }
        }
    }
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
            console.log("Seeking called to video time " + (video.currentTime));
            downloader.stop();
            resetCues();
            const seek_info = mp4boxfile.seek(video.currentTime, true);
            loadSegment(seek_info.offset, seek_info.offset + bs)
            startButton.disabled = true;
            stopButton.disabled = false;
            video.lastSeekTime = video.currentTime;
        }
    });
    async function loadSegment(start, end) {
            console.log(`%c正在获取数据 ${start}-${end}`, 'color: white; background:rgb(36, 127, 218); font-size: 16px; font-family: NSimsun;');

        const blob = new Blob([await fileReader(start,end)])//await decrypt_stream(ctx, start, end);
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
    console.log(await loadSegment(0, 999999));

    return video;
}


strdec.onclick = async () => {
    const ctx = await crypt_context_create();
    strdec.ctx = ctx;

    try {
        const [fileHandle] = await window.showOpenFilePicker();

        const file = await fileHandle.getFile();
        const fileReader = async (start, end) => {
            const blob = file.slice(start, end);
            return new Uint8Array(await blob.arrayBuffer());
        };

        const key = pass.value;

        fep.innerText = 'Reading file.';

        // await decrypt_stream_init(ctx, new Stream((start, end) => {
        //     return fileReader(start, end)
        // }), file.size, key);
        // console.log(ctx);

        videoarea.innerText = 'Loading, wait...';

        const video = await play_Video(fileReader);
        video.setAttribute('style', 'width: 100%; height: 400px;')
        videoarea.innerHTML = '';
        videoarea.append(video);
    } catch (e) {
        console.error(e);
        alert(e);
    }
}
strdes.onclick = async () => {
    await crypt_context_destroy(strdec.ctx);
    videoarea.innerText = 'Stream destroyed.';
    console.log(strdec.ctx);
}