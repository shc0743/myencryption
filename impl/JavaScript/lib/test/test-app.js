import {
    ENCRYPTION_FILE_VER_1_1_0,
    ENCRYPTION_FILE_VER_1_2_10020,
    Exceptions,
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
} from 'simple-data-crypto';

console.log('Version: ', VERSION);

await new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
})

console.log('%cApp %cUnittest: %cStart', 'color: green; font-weight: bold;', 'color: black', 'color: blue');

export function unitLog(...args) {
    console.log('%cApp %cUnittest: ', 'color: green; font-weight: bold;', 'color: black', ...args);
}

export function unitAssert(value) {
    if (!value) {
        console.error('%cApp %cUnittest Failed', 'color: green; font-weight: bold;', 'color: red');
        throw new Error('Assertion failed');
    }
    console.info('%cApp %cUnittest %cAssert OK', 'color: green; font-weight: bold;', 'color: black', 'color: green');
}

unitLog('ENCRYPTION_FILE_VER_1_1_0=', ENCRYPTION_FILE_VER_1_1_0);
unitLog('ENCRYPTION_FILE_VER_1_2_10020=', ENCRYPTION_FILE_VER_1_2_10020);

try {

    unitLog('Test data encryption');

    const data = 'Hello, World!';
    const password = 'password123';

    unitLog('data=', data);
    const ciphertext = await encrypt_data(data, password);
    unitLog('ciphertext=', ciphertext);
    const ciphertext_with_custom_phrase = await encrypt_data(data, password, 'custom_phrase');
    unitLog('ciphertext_with_custom_phrase=', ciphertext_with_custom_phrase);
    const ciphertext_with_empty_phrase = await encrypt_data(data, password, '');
    unitLog('ciphertext_with_empty_phrase=', ciphertext_with_empty_phrase);
    const plaintext = await decrypt_data(ciphertext, password);
    unitLog('plaintext=', plaintext);

    unitAssert(plaintext === data);

    unitLog('Test file encryption');

    let srcFile = new Blob([data, 'lalala']);
    let buffer = [];

    unitAssert(await encrypt_file(async (start, end) => {
        return new Uint8Array(await srcFile.slice(start, end).arrayBuffer());
    }, (data) => {
        buffer.push(data);
    }, password));
    let encryptedFile = new Blob(buffer);

    // empty the buffer
    buffer.length = 0
    unitAssert(buffer.length === 0);
    
    unitAssert(await decrypt_file(async (start, end) => {
        return new Uint8Array(await encryptedFile.slice(start, end).arrayBuffer());
    }, (data) => {
        buffer.push(data);
    }, password));

    let decryptedFile = new Blob(buffer);
    let originalText = await srcFile.text();
    let decryptedText = await decryptedFile.text();
    unitLog('decryptedText=', decryptedText);
    unitAssert(decryptedText === originalText);

    unitLog("Try to change the password")
    const newpass = 'newpassword123';
    const newhead = (await change_file_password(encryptedFile, password, newpass));
    encryptedFile = new Blob([newhead, encryptedFile.slice(newhead.size)]);
    try {
        unitLog("Try to decrypt the file with the old password. Should fail.")
        buffer.length = 0;
        await decrypt_file(async (start, end) => {
            return new Uint8Array(await encryptedFile.slice(start, end).arrayBuffer()); 
        }, (data) => {
            buffer.push(data);
        }, password);
        unitAssert(false);
    } catch (e) {
        unitAssert(e instanceof Exceptions.CannotDecryptException);
    }
    unitLog("Try to decrypt the file with the new password. Should success.")
    buffer.length = 0;
    await decrypt_file(async (start, end) => {
        return new Uint8Array(await encryptedFile.slice(start, end).arrayBuffer());
    }, (data) => {
        buffer.push(data);
    }, newpass);
    decryptedFile = new Blob(buffer);
    decryptedText = await decryptedFile.text();
    unitLog('decryptedText=', decryptedText);
    unitAssert(decryptedText === originalText);

    unitLog("Test exporting the master key")
    try {
        unitLog("Try to export the master key with the old password. Should fail.")
        const masterKey = await export_master_key(encryptedFile, password, '111');
        unitAssert(false);
    } catch (e) {
        unitAssert(e instanceof Exceptions.CannotDecryptException);
    }
    unitLog("Try to export the master key with the new password. Should success.")
    const masterKey = await export_master_key(encryptedFile, newpass, '111');
    unitLog('masterKey=', await decrypt_data(masterKey, '111'));
    unitAssert(masterKey);

    // empty the buffer
    buffer.length = 0;
    unitAssert(buffer.length === 0);

    unitLog('Test scrypt');
    const scstr = 'lalala123';
    const scsalt = 'bebebe456';
    // 测试相同的输入是否能得到相同的输出
    /*
函数定义：
export async function scrypt_hex(key, salt, N, r, p, dklen) {
    return hexlify(await scrypt(str_encode(key), str_encode(salt), N, r, p, dklen));
}
    */
    const scN = 262144;
    const scr = 8;
    const scp = 1;
    const scdklen = 32;
    const scValue1 = await scrypt_hex(scstr, scsalt, scN, scr, scp, scdklen);
    const scValue2 = await scrypt_hex(scstr, scsalt, scN, scr, scp, scdklen);
    unitLog('scValue1=', scValue1);
    unitLog('scValue2=', scValue2);
    unitAssert(scValue1 === scValue2);


    unitLog('Test derive a key');
    const key = new Uint8Array(await new Blob(['lalala12378']).arrayBuffer());
    const iv = new Uint8Array(await new Blob(['bebebe45609']).arrayBuffer());
    const phrase = 'Furina';
    const dk1 = await derive_key(key, iv, phrase, scN, new Uint8Array(await new Blob([scsalt, 'exex']).arrayBuffer()), scr, scp, scdklen);
    unitLog('dk1=', dk1);
    const dk2 = await derive_key(key, iv, phrase, scN, new Uint8Array(await new Blob([scsalt, 'exex']).arrayBuffer()), scr, scp, scdklen);
    unitLog('dk2=', dk2);
    unitAssert(hexlify(dk1.derived_key) === hexlify(dk2.derived_key));


    unitLog('Test context');
    const ctx = await crypt_context_create();
    unitLog('ctx=', ctx);
    unitAssert(ctx);
    await crypt_context_destroy(ctx);
    unitLog('ctx destroyed');
    unitAssert(ctx._released);


    unitLog("test binascii")
    const hex = '313233'
    unitAssert(hexlify(unhexlify(hex)) === hex)
    const str = new Uint8Array(await new Blob(['456789']).arrayBuffer())
    unitAssert((hexlify(str)) === '343536373839');


    unitLog('More tests required -- will be added later')


    unitLog('Done')
}
catch (e) {
    e = String(e);
    // report the error to the server
    console.error(e, e.stack);
    fetch('/server-stop', {
        method: 'PUT',
        body: `Unexpected error: ${e}\n${e.stack}`,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8'
        }
    });
    document.getElementById('log').style.color = 'red';
    document.getElementById('log').style.fontSize = '5rem'
    document.getElementById('log').innerText = 'Test failed. Server stopped.';
    document.getElementById('cleanup').onclick = () => {
        close()
    }
    throw e;
}


// success
unitLog('Success!');
fetch('/server-stop').then((r) => {
    if (r.ok) {
        document.getElementById('log').innerText = 'Test passed. Server stopped.';
        let dontclose = false;
        document.getElementById('cleanup').onclick = () => {
            dontclose = true;
        }
        document.getElementById('cleanup').innerHTML = 'Don\'t close the window';
        setTimeout(() => {
            if (!dontclose) window.close();
        }, 3000);
    } else {
        console.error('Failed to stop server.');
    }
});