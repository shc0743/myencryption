import { build } from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { calculateFileHash } from './hash.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, './dist');
const filesToDelete = [
    'main.bundle.js', 'main.bundle.js.map',
    'main.bundle.min.js', 'main.bundle.min.js.map',
    'main.bundle.node.js', 'main.bundle.node.js.map',
    'main.bundle.builder.js', 'main.bundle.builder.js.map',
];

filesToDelete.forEach(file => {
    const filePath = path.join(outputDir, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ 已删除文件: ${file}`);
    }
});

async function setCompileFile(pattern) {
    console.log("🔄 将模式设置为 " + pattern + '...');
    const base = './src/scrypt-layer/';
    const buildPath = base + '@build-' + pattern + '.js';
    const dynFile = base + 'dynamic-compile.js';
    const asmjsPath = base + 'WebScrypt/asset/asmjs.js';
    if (fs.existsSync(dynFile)) fs.unlinkSync(dynFile);
    // 复制模板文件
    let text = await fs.promises.readFile(buildPath, { encoding: 'utf-8' });
    if (pattern === 'browser-mixed' || pattern === 'browser-raw') {
        text = text
            .replaceAll(
                '//#include <scrypt-browser-impl.js>',
                await fs.promises.readFile(
                    base + 'scrypt-browser-impl.js',
                    { encoding: 'utf-8' }
                )
            )
    }
    if (pattern === 'browser-mixed') {
        text = text
            .replaceAll(
                'TEXTTEXTTEXTASMJSTEXTCONTENT',
                await fs.promises.readFile(
                    asmjsPath,
                    { encoding: 'utf-8' }
                )
            )
            .replaceAll(
                'SCRYPTLOADERHASHTEXTTEXTTEXT',
                'scrypt_loader_' + await calculateFileHash(asmjsPath, 'sha256')
            )
    }
    // 写入文件
    await fs.promises.writeFile(dynFile, text, { encoding: 'utf-8' });
}

// 延迟2秒后执行
setTimeout(async () => {
    console.log(' ');
    console.time('编译用时');

    console.log("🔄 编译中... (Node.JS)");
    await setCompileFile("node")
    await build({
        entryPoints: ['./src/main.js'],
        bundle: true,
        format: 'esm', // 保持ESM格式
        outfile: './dist/main.bundle.node.js',
        sourcemap: true,
        minify: false, // 构建工具会进行minify，我们不需要进行
        target: ['es2022'], // 保持现代JS特性
        loader: { '.js': 'jsx' }, // 防止任何非预期的转换
    })
    console.log('✅ 编译完成，所有ESM特性保留！\n');

    console.log("🔄 编译中... (构建工具优化版)");
    await setCompileFile("browser-mixed")
    await build({
        entryPoints: ['./src/main.js'],
        bundle: true,
        format: 'esm', // 保持ESM格式
        outfile: './dist/main.bundle.builder.js',
        sourcemap: true,
        minify: false, // 构建工具会进行minify，我们不需要进行
        target: ['es2022'], // 保持现代JS特性
        loader: { '.js': 'jsx' }, // 防止任何非预期的转换
    })
    console.log('✅ 编译完成，所有ESM特性保留！\n');

    console.log("🔄 打包中...");
    // 主打包逻辑
    await setCompileFile("browser-raw")
    await build({
        entryPoints: ['./src/main.js'],
        bundle: true,
        format: 'esm', // 保持ESM格式
        outfile: './dist/main.bundle.js',
        sourcemap: true,
        minify: false,
        target: ['es2022'], // 保持现代JS特性
        loader: { '.js': 'jsx' }, // 防止任何非预期的转换
    })
    console.log('✅ 打包完成，所有ESM特性保留！\n');

    console.log("🔄 编译中...");
    // await setCompileFile("browser-raw") // 同样也是 browser-raw 不需要重复
    await build({
        entryPoints: ['./src/main.js'],
        bundle: true,
        format: 'esm', // 保持ESM格式
        outfile: './dist/main.bundle.min.js',
        sourcemap: true,
        minify: true,
        target: ['es2022'], // 保持现代JS特性
        loader: { '.js': 'jsx' }, // 防止任何非预期的转换
    })
    console.log('✅ 编译完成，所有ESM特性保留！\n');
    
    console.log('');
    console.timeEnd('编译用时');

    console.log("✅✅ 🐍build🐍: 成功! ✅✅");
}, 2000);