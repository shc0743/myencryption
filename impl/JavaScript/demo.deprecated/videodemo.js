import {
    crypt_context_create, crypt_context_destroy,
    decrypt_stream_init,
    Stream,
    decrypt_stream
} from '../myencryption/main.js';

import { PlayMp4Video, setLogEnabled } from './play_video.js';

setLogEnabled(true);

let cleanup = null;

async function play_Video(fileReader) {
    const video = document.createElement('video');
    video.controls = true;
    let ms;
    await new Promise((resolve) => {
        ms = new MediaSource();
        video.src = URL.createObjectURL(ms);
        ms.addEventListener('sourceopen', () => {
            resolve()
        }, { once: true });
    });

    cleanup = await PlayMp4Video(video, ms, fileReader);
    
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

        await decrypt_stream_init(ctx, new Stream((start, end) => {
            return fileReader(start, end)
        }), file.size, key);
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