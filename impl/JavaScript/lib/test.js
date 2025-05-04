import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { exec } from 'child_process';

let ttid = 0;

const server = http.createServer((req, res) => {
    const requestPath = url.parse(req.url).pathname;
    const filePath = path.join(process.cwd(), requestPath);

    try {
        // 如果请求/server-stop，则停止服务器
        if (requestPath === '/server-stop') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Server is stopping...' + (req.method === 'PUT' ? " (Bad)" : ""));
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

