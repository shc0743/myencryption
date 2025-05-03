const { build } = require('esbuild');
const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '../dist');
const filesToDelete = [
    'main.bundle.js', 'main.bundle.js.map',
    'main.bundle.min.js', 'main.bundle.min.js.map',
];

filesToDelete.forEach(file => {
    const filePath = path.join(outputDir, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ 已删除文件: ${file}`);
    }
});

// 延迟2秒后执行
setTimeout(() => {

    // 主打包逻辑
    build({
        entryPoints: ['main.js'],
        bundle: true,
        format: 'esm', // 保持ESM格式
        outfile: '../dist/main.bundle.js',
        sourcemap: true,
        minify: false,
        target: ['es2022'], // 保持现代JS特性
        loader: { '.js': 'jsx' }, // 防止任何非预期的转换
    }).then(() => {
        console.log('✅ 打包完成，所有ESM特性保留！');
    });

    build({
        entryPoints: ['main.js'],
        bundle: true,
        format: 'esm', // 保持ESM格式
        outfile: '../dist/main.bundle.min.js',
        sourcemap: true,
        minify: true,
        target: ['es2022'], // 保持现代JS特性
        loader: { '.js': 'jsx' }, // 防止任何非预期的转换
    }).then(() => {
        console.log('✅ 编译完成，所有ESM特性保留！');
    });
        
}, 2000);