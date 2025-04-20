import { encrypt_data, decrypt_data, encrypt_file, decrypt_file } from '../myencryption/main.js';

enc.onclick = async () => {
    try {
        data.value = await encrypt_data(data.value, pass.value);
    } catch (e) {
        alert(e);
    }  
}
dec.onclick = async () => {
    try {
        data.value = await decrypt_data(data.value, pass.value);
    } catch (e) {
        alert(e);
    }  
}


encf.onclick = async () => {
    let writable;
    try {
        const [fileHandle] = await window.showOpenFilePicker();
        const saveHandle = await window.showSaveFilePicker();

        const file = await fileHandle.getFile();
        const fileReader = async (start, end) => {
            const blob = file.slice(start, end);
            return new Uint8Array(await blob.arrayBuffer());
        };

        writable = await saveHandle.createWritable();
        const fileWriter = async (chunk) => {
            await writable.write(chunk);
        };

        const key = pass.value;

        fep.innerText = 'Reading file.';
        const success = await encrypt_file(fileReader, fileWriter, key, (current) => {
            fep.innerText = `Encrypt file progress: ${current} / ${file.size} ${current / file.size}`
        });
        if (success) {
            fep.innerText = 'Done.';
        } else {
            alert('File encryption failed.');
        }
    } catch (e) {
        console.error(e);
        alert(e);
    }  
    await writable.close();
}

decf.onclick = async () => {
    let writable;
    try {
        const [fileHandle] = await window.showOpenFilePicker();
        const saveHandle = await window.showSaveFilePicker();

        const file = await fileHandle.getFile();
        const fileReader = async (start, end) => {
            const blob = file.slice(start, end);
            return new Uint8Array(await blob.arrayBuffer());
        };

        writable = await saveHandle.createWritable();
        const fileWriter = async (chunk) => {
            await writable.write(chunk);
        };

        const key = pass.value;

        fep.innerText = 'Reading file.';
        const success = await decrypt_file(fileReader, fileWriter, key, (current) => {
            fep.innerText = `Decrypt file progress: ${current} / ${file.size} ${current / file.size}`
        });
        if (success) {
            fep.innerText = 'Done.';
        } else {
            alert('File decryption failed.');
        }
    } catch (e) {
        console.error(e);
        alert(e);
    }  
    await writable.close();
}

import { scrypt } from '../myencryption/derive_key.js';
tests.onclick = async () => {
    alert(await scrypt(stest.value, '123456', 262144, 8, 1, 32));
}