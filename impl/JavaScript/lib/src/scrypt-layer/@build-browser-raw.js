import { load_deps_es5 } from "../loader.js";
const scryptAPI = await load_deps_es5('scrypt', import.meta.resolve('./WebScrypt/scrypt.js'));
scryptAPI.setResPath(import.meta.resolve('./WebScrypt/asset/'));
scryptAPI.load();

//#include <scrypt-browser-impl.js>