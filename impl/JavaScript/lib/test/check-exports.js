import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { parse } from 'acorn';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const JS_FILE_PATH = path.resolve(__dirname, '../dist/main.bundle.js');
const DTS_FILE_PATH = path.resolve(__dirname, '../types/types.d.ts');

// 提取 JS 文件的导出
async function getJSExports(jsPath) {
    const code = await fs.promises.readFile(jsPath, 'utf-8');
    const ast = parse(code, {
        sourceType: 'module',
        ecmaVersion: 2022,
    });

    const exports = [];
    ast.body.forEach((node) => {
        if (node.type === 'ExportNamedDeclaration') {
            if (node.declaration) {
                // 处理 `export const/function/class`
                const name = node.declaration.id?.name;
                if (name) exports.push(name);
            } else if (node.specifiers) {
                // 处理 `export { A, B }`
                node.specifiers.forEach((spec) => exports.push(spec.exported.name));
            }
        } else if (node.type === 'ExportDefaultDeclaration') {
            exports.push('default');
        }
    });
    return exports;
}

// 提取 DTS 文件的导出
async function getDTSExports(dtsPath) {
    const program = ts.createProgram([dtsPath], {});
    const sourceFile = program.getSourceFile(dtsPath);
    const exports = [];

    ts.forEachChild(sourceFile, (node) => {
        // 场景1：处理顶层 export (如 export { Exceptions, Wrappers })
        if (ts.isExportDeclaration(node) && !node.moduleSpecifier) {
            if (node.exportClause && ts.isNamedExports(node.exportClause)) {
                node.exportClause.elements.forEach((element) => {
                    exports.push(element.name.text);
                });
            }
        }

        // 场景2：处理 declare module 内部的导出
        if (ts.isModuleDeclaration(node) && node.body) {
            const moduleBlock = node.body;
            if (ts.isModuleBlock(moduleBlock)) {
                moduleBlock.statements.forEach((stmt) => {
                    // 捕获 export function/const/class/interface
                    if ((ts.isFunctionDeclaration(stmt) ||
                            ts.isVariableStatement(stmt) ||
                            ts.isInterfaceDeclaration(stmt) ||
                            ts.isClassDeclaration(stmt)
                        )) {
                        if (stmt.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
                            if (ts.isVariableStatement(stmt)) {
                                stmt.declarationList.declarations.forEach((decl) => {
                                    if (ts.isIdentifier(decl.name)) exports.push(decl.name.text);
                                });
                            } else if (stmt.name) {
                                exports.push(stmt.name.text);
                            }
                        }
                    }
                });
            }
        }
    });

    return exports;
}

// 运行测试
async function testExportConsistency() {
    const jsExports = await getJSExports(JS_FILE_PATH);
    const dtsExports = await getDTSExports(DTS_FILE_PATH);

    // 检查缺失的导出
    const missingInDTS = jsExports.filter(x => !dtsExports.includes(x));
    const missingInJS = dtsExports.filter(x => !jsExports.includes(x));

    if (missingInDTS.length > 0 || missingInJS.length > 0) {
        console.error('❌ 检测到导出不一致：');
        if (missingInDTS.length > 0) {
            console.error('在 DTS 中缺失的导出：', missingInDTS); 
        }
        if (missingInJS.length > 0) {
            console.error('在 JS 中缺失的导出：', missingInJS); 
        }
        console.warn("请修复这些问题再继续发布！");
        process.exit(1);
    }

    console.log('✅ Export consistency check passed!');
}

// 执行测试
await testExportConsistency();
