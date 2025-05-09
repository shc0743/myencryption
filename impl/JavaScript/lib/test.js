import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { exec } from 'child_process';

// node test

import {
    ENCRYPTION_FILE_VER_1_1_0,
    ENCRYPTION_FILE_VER_1_2_10020,
    // Exceptions,
    Stream,
    VERSION,
    change_file_password,
    crypt_context_create,
    crypt_context_destroy,
    decrypt_data,
    decrypt_file,
    decrypt_stream,
    decrypt_stream_init,
    derive_key,
    encrypt_data,
    encrypt_file,
    export_master_key,
    // get_random_bytes,
    // get_random_int8_number,
    // get_random_uint8_number,
    hexlify,
    // normalize_version,
    // scrypt,
    scrypt_hex,
    // str_decode,
    // str_encode,
    unhexlify
} from './dist/main.bundle.node.js';

console.log("--NODE.JS TEST--");

console.log("Version:", VERSION);
console.log("File ver:", ENCRYPTION_FILE_VER_1_1_0, ";;", ENCRYPTION_FILE_VER_1_2_10020);

console.log("Test data encryption");
{
    const data = "123";
    const pass = "456;";
    const ciphertext = await encrypt_data(data, pass);
    console.log("ciphertext:", ciphertext);
    const plaintext = await decrypt_data(ciphertext, pass);
    console.log("plaintext:", plaintext);
    if (data !== plaintext) throw "Fail!";
}

console.info('More tests required -- will be added later')

console.log("--NODE.JS TEST END--\n\nBrowser test:\n");
// web test


let ttid = 0;

const server = http.createServer((req, res) => {
    const requestPath = url.parse(req.url).pathname;
    const filePath = path.join(process.cwd(), requestPath);

    try {
        // 如果请求/server-stop，则停止服务器
        if (requestPath === '/server-stop') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Server is stopping...' + (req.method === 'PUT' ? " (Bad)" : ""));
            if (process.argv[2] === 'debug') {
                console.warn('Warning:Debug mode on. Server will not stop unless Press Ctrl-C.');
            } else {
                server.close(() => {
                    if (req.method === 'PUT') {
                        console.error("Test failed!!");
                        console.error('Error:');
                        console.error(req.read()?.toString() || '');
                        process.exit(1);
                    }
                    else console.log('Test completed.');
                });
                server.closeAllConnections();
            }
            clearTimeout(ttid);
            return;
        }

        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            const indexPath = path.join(filePath, 'index.html');
            if (fs.existsSync(indexPath)) {
                fs.createReadStream(indexPath).pipe(res);
            } else {
                const files = fs.readdirSync(filePath);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`<pre>${files.join('\n')}</pre>`);
            }
        } else {
            const ext = path.extname(filePath);
            const contentType = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
            }[ext] || 'application/octet-stream';
            
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (err) {
        res.writeHead(404);
        res.end('404 Not Found');
    }
})



server.listen(36429, '127.0.0.1', () => {
    console.log("Test is running in your browser now. URL: http://127.0.0.1:36429/test/test-app.html");
    // 启动浏览器
    const platform = process.platform;
    const cmd = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${cmd} http://127.0.0.1:36429/test/test-app.html`);

    ttid = setTimeout(() => {
        server.close(() => {
            console.error('Test timed out.');
        });
        server.closeAllConnections();
    }, 30000);
});

