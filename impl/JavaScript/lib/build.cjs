const { build } = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outputDir = path.resolve(__dirname, './dist');
const filesToDelete = [
    'main.bundle.js', 'main.bundle.js.map',
    'main.bundle.min.js', 'main.bundle.min.js.map',
    'main.bundle.d.ts', 'main.bundle.min.d.ts',
];

filesToDelete.forEach(file => {
    const filePath = path.join(outputDir, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ 已删除文件: ${file}`);
    }
});

// 延迟2秒后执行
setTimeout(async () => {
    console.log(' ');
    console.time('编译用时');

    console.log("🔄 打包中...");
    // 主打包逻辑
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
    console.log('✅ 打包完成，所有ESM特性保留！');

    console.log(' ');

    console.log("🔄 编译中...");
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
    console.log('✅ 编译完成，所有ESM特性保留！');

    console.log(' ');

    console.log("🔄 复制类型定义文件...");
    fs.copyFileSync(
        path.join(__dirname, 'types', 'main.bundle.d.ts'),
        path.join(outputDir, 'main.bundle.d.ts')
    );
    fs.copyFileSync(
        path.join(__dirname, 'types', 'main.bundle.d.ts'),
        path.join(outputDir, 'main.bundle.min.d.ts')
    );
    console.log('✅ 类型定义文件已复制！');
    
    console.log('');
    console.timeEnd('编译用时');

    console.log("✅✅ 🐍build🐍: 成功! ✅✅");
}, 2000);