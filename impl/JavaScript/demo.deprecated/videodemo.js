import {
    crypt_context_create, crypt_context_destroy,
    decrypt_stream_init,
    Stream,
    decrypt_stream
} from '../myencryption/dist/main.bundle.js';

import { PlayMp4Video, setLogEnabled } from './play_video.js';

setLogEnabled(true);

let cleanup = null;

async function play_Video(fileReader) {
    const video = document.createElement('video');
    video.controls = true;

    cleanup = await PlayMp4Video(video, fileReader, 1000000, (endOfStream) => {
        console.log('%c[App]%c Video ended. %cShould I end the stream?', 'color: green; font-weight: bold;', 'color: black;', 'color: #ff00ff;');
        //endOfStream();
    });
    
    return video;
}

async function getFileSize(url) {
    const abortController = new AbortController();
    const resp = await fetch(url, { signal: abortController.signal });
    if (!resp.ok) {
        throw new Error(`Failed to fetch file size: ${resp.statusText}`);
    }
    const contentLength = +resp.headers.get('Content-Length');
    if (isNaN(contentLength)) {
        throw new Error('Content-Length header is missing or invalid');
    }
    abortController.abort();
    return contentLength;
}


strdec.onclick = async () => {
    const ctx = await crypt_context_create();
    strdec.ctx = ctx;

    try {
        let file_size, fileReader;
        if (onlvideo.value) {
            file_size = await getFileSize(onlvideo.value);
            fileReader = async (start, end) => {
                const resp = await fetch(onlvideo.value, {
                    headers: {
                        'Range': `bytes=${start}-${end - 1}`
                    },
                    method: 'GET'
                });
                return new Uint8Array(await resp.arrayBuffer());
            }
        } else {
            const [fileHandle] = await window.showOpenFilePicker();

            const file = await fileHandle.getFile();
            file_size = file.size;
            fileReader = async (start, end) => {
                const blob = file.slice(start, end);
                return new Uint8Array(await blob.arrayBuffer());
            };
        }

        const key = pass.value;

        fep.innerText = 'Reading file.';

        await decrypt_stream_init(ctx, new Stream((start, end) => {
            return fileReader(start, end)
        }, file_size), key);
        console.log('ctx=', ctx);

        videoarea.innerText = 'Loading, wait...';

        const video = await play_Video(async (start, end) => {
            const buffer = await decrypt_stream(ctx, start, end);
            return buffer;
        });
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
    cleanup?.();cleanup = null;
    videoarea.innerText = 'Stream destroyed.';
    console.log('destroyed:', strdec.ctx);
}