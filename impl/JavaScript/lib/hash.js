import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

/**
 * 计算文件的哈希值 (Promise版本)
 * @param {string} filePath - 文件路径
 * @param {string} [algorithm='sha256'] - 哈希算法 (如 'md5', 'sha1', 'sha256')
 * @returns {Promise<string>} 十六进制哈希字符串
 */
export async function calculateFileHash(filePath, algorithm = 'sha256') {
    return new Promise((resolve, reject) => {
        const hash = createHash(algorithm);
        const stream = createReadStream(filePath);

        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}