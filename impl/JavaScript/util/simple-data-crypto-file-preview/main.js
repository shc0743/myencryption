import {
    crypt_context_create,
    crypt_context_destroy,
    decrypt_stream_init,
    decrypt_stream,
    decrypt_blob,
    InputStream,
} from 'simple-data-crypto/builder';
import { PlayMp4Video } from 'play-video-streamed';
import 'common-file-preview';

export class HTMLSimpleDataCryptoFilePreviewElement extends HTMLElement {
    #shadow;
    #preview;
    #ctx;
    #cleanup;

    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: "open" });
        this.#preview = document.createElement("common-file-preview");
        this.#shadow.appendChild(this.#preview);
        const style = document.createElement("style");
        style.textContent = `
            :host {
                display: block;
                box-sizing: border-box;
                overflow: hidden;
            }
            common-file-preview, video {
                width: 100%;
                height: 100%;
            }
            common-file-preview {
                overflow: auto;
            }
            video {
                object-fit: contain;
                background-color: #000;
            }
        `;
        this.#shadow.appendChild(style);
    }

    connectedCallback() {

    }

    disconnectedCallback() {
        if (this.#ctx && this.#ctx !== true) {
            crypt_context_destroy(this.#ctx);
        }
        if (this.#cleanup) {
            this.#cleanup();
        }
    }

    async load(fileReader, password, size, type, fileName) {
        if (this.#ctx) {
            throw new Error("already loaded");
        }
        if (type !== "video") {
            // 其他文件类型当成blob处理
            const blob = new Blob([await fileReader(0, size)]);
            const decryptedBlob = new Blob([await decrypt_blob(blob, password)], { type });
            const url = URL.createObjectURL(decryptedBlob);
            this.#preview.init(() => url, type, fileName);
            this.#ctx = true;
            this.#cleanup = () => {
                URL.revokeObjectURL(url);
            };
            return;
        }
        // 处理视频
        const np = document.createElement('video');
        np.controls = true;
        np.playsInline = true;
        this.#preview.replaceWith(np);
        this.#preview = np;
        this.#ctx = await crypt_context_create(password);
        const stream = new InputStream(fileReader, size);
        await decrypt_stream_init(this.#ctx, stream, password);

        this.#cleanup = await PlayMp4Video(np, (async (start, end, controller) => {
            const buffer = await decrypt_stream(this.#ctx, start, end, controller);
            return buffer;
        }));
    }
}

customElements.define("simple-data-crypto-file-preview", HTMLSimpleDataCryptoFilePreviewElement);