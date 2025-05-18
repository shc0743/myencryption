var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/binascii.js
var hexTable = new Array(256);
for (let i = 0; i < 256; i++) {
  hexTable[i] = i.toString(16).padStart(2, "0");
}
function hexlify(data) {
  if (!data || !(data instanceof Uint8Array)) {
    throw new TypeError("Input must be a Uint8Array");
  }
  const length = data.length;
  const arr = new Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = hexTable[data[i]];
  }
  return arr.join("");
}
var throwing = {
  get InvalidHexStringException() {
    throw new TypeError("Invalid hex string");
  }
};
function unhexlify(hexStr) {
  if (typeof hexStr !== "string") {
    throw new TypeError("Input must be a string");
  }
  const length = hexStr.length;
  if (length % 2 !== 0) {
    throw new TypeError("Hex string must have even length");
  }
  hexStr = hexStr.toLowerCase();
  const bytes = new Uint8Array(length >> 1);
  for (let i = 0; i < length; i += 2) {
    const highCode = hexStr.charCodeAt(i);
    const lowCode = hexStr.charCodeAt(i + 1);
    const high = highCode >= 97 && highCode <= 102 ? highCode - 87 : highCode >= 48 && highCode <= 57 ? highCode - 48 : throwing.InvalidHexStringException;
    const low = lowCode >= 97 && lowCode <= 102 ? lowCode - 87 : lowCode >= 48 && lowCode <= 57 ? lowCode - 48 : throwing.InvalidHexStringException;
    bytes[i >> 1] = high << 4 | low;
  }
  return bytes;
}

// src/random.js
function get_random_bytes(count) {
  const randomBytes = new Uint8Array(count);
  crypto.getRandomValues(randomBytes);
  return randomBytes;
}
function get_random_int8_number() {
  const randomBytes = get_random_bytes(1);
  return new Int8Array(randomBytes)[0];
}
function get_random_uint8_number() {
  const randomBytes = get_random_bytes(1);
  return new Uint8Array(randomBytes)[0];
}

// src/str.js
function str_encode(input, encoding = "utf-8") {
  if (typeof input !== "string") {
    throw new TypeError("Input must be a string");
  }
  if (encoding.toLowerCase() !== "utf-8") {
    throw new Error("Only 'utf-8' encoding is supported");
  }
  return new TextEncoder().encode(input);
}
function str_decode(input, encoding = "utf-8") {
  if (!(input instanceof Uint8Array)) {
    input = new Uint8Array(input);
  }
  if (encoding.toLowerCase() !== "utf-8") {
    throw new Error("Only 'utf-8' encoding is supported");
  }
  return new TextDecoder().decode(input);
}

// src/exceptions.js
var exceptions_exports = {};
__export(exceptions_exports, {
  BadDataException: () => BadDataException,
  CannotDecryptException: () => CannotDecryptException,
  ChaCha20NotSupportedException: () => ChaCha20NotSupportedException,
  CryptContextNotInitedException: () => CryptContextNotInitedException,
  CryptContextReleasedException: () => CryptContextReleasedException,
  CryptContextReusedException: () => CryptContextReusedException,
  DangerousEncryptionAlgorithmException: () => DangerousEncryptionAlgorithmException,
  DataError: () => DataError,
  EncryptionAlgorithmNotSupportedException: () => EncryptionAlgorithmNotSupportedException,
  EncryptionError: () => EncryptionError,
  EncryptionVersionMismatchException: () => EncryptionVersionMismatchException,
  EndOfFileException: () => EndOfFileException,
  ExpectedError: () => ExpectedError,
  FileCorruptedException: () => FileCorruptedException,
  IVException: () => IVException,
  InputError: () => InputError,
  InternalError: () => InternalError,
  InvalidCryptContextTypeException: () => InvalidCryptContextTypeException,
  InvalidEndMarkerException: () => InvalidEndMarkerException,
  InvalidFileFormatException: () => InvalidFileFormatException,
  InvalidParameterException: () => InvalidParameterException,
  InvalidScryptParameterException: () => InvalidScryptParameterException,
  LibraryError: () => LibraryError,
  NetworkError: () => NetworkError,
  NotSupportedException: () => NotSupportedException,
  OperationNotPermittedException: () => OperationNotPermittedException,
  ParameterError: () => ParameterError,
  RuntimeException: () => RuntimeException,
  UnexpectedError: () => UnexpectedError,
  UnexpectedFailureInChunkDecryptionException: () => UnexpectedFailureInChunkDecryptionException,
  UserException: () => UserException,
  VersionSystemError: () => VersionSystemError
});
var LibraryError = class extends Error {
  constructor(message = "Library Error", additional = void 0) {
    super(message, additional);
    this.name = "LibraryError";
  }
};
var EncryptionError = class extends LibraryError {
  constructor(message = "Encryption Error", additional = void 0) {
    super(message, additional);
    this.name = "EncryptionError";
  }
};
var NetworkError = class extends LibraryError {
  constructor(message = "(Network Error)", additional = void 0) {
    super(message, additional);
    this.name = "NetworkError";
  }
};
var ExpectedError = class extends EncryptionError {
  constructor(message = "(Expected Error)", additional = void 0) {
    super(message, additional);
    this.name = "ExpectedError";
  }
};
var RuntimeException = class extends EncryptionError {
  constructor(message = "(Runtime Error)", additional = void 0) {
    super(message, additional);
    this.name = "RuntimeException";
  }
};
var UnexpectedError = class extends RuntimeException {
  constructor(message = "(Unexpected Error)", additional = void 0) {
    super(message, additional);
    this.name = "UnexpectedError";
  }
};
var InternalError = class extends UnexpectedError {
  constructor(message = "(Internal Error)", additional = void 0) {
    super(message, additional);
    this.name = "InternalError";
  }
};
var InputError = class extends RuntimeException {
  constructor(message = "(Input Error)", additional = void 0) {
    super(message, additional);
    this.name = "InputError";
  }
};
var ParameterError = class extends InputError {
  constructor(message = "(Data Error)", additional = void 0) {
    super(message, additional);
    this.name = "ParameterError";
  }
};
var DataError = class extends InputError {
  constructor(message = "(Data Error)", additional = void 0) {
    super(message, additional);
    this.name = "DataError";
  }
};
var UserException = class extends RuntimeException {
  constructor(message = "(The end user has a fault that caused the exception. This is not code bug.)", additional = void 0) {
    super(message, additional);
    this.name = "UserException";
  }
};
var VersionSystemError = class extends DataError {
  constructor(message = "(Version System Error)", additional = void 0) {
    super(message, additional);
    this.name = "VersionSystemError";
  }
};
var InvalidParameterException = class extends ParameterError {
  constructor(message = "The parameter provided is invalid.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidParameterException";
  }
};
var BadDataException = class extends DataError {
  constructor(message = "The data is bad.", additional = void 0) {
    super(message, additional);
    this.name = "BadDataException";
  }
};
var InvalidScryptParameterException = class extends ParameterError {
  constructor(message = "The N, r, or p is not valid or out of range.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidScryptParameterException";
  }
};
var EncryptionVersionMismatchException = class extends VersionSystemError {
  constructor(message = "The version of the encryption library doesn't match.", additional = void 0) {
    super(message, additional);
    this.name = "EncryptionVersionMismatchException";
  }
};
var InvalidFileFormatException = class extends DataError {
  constructor(message = "The file format is invalid.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidFileFormatException";
  }
};
var IVException = class extends InternalError {
  constructor(message = "IV Exception.", additional = void 0) {
    super(message, additional);
    this.name = "IVException";
  }
};
var FileCorruptedException = class extends DataError {
  constructor(message = "File is corrupted.", additional = void 0) {
    super(message, additional);
    this.name = "FileCorruptedException";
  }
};
var InvalidEndMarkerException = class extends DataError {
  constructor(message = "The end marker is invalid.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidEndMarkerException";
  }
};
var CannotDecryptException = class extends UserException {
  constructor(message = "Cannot decrypt", additional = void 0) {
    super(message, additional);
    this.name = "CannotDecryptException";
  }
};
var UnexpectedFailureInChunkDecryptionException = class extends UnexpectedError {
  constructor(message = "An unexpected failure occurred while decrypting the chunk. The file may be corrupted.", additional = void 0) {
    super(message, additional);
    this.name = "UnexpectedFailureInChunkDecryptionException";
  }
};
var CryptContextReusedException = class extends ParameterError {
  constructor(message = "Not allowed to reuse a crypt context.", additional = void 0) {
    super(message, additional);
    this.name = "CryptContextReusedException";
  }
};
var NotSupportedException = class extends InputError {
  constructor(message = "Operation not supported", additional = void 0) {
    super(message, additional);
    this.name = "NotSupportedException";
  }
};
var EndOfFileException = class extends ExpectedError {
  constructor(message = "End of File", additional = void 0) {
    super(message, additional);
    this.name = "EndOfFileException";
  }
};
var CryptContextNotInitedException = class extends ParameterError {
  constructor(message = "Crypt context is not initialized.", additional = void 0) {
    super(message, additional);
    this.name = "CryptContextNotInitedException";
  }
};
var InvalidCryptContextTypeException = class extends ParameterError {
  constructor(message = "Invalid crypt context type.", additional = void 0) {
    super(message, additional);
    this.name = "InvalidCryptContextTypeException";
  }
};
var CryptContextReleasedException = class extends ParameterError {
  constructor(message = "Crypt context has been released.", additional = void 0) {
    super(message, additional);
    this.name = "CryptContextReleasedException";
  }
};
var OperationNotPermittedException = class extends ParameterError {
  constructor(message = "Operation not permitted.", additional = void 0) {
    super(message, additional);
    this.name = "OperationNotPermittedException";
  }
};
var EncryptionAlgorithmNotSupportedException = class extends DataError {
  constructor(message = "The specified encryption algorithm is not supported.", additional = void 0) {
    super(message, additional);
    this.name = "EncryptionAlgorithmNotSupportedException";
  }
};
var ChaCha20NotSupportedException = class extends EncryptionAlgorithmNotSupportedException {
  constructor(message = "ChaCha20 is not supported yet.", additional = void 0) {
    super(message, additional);
    this.name = "ChaCha20NotSupportedException";
  }
};
var DangerousEncryptionAlgorithmException = class extends EncryptionAlgorithmNotSupportedException {
  constructor(message = "The specified encryption algorithm is DANGEROUS.", additional = void 0) {
    super(message, additional);
    this.name = "DangerousEncryptionAlgorithmException";
  }
};

// src/scrypt-layer/dynamic-compile.js
var window2 = {};
!function() {
  const window = window2;
  var util;
  !function(r) {
    function n(r2) {
      return f ? new f(r2) : new Array(r2);
    }
    function o(r2) {
      return f ? new f(r2) : r2;
    }
    function t(r2) {
      for (var o2 = r2.length / 2, t2 = n(o2), e2 = 0; e2 < o2; e2++) {
        var a2 = parseInt(r2.substr(2 * e2, 2), 16);
        if (isNaN(a2)) throw Error("invalid hex data");
        t2[e2] = a2;
      }
      return t2;
    }
    function e(r2) {
      for (var n2 = r2.length, o2 = "", t2 = 0; t2 < n2; t2++) {
        var e2 = 255 & r2[t2], a2 = e2.toString(16);
        e2 < 16 && (a2 = "0" + a2), o2 += a2;
      }
      return o2;
    }
    function a(r2) {
      var n2 = window.TextEncoder;
      if (n2) return new n2().encode(r2);
      for (var t2 = [], e2 = 0, a2 = 0, i2 = encodeURI(r2), c2 = i2.length; e2 < c2; ) {
        var f2 = i2.charCodeAt(e2);
        if (37 == f2) {
          var s = i2.substr(e2 + 1, 2);
          f2 = parseInt(s, 16), e2 += 3;
        } else e2++;
        t2[a2++] = f2;
      }
      return o(t2);
    }
    function i(r2) {
      for (var n2 = r2.length, o2 = "", t2 = 0; t2 < n2; t2++) {
        var e2 = r2[t2], a2 = e2.toString(16);
        e2 < 16 && (a2 = "0" + a2), o2 += "%" + a2;
      }
      return decodeURIComponent(o2);
    }
    function c(r2) {
      r2.style.cssText = "position:absolute;top:-999px";
    }
    var f = window.Uint8Array;
    r.hexToBytes = t, r.bytesToHex = e, r.strToBytes = a, r.bytesToStr = i, r.hideDom = c;
  }(util || (util = {}));
  var asmjsLoader;
  !function(loader) {
    function n() {
      return "Worker" in window;
    }
    function load(resPath) {
      factory_object.__asmjs_cb = asmjsCallback;
      (async function() {
        try {
          const text = `
const window = globalThis["scrypt_loader_9470f487e3aa154f278269e99e6a42502ca77b8da3867a46a548909659a3db4a"]
/// START ASM.JS
!function(){function A(){"use strict";function A(A){return r(self,{},A)}function e(){return 8200}var r=function(A,e,r){"use asm";var n=new A.Int32Array(r),t=A.Math.imul,i=new A.Int8Array(r),a=new A.Uint8Array(r);function o(A,e,r,o,u,c,s){A=A|0;e=e|0;r=r|0;o=o|0;u=u|0;c=c|0;s=s|0;var l=0,w=0,h=0,v=0,d=0,y=0,p=0,g=0,b=0,m=0,M=0,k=0,U=0,L=0,I=0,x=0,E=0,D=0,K=0,R=0,B=0,F=0,O=0,_=0,C=0,H=0,j=0,q=0,G=0,N=0,P=0,S=0;C=e<<7;q=e<<5;N=o+C|0;M=o+(e<<8)|0;if(u|0){A:do if(c>>>0<s>>>0){k=C+-64|0;U=o+k|0;L=A+-1|0;I=q&1073741792;x=N+k|0;if(!I){b=c;while(1){f(o,N,e);f(N,o,e);b=b+2|0;if(b>>>0>=s>>>0)break A}}else g=c;do{_=M+((t(n[U>>2]&L,q)|0)<<2)|0;v=0;do{H=o+(v<<2)|0;n[H>>2]=n[H>>2]^n[_+(v<<2)>>2];v=v+1|0}while((v|0)!=(I|0));f(o,N,e);j=M+((t(n[x>>2]&L,q)|0)<<2)|0;d=0;do{G=N+(d<<2)|0;n[G>>2]=n[G>>2]^n[j+(d<<2)>>2];d=d+1|0}while((d|0)!=(I|0));f(N,o,e);g=g+2|0}while(g>>>0<s>>>0)}while(0);if((s|0)==(A|0)&(q|0)!=0)m=0;else return;do{P=r+(m<<2)|0;S=n[o+(m<<2)>>2]|0;i[P>>0]=S;i[P+1>>0]=S>>>8;i[P+2>>0]=S>>>16;i[P+3>>0]=S>>>24;m=m+1|0}while((m|0)!=(q|0));return}if((c|0)==0&(q|0)!=0){p=0;do{E=r+(p<<2)|0;n[o+(p<<2)>>2]=(a[E+1>>0]|0)<<8|(a[E>>0]|0)|(a[E+2>>0]|0)<<16|(a[E+3>>0]|0)<<24;p=p+1|0}while((p|0)!=(q|0))}D=t(q,c)|0;K=t(q,s)|0;if(D>>>0>=K>>>0)return;R=q&1073741792;if(!R){w=D;do{f(o,N,e);w=w+q+q|0;f(N,o,e)}while(w>>>0<K>>>0);return}else l=D;do{B=M+(l<<2)|0;h=0;do{n[B+(h<<2)>>2]=n[o+(h<<2)>>2];h=h+1|0}while((h|0)!=(R|0));F=l+q|0;f(o,N,e);O=M+(F<<2)|0;y=0;do{n[O+(y<<2)>>2]=n[N+(y<<2)>>2];y=y+1|0}while((y|0)!=(R|0));l=F+q|0;f(N,o,e)}while(l>>>0<K>>>0);return}function f(A,e,r){A=A|0;e=e|0;r=r|0;var t=0,i=0,a=0,o=0,f=0,u=0,c=0,s=0,l=0,w=0,h=0,v=0,d=0,y=0,p=0,g=0,b=0,m=0,M=0,k=0,U=0,L=0,I=0,x=0,E=0,D=0,K=0,R=0,B=0,F=0,O=0,_=0,C=0,H=0,j=0,q=0,G=0,N=0,P=0,S=0,V=0,Z=0,Q=0,T=0,J=0,Y=0,W=0,z=0,X=0,$=0,AA=0,eA=0,rA=0,nA=0,tA=0,iA=0,aA=0,oA=0,fA=0,uA=0,cA=0,sA=0,lA=0,wA=0,hA=0,vA=0,dA=0,yA=0,pA=0,gA=0,bA=0,mA=0,MA=0,kA=0,UA=0,LA=0,IA=0,xA=0,EA=0,DA=0,KA=0,RA=0,BA=0,FA=0,OA=0,_A=0,CA=0,HA=0,jA=0,qA=0,GA=0,NA=0,PA=0,SA=0,VA=0,ZA=0,QA=0,TA=0,JA=0,YA=0,WA=0,zA=0,XA=0,$A=0,Ae=0,ee=0,re=0,ne=0,te=0,ie=0,ae=0,oe=0,fe=0,ue=0,ce=0,se=0,le=0,we=0,he=0,ve=0,de=0,ye=0,pe=0,ge=0,be=0,me=0,Me=0,ke=0,Ue=0,Le=0,Ie=0,xe=0,Ee=0,De=0,Ke=0,Re=0,Be=0,Fe=0,Oe=0,_e=0,Ce=0,He=0,je=0,qe=0,Ge=0,Ne=0,Pe=0,Se=0,Ve=0,Ze=0,Qe=0,Te=0,Je=0,Ye=0,We=0,ze=0,Xe=0,$e=0,Ar=0,er=0,rr=0,nr=0,tr=0,ir=0,ar=0,or=0,fr=0,ur=0,cr=0,sr=0,lr=0,wr=0,hr=0,vr=0,dr=0,yr=0,pr=0,gr=0,br=0,mr=0,Mr=0,kr=0,Ur=0,Lr=0,Ir=0,xr=0,Er=0,Dr=0,Kr=0,Rr=0,Br=0,Fr=0,Or=0,_r=0,Cr=0,Hr=0,jr=0,qr=0,Gr=0,Nr=0,Pr=0,Sr=0,Vr=0,Zr=0,Qr=0,Tr=0,Jr=0,Yr=0,Wr=0,zr=0,Xr=0,$r=0,An=0,en=0,rn=0,nn=0,tn=0,an=0,on=0,fn=0,un=0,cn=0,sn=0,ln=0,wn=0,hn=0,vn=0,dn=0,yn=0,pn=0,gn=0,bn=0,mn=0,Mn=0,kn=0,Un=0,Ln=0,In=0,xn=0,En=0,Dn=0,Kn=0,Rn=0,Bn=0,Fn=0,On=0,_n=0,Cn=0,Hn=0,jn=0,qn=0,Gn=0,Nn=0,Pn=0,Sn=0,Vn=0,Zn=0,Qn=0,Tn=0,Jn=0,Yn=0,Wn=0,zn=0,Xn=0,$n=0,At=0,et=0,rt=0,nt=0,tt=0,it=0,at=0,ot=0,ft=0,ut=0,ct=0,st=0,lt=0,wt=0,ht=0,vt=0,dt=0,yt=0,pt=0,gt=0,bt=0,mt=0,Mt=0,kt=0,Ut=0,Lt=0,It=0,xt=0,Et=0,Dt=0,Kt=0,Rt=0,Bt=0,Ft=0,Ot=0,_t=0,Ct=0,Ht=0,jt=0,qt=0,Gt=0,Nt=0,Pt=0,St=0,Vt=0,Zt=0,Qt=0,Tt=0,Jt=0,Yt=0,Wt=0,zt=0,Xt=0,$t=0,Ai=0,ei=0,ri=0,ni=0,ti=0,ii=0,ai=0,oi=0,fi=0,ui=0,ci=0,si=0,li=0,wi=0,hi=0,vi=0,di=0,yi=0,pi=0,gi=0,bi=0,mi=0,Mi=0,ki=0,Ui=0,Li=0,Ii=0,xi=0,Ei=0,Di=0,Ki=0,Ri=0,Bi=0,Fi=0,Oi=0,_i=0,Ci=0,Hi=0,ji=0,qi=0,Gi=0,Ni=0,Pi=0,Si=0,Vi=0,Zi=0,Qi=0,Ti=0,Ji=0,Yi=0,Wi=0,zi=0,Xi=0,$i=0,Aa=0,ea=0,ra=0,na=0,ta=0,ia=0,aa=0,oa=0,fa=0,ua=0,ca=0,sa=0,la=0,wa=0,ha=0,va=0,da=0,ya=0,pa=0,ga=0,ba=0,ma=0,Ma=0,ka=0,Ua=0,La=0,Ia=0,xa=0,Ea=0,Da=0,Ka=0,Ra=0,Ba=0,Fa=0,Oa=0,_a=0,Ca=0,Ha=0,ja=0,qa=0,Ga=0,Na=0,Pa=0,Sa=0,Va=0,Za=0,Qa=0,Ta=0,Ja=0,Ya=0,Wa=0,za=0,Xa=0,$a=0,Ao=0,eo=0,ro=0,no=0,to=0,io=0,ao=0,oo=0,fo=0,uo=0,co=0,so=0,lo=0,wo=0,ho=0,vo=0,yo=0,po=0,go=0,bo=0,mo=0,Mo=0,ko=0,Uo=0,Lo=0,Io=0,xo=0,Eo=0,Do=0,Ko=0,Ro=0,Bo=0,Fo=0,Oo=0,_o=0,Co=0,Ho=0,jo=0,qo=0,Go=0,No=0,Po=0,So=0,Vo=0,Zo=0,Qo=0,To=0,Jo=0,Yo=0,Wo=0,zo=0,Xo=0,$o=0,Af=0,ef=0,rf=0,nf=0,tf=0,af=0,of=0,ff=0,uf=0,cf=0,sf=0,lf=0,wf=0,hf=0,vf=0,df=0,yf=0,pf=0,gf=0,bf=0,mf=0,Mf=0,kf=0,Uf=0,Lf=0,If=0,xf=0,Ef=0,Df=0,Kf=0,Rf=0,Bf=0,Ff=0,Of=0,_f=0,Cf=0,Hf=0,jf=0,qf=0,Gf=0,Nf=0,Pf=0,Sf=0,Vf=0,Zf=0,Qf=0,Tf=0,Jf=0,Yf=0,Wf=0,zf=0,Xf=0,$f=0,Au=0,eu=0,ru=0,nu=0,tu=0,iu=0,au=0,ou=0,fu=0,uu=0,cu=0,su=0,lu=0,wu=0,hu=0,vu=0,du=0,yu=0,pu=0,gu=0,bu=0,mu=0,Mu=0,ku=0,Uu=0,Lu=0,Iu=0,xu=0,Eu=0,Du=0,Ku=0,Ru=0,Bu=0,Fu=0,Ou=0,_u=0,Cu=0,Hu=0,ju=0,qu=0,Gu=0,Nu=0,Pu=0,Su=0,Vu=0;ct=r<<1;Ba=A+((r<<5)+-16<<2)|0;if(!ct)return;Tt=r<<4;t=n[Ba>>2]|0;i=n[Ba+4>>2]|0;a=n[Ba+8>>2]|0;o=n[Ba+12>>2]|0;f=n[Ba+16>>2]|0;u=n[Ba+20>>2]|0;c=n[Ba+24>>2]|0;s=n[Ba+28>>2]|0;l=n[Ba+32>>2]|0;w=n[Ba+36>>2]|0;h=n[Ba+40>>2]|0;v=n[Ba+44>>2]|0;d=n[Ba+48>>2]|0;y=n[Ba+52>>2]|0;p=n[Ba+56>>2]|0;g=n[Ba+60>>2]|0;b=0;do{Xt=b<<4;ni=A+(Xt<<2)|0;li=n[ni>>2]^t;Li=n[ni+4>>2]^i;ji=n[ni+8>>2]^a;zi=n[ni+12>>2]^o;ca=n[ni+16>>2]^f;ka=n[ni+20>>2]^u;Ha=n[ni+24>>2]^c;Wa=n[ni+28>>2]^s;fo=n[ni+32>>2]^l;mo=n[ni+36>>2]^w;Bo=n[ni+40>>2]^h;Wo=n[ni+44>>2]^v;ff=n[ni+48>>2]^d;gf=n[ni+52>>2]^y;Bf=n[ni+56>>2]^p;Zf=n[ni+60>>2]^g;Wf=ff+li|0;wu=(Wf<<7|Wf>>>25)^ca;pu=wu+li|0;_u=(pu<<9|pu>>>23)^fo;Gu=_u+wu|0;F=(Gu<<13|Gu>>>19)^ff;j=F+_u|0;eA=(j<<18|j>>>14)^li;aA=ka+Li|0;kA=mo^(aA<<7|aA>>>25);EA=kA+ka|0;ZA=gf^(EA<<9|EA>>>23);WA=ZA+kA|0;we=(WA<<13|WA>>>19)^Li;pe=we+ZA|0;_e=(pe<<18|pe>>>14)^ka;Ge=Bo+Ha|0;nr=Bf^(Ge<<7|Ge>>>25);fr=nr+Bo|0;Lr=(fr<<9|fr>>>23)^ji;Kr=Lr+nr|0;Zr=(Kr<<13|Kr>>>19)^Ha;Yr=Zr+Lr|0;en=(Yr<<18|Yr>>>14)^Bo;rn=Zf+Wo|0;nn=(rn<<7|rn>>>25)^zi;tn=nn+Zf|0;an=(tn<<9|tn>>>23)^Wa;on=an+nn|0;fn=(on<<13|on>>>19)^Wo;un=fn+an|0;cn=(un<<18|un>>>14)^Zf;sn=eA+nn|0;ln=(sn<<7|sn>>>25)^we;wn=ln+eA|0;hn=(wn<<9|wn>>>23)^Lr;vn=hn+ln|0;dn=(vn<<13|vn>>>19)^nn;yn=dn+hn|0;pn=(yn<<18|yn>>>14)^eA;gn=_e+wu|0;bn=(gn<<7|gn>>>25)^Zr;mn=bn+_e|0;Mn=(mn<<9|mn>>>23)^an;kn=Mn+bn|0;Un=(kn<<13|kn>>>19)^wu;Ln=Un+Mn|0;In=(Ln<<18|Ln>>>14)^_e;xn=en+kA|0;En=(xn<<7|xn>>>25)^fn;Dn=En+en|0;Kn=(Dn<<9|Dn>>>23)^_u;Rn=Kn+En|0;Bn=(Rn<<13|Rn>>>19)^kA;Fn=Bn+Kn|0;On=(Fn<<18|Fn>>>14)^en;_n=cn+nr|0;Cn=(_n<<7|_n>>>25)^F;Hn=Cn+cn|0;jn=(Hn<<9|Hn>>>23)^ZA;qn=jn+Cn|0;Gn=(qn<<13|qn>>>19)^nr;Nn=Gn+jn|0;Pn=(Nn<<18|Nn>>>14)^cn;Sn=pn+Cn|0;Vn=(Sn<<7|Sn>>>25)^Un;Zn=Vn+pn|0;Qn=(Zn<<9|Zn>>>23)^Kn;Tn=Qn+Vn|0;Jn=(Tn<<13|Tn>>>19)^Cn;Yn=Jn+Qn|0;Wn=(Yn<<18|Yn>>>14)^pn;zn=In+ln|0;Xn=(zn<<7|zn>>>25)^Bn;$n=Xn+In|0;At=($n<<9|$n>>>23)^jn;et=At+Xn|0;rt=(et<<13|et>>>19)^ln;nt=rt+At|0;tt=(nt<<18|nt>>>14)^In;it=On+bn|0;at=(it<<7|it>>>25)^Gn;ot=at+On|0;ft=(ot<<9|ot>>>23)^hn;ut=ft+at|0;st=(ut<<13|ut>>>19)^bn;lt=st+ft|0;wt=(lt<<18|lt>>>14)^On;ht=Pn+En|0;vt=(ht<<7|ht>>>25)^dn;dt=vt+Pn|0;yt=(dt<<9|dt>>>23)^Mn;pt=yt+vt|0;gt=(pt<<13|pt>>>19)^En;bt=gt+yt|0;mt=(bt<<18|bt>>>14)^Pn;Mt=Wn+vt|0;kt=(Mt<<7|Mt>>>25)^rt;Ut=kt+Wn|0;Lt=(Ut<<9|Ut>>>23)^ft;It=Lt+kt|0;xt=(It<<13|It>>>19)^vt;Et=xt+Lt|0;Dt=(Et<<18|Et>>>14)^Wn;Kt=tt+Vn|0;Rt=(Kt<<7|Kt>>>25)^st;Bt=Rt+tt|0;Ft=(Bt<<9|Bt>>>23)^yt;Ot=Ft+Rt|0;_t=(Ot<<13|Ot>>>19)^Vn;Ct=_t+Ft|0;Ht=(Ct<<18|Ct>>>14)^tt;jt=wt+Xn|0;qt=(jt<<7|jt>>>25)^gt;Gt=qt+wt|0;Nt=(Gt<<9|Gt>>>23)^Qn;Pt=Nt+qt|0;St=(Pt<<13|Pt>>>19)^Xn;Vt=St+Nt|0;Zt=(Vt<<18|Vt>>>14)^wt;Qt=mt+at|0;Jt=(Qt<<7|Qt>>>25)^Jn;Yt=Jt+mt|0;Wt=(Yt<<9|Yt>>>23)^At;zt=Wt+Jt|0;$t=(zt<<13|zt>>>19)^at;Ai=$t+Wt|0;ei=(Ai<<18|Ai>>>14)^mt;ri=Dt+Jt|0;ti=(ri<<7|ri>>>25)^_t;ii=ti+Dt|0;ai=(ii<<9|ii>>>23)^Nt;oi=ai+ti|0;fi=(oi<<13|oi>>>19)^Jt;ui=fi+ai|0;ci=(ui<<18|ui>>>14)^Dt;si=Ht+kt|0;wi=(si<<7|si>>>25)^St;hi=wi+Ht|0;vi=(hi<<9|hi>>>23)^Wt;di=vi+wi|0;yi=(di<<13|di>>>19)^kt;pi=yi+vi|0;gi=(pi<<18|pi>>>14)^Ht;bi=Zt+Rt|0;mi=(bi<<7|bi>>>25)^$t;Mi=mi+Zt|0;ki=(Mi<<9|Mi>>>23)^Lt;Ui=ki+mi|0;Ii=(Ui<<13|Ui>>>19)^Rt;xi=Ii+ki|0;Ei=(xi<<18|xi>>>14)^Zt;Di=ei+qt|0;Ki=(Di<<7|Di>>>25)^xt;Ri=Ki+ei|0;Bi=(Ri<<9|Ri>>>23)^Ft;Fi=Bi+Ki|0;Oi=(Fi<<13|Fi>>>19)^qt;_i=Oi+Bi|0;Ci=(_i<<18|_i>>>14)^ei;Hi=ci+Ki|0;qi=(Hi<<7|Hi>>>25)^yi;Gi=qi+ci|0;Ni=(Gi<<9|Gi>>>23)^ki;Pi=Ni+qi|0;Si=(Pi<<13|Pi>>>19)^Ki;Vi=Si+Ni|0;Zi=(Vi<<18|Vi>>>14)^ci;Qi=gi+ti|0;Ti=(Qi<<7|Qi>>>25)^Ii;Ji=Ti+gi|0;Yi=(Ji<<9|Ji>>>23)^Bi;Wi=Yi+Ti|0;Xi=(Wi<<13|Wi>>>19)^ti;$i=Xi+Yi|0;Aa=($i<<18|$i>>>14)^gi;ea=Ei+wi|0;ra=(ea<<7|ea>>>25)^Oi;na=ra+Ei|0;ta=(na<<9|na>>>23)^ai;ia=ta+ra|0;aa=(ia<<13|ia>>>19)^wi;oa=aa+ta|0;fa=(oa<<18|oa>>>14)^Ei;ua=Ci+mi|0;sa=(ua<<7|ua>>>25)^fi;la=sa+Ci|0;wa=(la<<9|la>>>23)^vi;ha=wa+sa|0;va=(ha<<13|ha>>>19)^mi;da=va+wa|0;ya=(da<<18|da>>>14)^Ci;pa=Zi+sa|0;ga=(pa<<7|pa>>>25)^Xi;ba=ga+Zi|0;ma=(ba<<9|ba>>>23)^ta;Ma=ma+ga|0;Ua=(Ma<<13|Ma>>>19)^sa;La=Ua+ma|0;Ia=(La<<18|La>>>14)^Zi;xa=Aa+qi|0;Ea=(xa<<7|xa>>>25)^aa;Da=Ea+Aa|0;Ka=(Da<<9|Da>>>23)^wa;Ra=Ka+Ea|0;Fa=(Ra<<13|Ra>>>19)^qi;Oa=Fa+Ka|0;_a=(Oa<<18|Oa>>>14)^Aa;Ca=fa+Ti|0;ja=(Ca<<7|Ca>>>25)^va;qa=ja+fa|0;Ga=(qa<<9|qa>>>23)^Ni;Na=Ga+ja|0;Pa=(Na<<13|Na>>>19)^Ti;Sa=Pa+Ga|0;Va=(Sa<<18|Sa>>>14)^fa;Za=ya+ra|0;Qa=(Za<<7|Za>>>25)^Si;Ta=Qa+ya|0;Ja=(Ta<<9|Ta>>>23)^Yi;Ya=Ja+Qa|0;za=(Ya<<13|Ya>>>19)^ra;Xa=za+Ja|0;$a=(Xa<<18|Xa>>>14)^ya;Ao=Ia+Qa|0;eo=(Ao<<7|Ao>>>25)^Fa;ro=eo+Ia|0;no=(ro<<9|ro>>>23)^Ga;to=no+eo|0;io=(to<<13|to>>>19)^Qa;ao=io+no|0;oo=_a+ga|0;uo=(oo<<7|oo>>>25)^Pa;co=uo+_a|0;so=(co<<9|co>>>23)^Ja;lo=so+uo|0;wo=(lo<<13|lo>>>19)^ga;ho=wo+so|0;vo=Va+Ea|0;yo=(vo<<7|vo>>>25)^za;po=yo+Va|0;go=(po<<9|po>>>23)^ma;bo=go+yo|0;Mo=(bo<<13|bo>>>19)^Ea;ko=Mo+go|0;Uo=$a+ja|0;Lo=(Uo<<7|Uo>>>25)^Ua;Io=Lo+$a|0;xo=(Io<<9|Io>>>23)^Ka;Eo=xo+Lo|0;Do=(Eo<<13|Eo>>>19)^ja;Ko=Do+xo|0;Ro=((ao<<18|ao>>>14)^Ia)+li|0;Fo=eo+Li|0;Oo=no+ji|0;_o=io+zi|0;Co=wo+ca|0;Ho=((ho<<18|ho>>>14)^_a)+ka|0;jo=uo+Ha|0;qo=so+Wa|0;Go=go+fo|0;No=Mo+mo|0;Po=((ko<<18|ko>>>14)^Va)+Bo|0;So=yo+Wo|0;Vo=Lo+ff|0;Zo=xo+gf|0;Qo=Do+Bf|0;To=((Ko<<18|Ko>>>14)^$a)+Zf|0;Jo=b<<3;Yo=e+(Jo<<2)|0;n[Yo>>2]=Ro;n[Yo+4>>2]=Fo;n[Yo+8>>2]=Oo;n[Yo+12>>2]=_o;n[Yo+16>>2]=Co;n[Yo+20>>2]=Ho;n[Yo+24>>2]=jo;n[Yo+28>>2]=qo;n[Yo+32>>2]=Go;n[Yo+36>>2]=No;n[Yo+40>>2]=Po;n[Yo+44>>2]=So;n[Yo+48>>2]=Vo;n[Yo+52>>2]=Zo;n[Yo+56>>2]=Qo;n[Yo+60>>2]=To;zo=A+((Xt|16)<<2)|0;Xo=Ro^n[zo>>2];$o=Fo^n[zo+4>>2];Af=Oo^n[zo+8>>2];ef=_o^n[zo+12>>2];rf=Co^n[zo+16>>2];nf=Ho^n[zo+20>>2];tf=jo^n[zo+24>>2];af=qo^n[zo+28>>2];of=Go^n[zo+32>>2];uf=No^n[zo+36>>2];cf=Po^n[zo+40>>2];sf=So^n[zo+44>>2];lf=Vo^n[zo+48>>2];wf=Zo^n[zo+52>>2];hf=Qo^n[zo+56>>2];vf=To^n[zo+60>>2];df=Xo+lf|0;yf=(df<<7|df>>>25)^rf;pf=yf+Xo|0;bf=(pf<<9|pf>>>23)^of;mf=bf+yf|0;Mf=(mf<<13|mf>>>19)^lf;kf=Mf+bf|0;Uf=(kf<<18|kf>>>14)^Xo;Lf=nf+$o|0;If=(Lf<<7|Lf>>>25)^uf;xf=If+nf|0;Ef=(xf<<9|xf>>>23)^wf;Df=Ef+If|0;Kf=(Df<<13|Df>>>19)^$o;Rf=Kf+Ef|0;Ff=(Rf<<18|Rf>>>14)^nf;Of=cf+tf|0;_f=(Of<<7|Of>>>25)^hf;Cf=_f+cf|0;Hf=(Cf<<9|Cf>>>23)^Af;jf=Hf+_f|0;qf=(jf<<13|jf>>>19)^tf;Gf=qf+Hf|0;Nf=(Gf<<18|Gf>>>14)^cf;Pf=vf+sf|0;Sf=(Pf<<7|Pf>>>25)^ef;Vf=Sf+vf|0;Qf=(Vf<<9|Vf>>>23)^af;Tf=Qf+Sf|0;Jf=(Tf<<13|Tf>>>19)^sf;Yf=Jf+Qf|0;zf=(Yf<<18|Yf>>>14)^vf;Xf=Uf+Sf|0;$f=(Xf<<7|Xf>>>25)^Kf;Au=$f+Uf|0;eu=(Au<<9|Au>>>23)^Hf;ru=eu+$f|0;nu=(ru<<13|ru>>>19)^Sf;tu=nu+eu|0;iu=(tu<<18|tu>>>14)^Uf;au=Ff+yf|0;ou=(au<<7|au>>>25)^qf;fu=ou+Ff|0;uu=(fu<<9|fu>>>23)^Qf;cu=uu+ou|0;su=(cu<<13|cu>>>19)^yf;lu=su+uu|0;hu=(lu<<18|lu>>>14)^Ff;vu=Nf+If|0;du=(vu<<7|vu>>>25)^Jf;yu=du+Nf|0;gu=(yu<<9|yu>>>23)^bf;bu=gu+du|0;mu=(bu<<13|bu>>>19)^If;Mu=mu+gu|0;ku=(Mu<<18|Mu>>>14)^Nf;Uu=zf+_f|0;Lu=(Uu<<7|Uu>>>25)^Mf;Iu=Lu+zf|0;xu=(Iu<<9|Iu>>>23)^Ef;Eu=xu+Lu|0;Du=(Eu<<13|Eu>>>19)^_f;Ku=Du+xu|0;Ru=(Ku<<18|Ku>>>14)^zf;Bu=iu+Lu|0;Fu=(Bu<<7|Bu>>>25)^su;Ou=Fu+iu|0;Cu=(Ou<<9|Ou>>>23)^gu;Hu=Cu+Fu|0;ju=(Hu<<13|Hu>>>19)^Lu;qu=ju+Cu|0;Nu=(qu<<18|qu>>>14)^iu;Pu=hu+$f|0;Su=(Pu<<7|Pu>>>25)^mu;Vu=Su+hu|0;m=(Vu<<9|Vu>>>23)^xu;M=m+Su|0;k=(M<<13|M>>>19)^$f;U=k+m|0;L=(U<<18|U>>>14)^hu;I=ku+ou|0;x=(I<<7|I>>>25)^Du;E=x+ku|0;D=(E<<9|E>>>23)^eu;K=D+x|0;R=(K<<13|K>>>19)^ou;B=R+D|0;O=(B<<18|B>>>14)^ku;_=Ru+du|0;C=(_<<7|_>>>25)^nu;H=C+Ru|0;q=(H<<9|H>>>23)^uu;G=q+C|0;N=(G<<13|G>>>19)^du;P=N+q|0;S=(P<<18|P>>>14)^Ru;V=Nu+C|0;Z=(V<<7|V>>>25)^k;Q=Z+Nu|0;T=(Q<<9|Q>>>23)^D;J=T+Z|0;Y=(J<<13|J>>>19)^C;W=Y+T|0;z=(W<<18|W>>>14)^Nu;X=L+Fu|0;$=(X<<7|X>>>25)^R;AA=$+L|0;rA=(AA<<9|AA>>>23)^q;nA=rA+$|0;tA=(nA<<13|nA>>>19)^Fu;iA=tA+rA|0;oA=(iA<<18|iA>>>14)^L;fA=O+Su|0;uA=(fA<<7|fA>>>25)^N;cA=uA+O|0;sA=(cA<<9|cA>>>23)^Cu;lA=sA+uA|0;wA=(lA<<13|lA>>>19)^Su;hA=wA+sA|0;vA=(hA<<18|hA>>>14)^O;dA=S+x|0;yA=(dA<<7|dA>>>25)^ju;pA=yA+S|0;gA=(pA<<9|pA>>>23)^m;bA=gA+yA|0;mA=(bA<<13|bA>>>19)^x;MA=mA+gA|0;UA=(MA<<18|MA>>>14)^S;LA=z+yA|0;IA=(LA<<7|LA>>>25)^tA;xA=IA+z|0;DA=(xA<<9|xA>>>23)^sA;KA=DA+IA|0;RA=(KA<<13|KA>>>19)^yA;BA=RA+DA|0;FA=(BA<<18|BA>>>14)^z;OA=oA+Z|0;_A=(OA<<7|OA>>>25)^wA;CA=_A+oA|0;HA=(CA<<9|CA>>>23)^gA;jA=HA+_A|0;qA=(jA<<13|jA>>>19)^Z;GA=qA+HA|0;NA=(GA<<18|GA>>>14)^oA;PA=vA+$|0;SA=(PA<<7|PA>>>25)^mA;VA=SA+vA|0;QA=(VA<<9|VA>>>23)^T;TA=QA+SA|0;JA=(TA<<13|TA>>>19)^$;YA=JA+QA|0;zA=(YA<<18|YA>>>14)^vA;XA=UA+uA|0;$A=(XA<<7|XA>>>25)^Y;Ae=$A+UA|0;ee=(Ae<<9|Ae>>>23)^rA;re=ee+$A|0;ne=(re<<13|re>>>19)^uA;te=ne+ee|0;ie=(te<<18|te>>>14)^UA;ae=FA+$A|0;oe=(ae<<7|ae>>>25)^qA;fe=oe+FA|0;ue=(fe<<9|fe>>>23)^QA;ce=ue+oe|0;se=(ce<<13|ce>>>19)^$A;le=se+ue|0;he=(le<<18|le>>>14)^FA;ve=NA+IA|0;de=(ve<<7|ve>>>25)^JA;ye=de+NA|0;ge=(ye<<9|ye>>>23)^ee;be=ge+de|0;me=(be<<13|be>>>19)^IA;Me=me+ge|0;ke=(Me<<18|Me>>>14)^NA;Ue=zA+_A|0;Le=(Ue<<7|Ue>>>25)^ne;Ie=Le+zA|0;xe=(Ie<<9|Ie>>>23)^DA;Ee=xe+Le|0;De=(Ee<<13|Ee>>>19)^_A;Ke=De+xe|0;Re=(Ke<<18|Ke>>>14)^zA;Be=ie+SA|0;Fe=(Be<<7|Be>>>25)^RA;Oe=Fe+ie|0;Ce=(Oe<<9|Oe>>>23)^HA;He=Ce+Fe|0;je=(He<<13|He>>>19)^SA;qe=je+Ce|0;Ne=(qe<<18|qe>>>14)^ie;Pe=he+Fe|0;Se=(Pe<<7|Pe>>>25)^me;Ve=Se+he|0;Ze=(Ve<<9|Ve>>>23)^xe;Qe=Ze+Se|0;Te=(Qe<<13|Qe>>>19)^Fe;Je=Te+Ze|0;Ye=(Je<<18|Je>>>14)^he;We=ke+oe|0;ze=(We<<7|We>>>25)^De;Xe=ze+ke|0;$e=(Xe<<9|Xe>>>23)^Ce;Ar=$e+ze|0;er=(Ar<<13|Ar>>>19)^oe;rr=er+$e|0;tr=(rr<<18|rr>>>14)^ke;ir=Re+de|0;ar=(ir<<7|ir>>>25)^je;or=ar+Re|0;ur=(or<<9|or>>>23)^ue;cr=ur+ar|0;sr=(cr<<13|cr>>>19)^de;lr=sr+ur|0;wr=(lr<<18|lr>>>14)^Re;hr=Ne+Le|0;vr=(hr<<7|hr>>>25)^se;dr=vr+Ne|0;yr=(dr<<9|dr>>>23)^ge;pr=yr+vr|0;gr=(pr<<13|pr>>>19)^Le;br=gr+yr|0;mr=(br<<18|br>>>14)^Ne;Mr=Ye+vr|0;kr=(Mr<<7|Mr>>>25)^er;Ur=kr+Ye|0;Ir=(Ur<<9|Ur>>>23)^ur;xr=Ir+kr|0;Er=(xr<<13|xr>>>19)^vr;Dr=Er+Ir|0;Rr=tr+Se|0;Br=(Rr<<7|Rr>>>25)^sr;Fr=Br+tr|0;Or=(Fr<<9|Fr>>>23)^yr;_r=Or+Br|0;Cr=(_r<<13|_r>>>19)^Se;Hr=Cr+Or|0;jr=wr+ze|0;qr=(jr<<7|jr>>>25)^gr;Gr=qr+wr|0;Nr=(Gr<<9|Gr>>>23)^Ze;Pr=Nr+qr|0;Sr=(Pr<<13|Pr>>>19)^ze;Vr=Sr+Nr|0;Qr=mr+ar|0;Tr=(Qr<<7|Qr>>>25)^Te;Jr=Tr+mr|0;Wr=(Jr<<9|Jr>>>23)^$e;zr=Wr+Tr|0;Xr=(zr<<13|zr>>>19)^ar;$r=Xr+Wr|0;t=((Dr<<18|Dr>>>14)^Ye)+Xo|0;i=kr+$o|0;a=Ir+Af|0;o=Er+ef|0;f=Cr+rf|0;u=((Hr<<18|Hr>>>14)^tr)+nf|0;c=Br+tf|0;s=Or+af|0;l=Nr+of|0;w=Sr+uf|0;h=((Vr<<18|Vr>>>14)^wr)+cf|0;v=qr+sf|0;d=Tr+lf|0;y=Wr+wf|0;p=Xr+hf|0;g=(($r<<18|$r>>>14)^mr)+vf|0;An=e+(Jo+Tt<<2)|0;n[An>>2]=t;n[An+4>>2]=i;n[An+8>>2]=a;n[An+12>>2]=o;n[An+16>>2]=f;n[An+20>>2]=u;n[An+24>>2]=c;n[An+28>>2]=s;n[An+32>>2]=l;n[An+36>>2]=w;n[An+40>>2]=h;n[An+44>>2]=v;n[An+48>>2]=d;n[An+52>>2]=y;n[An+56>>2]=p;n[An+60>>2]=g;b=b+2|0}while(b>>>0<ct>>>0);return}return{_SMix:o}};return{create:A,getHeap:e}}function e(){"use strict";function A(A){for(var e=new Uint8Array(A),n=atob("mC+KQpFEN3HP+8C1pdu16VvCVjnxEfFZpII/ktVeHKuYqgfYAVuDEr6FMSTDfQxVdF2+cv6x3oCnBtybdPGbwcFpm+SGR77vxp3BD8yhDCRvLOktqoR0StypsFzaiPl2UlE+mG3GMajIJwOwx39Zv/ML4MZHkafVUWPKBmcpKRSFCrcnOCEbLvxtLE0TDThTVHMKZbsKanYuycKBhSxykqHov6JLZhqocItLwqNRbMcZ6JLRJAaZ1oU1DvRwoGoQFsGkGQhsNx5Md0gntbywNLMMHDlKqthOT8qcW/NvLmjugo90b2OleBR4yIQIAseM+v++kOtsUKT3o/m+8nhxxgUAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAACAAAAYAcAAAAEAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAr/////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAQAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="),t=8,i=0;i<n.length;i++)e[t+i]=n.charCodeAt(i);return r(self,{},A)}function e(){return 8636}var r=function(A,e,r){"use asm";var n=new A.Int32Array(r),t=new A.Int8Array(r),i=new A.Uint8Array(r);function a(A,e,r,i,a,u){A=A|0;e=e|0;r=r|0;i=i|0;a=a|0;u=u|0;var s=0,l=0,w=0,h=0,v=0,d=0,y=0,p=0,g=0,b=0,m=0;if(e>>>0>64){n[191]=0;n[183]=1779033703;n[184]=-1150833019;n[185]=1013904242;n[186]=-1521486534;n[187]=1359893119;n[188]=-1694144372;n[189]=528734635;n[190]=1541459225;o(732,A,e);c(1816,732);l=1816;w=32}else{l=A;w=e}n[191]=0;n[183]=1779033703;n[184]=-1150833019;n[185]=1013904242;n[186]=-1521486534;n[187]=1359893119;n[188]=-1694144372;n[189]=528734635;n[190]=1541459225;g=1752;m=g+64|0;do{t[g>>0]=54;g=g+1|0}while((g|0)<(m|0));if(!w)h=1;else{t[1752]=t[l>>0]^54;if((w|0)==1)h=0;else{t[1753]=t[l+1>>0]^54;if((w|0)==2)h=0;else{t[1754]=t[l+2>>0]^54;if((w|0)==3)h=0;else{v=3;do{t[1752+v>>0]=t[l+v>>0]^t[1752+v>>0];v=v+1|0}while((v|0)!=(w|0));h=0}}}}o(732,1752,64);n[216]=0;n[208]=1779033703;n[209]=-1150833019;n[210]=1013904242;n[211]=-1521486534;n[212]=1359893119;n[213]=-1694144372;n[214]=528734635;n[215]=1541459225;g=1752;m=g+64|0;do{t[g>>0]=92;g=g+1|0}while((g|0)<(m|0));if(!h){t[1752]=t[l>>0]^92;if((w|0)!=1){t[1753]=t[l+1>>0]^92;if((w|0)!=2){t[1754]=t[l+2>>0]^92;if((w|0)!=3){d=3;do{t[1752+d>>0]=t[l+d>>0]^t[1752+d>>0];d=d+1|0}while((d|0)!=(w|0))}}}}o(832,1752,64);o(732,r,i);if(u|0){s=0;p=0;do{s=s+1|0;t[1687]=s;t[1686]=s>>>8;t[1685]=s>>>16;t[1684]=s>>>24;f(932,732,200)|0;o(932,1684,4);c(1848,932);o(1032,1848,32);c(1688,1032);g=1720;b=1688;m=g+32|0;do{t[g>>0]=t[b>>0]|0;g=g+1|0;b=b+1|0}while((g|0)<(m|0));y=u-p|0;f(a+p|0,1720,(y>>>0>32?32:y)|0)|0;p=s<<5}while(p>>>0<u>>>0)}return}function o(A,e,r){A=A|0;e=e|0;r=r|0;var t=0,i=0,a=0,o=0,c=0,s=0,l=0,w=0,h=0,v=0,d=0,y=0,p=0,g=0,b=0;do if(r|0){p=A+32|0;g=n[p>>2]|0;b=g>>>3&63;n[p>>2]=g+(r<<3);c=64-b|0;s=A+36+b|0;if(c>>>0>r>>>0){f(s|0,e|0,r|0)|0;break}f(s|0,e|0,c|0)|0;l=A+36|0;u(A,l);w=e+c|0;h=r-c|0;if(h>>>0>63){v=b+r+-128|0;d=v&-64;y=d+128-b|0;a=h;o=w;while(1){u(A,o);a=a+-64|0;if(a>>>0<=63)break;else o=o+64|0}t=e+y|0;i=v-d|0}else{t=w;i=h}f(l|0,t|0,i|0)|0}while(0);return}function f(A,e,r){A=A|0;e=e|0;r=r|0;var i=0;i=A|0;if((A&3)==(e&3)){while(A&3){if(!r)return i|0;t[A>>0]=t[e>>0]|0;A=A+1|0;e=e+1|0;r=r-1|0}while((r|0)>=4){n[A>>2]=n[e>>2];A=A+4|0;e=e+4|0;r=r-4|0}}while((r|0)>0){t[A>>0]=t[e>>0]|0;A=A+1|0;e=e+1|0;r=r-1|0}return i|0}function u(A,e){A=A|0;e=e|0;var r=0,t=0,a=0,o=0,f=0,u=0,c=0,s=0,l=0,w=0,h=0,v=0,d=0,y=0,p=0,g=0,b=0;r=0;do{w=e+(r<<2)|0;n[444+(r<<2)>>2]=(i[w+2>>0]|0)<<8|(i[w+3>>0]|0)|(i[w+1>>0]|0)<<16|(i[w>>0]|0)<<24;r=r+1|0}while((r|0)!=16);t=16;h=n[111]|0;do{l=n[444+(t+-2<<2)>>2]|0;b=h;h=n[444+(t+-15<<2)>>2]|0;n[444+(t<<2)>>2]=b+(n[444+(t+-7<<2)>>2]|0)+((l>>>19|l<<13)^l>>>10^(l>>>17|l<<15))+((h>>>18|h<<14)^h>>>3^(h>>>7|h<<25));t=t+1|0}while((t|0)!=64);n[175]=n[A>>2];n[176]=n[A+4>>2];n[177]=n[A+8>>2];n[178]=n[A+12>>2];n[179]=n[A+16>>2];n[180]=n[A+20>>2];n[181]=n[A+24>>2];n[182]=n[A+28>>2];a=0;do{v=700+(((71-a|0)%8|0)<<2)|0;d=n[700+(((68-a|0)%8|0)<<2)>>2]|0;y=n[700+(((70-a|0)%8|0)<<2)>>2]|0;p=(n[444+(a<<2)>>2]|0)+(n[v>>2]|0)+((d>>>6|d<<26)^(d>>>11|d<<21)^(d>>>25|d<<7))+(n[8+(a<<2)>>2]|0)+((y^n[700+(((69-a|0)%8|0)<<2)>>2])&d^y)|0;g=n[700+(((64-a|0)%8|0)<<2)>>2]|0;f=n[700+(((65-a|0)%8|0)<<2)>>2]|0;u=n[700+(((66-a|0)%8|0)<<2)>>2]|0;c=700+(((67-a|0)%8|0)<<2)|0;n[c>>2]=(n[c>>2]|0)+p;n[v>>2]=((g>>>2|g<<30)^(g>>>13|g<<19)^(g>>>22|g<<10))+p+((u|f)&g|u&f);a=a+1|0}while((a|0)!=64);o=0;do{s=A+(o<<2)|0;n[s>>2]=(n[s>>2]|0)+(n[700+(o<<2)>>2]|0);o=o+1|0}while((o|0)!=8);return}function c(A,e){A=A|0;e=e|0;var r=0,i=0,a=0,f=0,u=0;u=n[e+32>>2]|0;t[1139]=u;t[1138]=u>>>8;t[1137]=u>>>16;t[1136]=u>>>24;i=u>>>3&63;n[283]=0;o(e,380,(i>>>0<56?56:120)-i|0);o(e,1132,8);r=0;do{a=A+(r<<2)|0;f=n[e+(r<<2)>>2]|0;t[a+3>>0]=f;t[a+2>>0]=f>>>8;t[a+1>>0]=f>>>16;t[a>>0]=f>>>24;r=r+1|0}while((r|0)!=8);return}return{_PBKDF2_OneIter:a}};return{create:A,getHeap:e}}var r,n=function(){"use strict";function e(){}function r(A,r){u=A,c=r,f=128*r,o=d+f;var n=d+f*(3+A),t=16777216*Math.ceil(n/16777216);if(!s||s.byteLength<t){try{s=new ArrayBuffer(t)}catch(A){return!1}l=new Uint8Array(s),p=y.create(s),e()}return!0}function n(A){var e=new Uint8Array(A);l.set(e,d),h=262144/c,w=0,v=!0}function t(A){h=h*A>>1<<1}function i(){var A,e=h,r=w,n=r+e,i=0;switch(n>=u&&(n=u,e=n-r,i=v?1:2),2!=i&&g(e),0==i&&(A=b()),p._SMix(u,c,d,o,v?0:1,r,n),i){case 0:A=b()-A,w=n,t(100/A);break;case 1:w=0,v=!1,t(.7);break;case 2:var a=s.slice(d,d+f);g({state:"done",step:e,output:a},[a])}}function a(A){var e=A.data;if(e===!0)return void i();switch(e.cmd){case"task":n(e.input),i();break;case"config":var t=r(e.N,e.r);g({state:t?"ready":"fail"});break;case"free":p=l=s=null}}var o,f,u,c,s,l,w,h,v,d=64,y=A(),p=null,g=self.postMessage,b=Date.now;addEventListener("message",a)};!function(r){function t(A,e,r,n,t,i,a){L=128*e,h=r,E=r*A*2,I=n,K=0;var o=O.getHeap();p=o,o+=t,g=o,o+=i,b=o,o+=a,m=o,o+=L*r,o=65536*Math.ceil(o/65536),(!d||d.byteLength<o)&&(d=new ArrayBuffer(o),y=new Uint8Array(d),_=O.create(d)),v||(v=u());for(var f=0;f<I;f++){var c=C[f];c||(c=new Worker(v),c.onmessage=s,c.tag=0,C[f]=c),c.postMessage({cmd:"config",N:A,r:e})}}function i(A,e,r){y.set(A,p),y.set(e,g),M=A.length,k=e.length,U=r,x=!0,D=0,R=0,B=0,_._PBKDF2_OneIter(p,M,g,k,m,L*h);for(var n=0;n<I;n++)l(C[n])}function a(){x=!1}function o(){C.forEach(function(A){A.postMessage({cmd:"free"})})}function f(){C.forEach(function(A){A.terminate()}),C=[],d=y=O=null,URL.revokeObjectURL(v)}function u(){var e="("+n+")();"+A,r=new Blob([e],{type:"text/javascript"});return URL.createObjectURL(r)}function c(){_._PBKDF2_OneIter(p,M,m,L*h,b,U>32?U:32);var A=new Uint8Array(d,b,U);x=!1,w("oncomplete",A)}function s(A){var e=this,r=A.data;if("number"==typeof r){if(!x)return;e.postMessage(!0),D+=r;var n=Date.now();return n-F>50&&w("onprogress",D/E),void(F=n)}switch(r.state){case"done":if(!x)return;var t=new Uint8Array(r.output),i=e.tag;y.set(t,m+L*i),D+=r.step,++B==h?c():R<h&&l(e);break;case"ready":++K==I&&w("onready");break;case"fail":w("onerror","memory alloc fail")}}function l(A){var e=m+R*L,r=d.slice(e,e+L);A.tag=R++,A.postMessage({cmd:"task",input:r},[r])}function w(A,e){var r=window.scrypt;r&&r.__asmjs_cb(A,e)}var h,v,d,y,p,g,b,m,M,k,U,L,I,x,E,D,K,R,B,F,O=e(),_=null,C=[];r.config=t,r.hash=i,r.stop=a,r.free=o,r.unload=f,w("onload",r)}(r||(r={}))}();
//# sourceMappingURL=../sourcemap/asmjs.js.map
///END ASM.JS
`;
          const blob = new Blob([text], { type: "text/javascript" });
          const url = URL.createObjectURL(blob);
          await import(url);
        } catch {
          loader.onerror("script load fail");
        }
      })();
    }
    function hashLoader(r, n2, o) {
      scWorker.hash(r, n2, o);
    }
    function configLoader(r, n2, o, t, e, a, i2) {
      scWorker.config.apply(this, arguments);
    }
    function i() {
      scWorker.stop();
    }
    function c() {
      scWorker.free();
    }
    function f() {
      scWorker && (scWorker.unload(), scWorker = null);
    }
    function asmjsCallback(eventName, data) {
      "onload" == eventName && (scWorker = data), loader[eventName](data);
      if (eventName === "onload") delete globalThis["scrypt_loader_9470f487e3aa154f278269e99e6a42502ca77b8da3867a46a548909659a3db4a"];
    }
    var scWorker;
    loader.check = n, loader.load = load, loader.hash = hashLoader, loader.config = configLoader, loader.stop = i, loader.free = c, loader.unload = f;
  }(asmjsLoader || (asmjsLoader = {}));
  var flashLoader;
  var factory_object;
  !function(factory) {
    function e() {
      return "asmjs";
    }
    function a(r, n) {
      if (r) switch (arguments.length) {
        case 1:
          return r();
        case 2:
          return r(n);
      }
    }
    function i() {
      k && (clearTimeout(k), k = 0);
    }
    function hashScrypt(r, n, o) {
      if (T < 2) throw Error("scrypt not loaded");
      if (T < 4) throw Error("scrypt not configed");
      if (5 == T) throw Error("scrypt is running");
      if (T = 5, o = o || B, r = r || [], n = n || [], r.length > j) throw Error("pass.length > maxPassLen");
      if (n.length > A) throw Error("salt.length > maxSaltLen");
      if (o > B) throw Error("dkLen > maxDkLen");
      api.hash(r, n, o);
    }
    function f() {
      if (!E) {
        E = [];
        for (var r in b) b[r].check() && E.push(r);
      }
      return E;
    }
    function loadScryptApi(r) {
      if (!(T >= 1)) {
        if (!r && (r = e(), !r)) throw Error("no available mod");
        if (api = b[r], !api) throw Error("unsupported mod: " + r);
        api.onload = function() {
          i(), a(factory.onload);
        }, api.onerror = function(r2) {
          h(), a(factory.onerror, r2);
        }, api.onready = function() {
          T = 4, a(factory.onready);
        }, api.onprogress = function(r2) {
          a(factory.onprogress, r2);
        }, api.oncomplete = function(r2) {
          T = 4, a(factory.onprogress, 1), a(factory.oncomplete, r2);
        }, i(), k = setTimeout(function() {
          h(), a(factory.onerror, "load timeout");
        }, L), T = 1, api.load(resPath);
      }
    }
    function stopScrypt() {
      api.stop(), T = 4;
    }
    function l() {
      4 == T && (api.free(), T = 2);
    }
    function h() {
      0 != T && (api.unload(), T = 0), i();
    }
    function setScConfig(r, n, o) {
      if (!r) throw Error("config() takes at least 1 argument");
      var t = 0 | r.N;
      if (!(1 < t && t <= 8388608)) throw Error("param N out of range (1 < N <= 2^23)");
      if (t & t - 1) throw Error("param N must be power of 2");
      var e2 = 0 | r.r;
      if (!(0 < e2 && e2 < 256)) throw Error("param r out of range (0 < r < 256)");
      var a2 = 0 | r.P;
      if (!(0 < a2 && a2 < 256)) throw Error("param P out of range (0 < P < 256)");
      var i2 = t * e2 * 128;
      if (i2 > 1073741824) throw Error("memory limit exceeded (N * r * 128 > 1G)");
      if (n) {
        var c = n.maxPassLen;
        if (null == c) c = j;
        else if (c <= 0) throw Error("invalid maxPassLen");
        var f2 = n.maxSaltLen;
        if (null == f2) f2 = A;
        else if (f2 <= 0) throw Error("invalid maxSaltLen");
        var s = n.maxDkLen;
        if (null == s) s = B;
        else if (s <= 0) throw Error("invalid maxDkLen");
        var u = n.maxThread;
        if (null == u) u = C;
        else if (u <= 0) throw Error("invalid maxThread");
        o || (j = 0 | c, A = 0 | f2, B = 0 | s, C = 0 | u);
      }
      if (!o) {
        var l2 = Math.ceil(a2 / C), h2 = Math.ceil(a2 / l2);
        api.config(t, e2, a2, h2, j, A, B), T = 3;
      }
    }
    function v(n) {
      return util.strToBytes(n);
    }
    function m(n) {
      return util.bytesToStr(n);
    }
    function p(n) {
      if (n.length % 2) throw Error("invalid hex length");
      return util.hexToBytes(n);
    }
    function w(n) {
      return util.bytesToHex(n);
    }
    function setResPath(r) {
      /\/$/.test(r) || (r += "/"), resPath = r;
    }
    function y(r) {
      L = r;
    }
    var api, E, b = {
      asmjs: asmjsLoader,
      flash: flashLoader
    }, T = 0, resPath = "", k = 0, L = 3e4, j = 64, A = 64, B = 64, C = 1;
    factory.hash = hashScrypt, factory.getAvailableMod = f, factory.load = loadScryptApi, factory.stop = stopScrypt, factory.free = l, factory.unload = h, factory.config = setScConfig, factory.strToBin = v, factory.binToStr = m, factory.hexToBin = p, factory.binToHex = w, factory.setResPath = setResPath, factory.setResTimeout = y, window.scrypt = factory;
  }(factory_object || (factory_object = {}));
}();
globalThis["scrypt_loader_9470f487e3aa154f278269e99e6a42502ca77b8da3867a46a548909659a3db4a"] = window2;
var scryptAPI = window2.scrypt;
scryptAPI.load();
var scrypt = /* @__PURE__ */ function() {
  const queue = [];
  let running = false;
  const work = (task) => new Promise(async (resolve, reject) => {
    scryptAPI.onprogress = (p) => {
      if (task.onprogress) task.onprogress(p);
    };
    scryptAPI.oncomplete = (dk) => {
      task.resolve(dk);
      resolve(true);
    };
    scryptAPI.onerror = (e) => {
      task.reject(e);
      resolve(false);
    };
    try {
      scryptAPI.config({ N: task.N, r: task.r, P: task.p }, { maxPassLen: 8192, maxSaltLen: 2048, maxDkLen: 1024, maxThread: 1 });
      await new Promise((r) => scryptAPI.onready = r);
      scryptAPI.hash(task.key, task.salt, task.dklen);
    } catch (e) {
      reject(e);
    }
  });
  async function thread() {
    let task = null;
    while (queue.length) try {
      task = queue.splice(0, 1)[0];
      await work(task);
      await nextTick();
    } catch (e) {
      task?.reject(e);
    }
    running = false;
  }
  return function scrypt2(key, salt, N, r, p, dklen, onprogress = null) {
    return new Promise((resolve, reject) => {
      queue.push({
        key,
        salt,
        N,
        r,
        p,
        dklen,
        resolve,
        reject,
        onprogress
      });
      if (!running) {
        running = true;
        setTimeout(thread);
      }
    });
  };
}();
function nextTick() {
  return new Promise((r) => setTimeout(r));
}

// src/internal-util.js
var PADDING_SIZE = 4096;
var END_IDENTIFIER = [
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170
];
var TAIL_BLOCK_MARKER = [
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85
];
var END_MARKER = [
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170,
  85,
  170
];
var FILE_END_MARKER = [255, 253, 240, 16, 19, 208, 18, 24, 85, 170];
var timerproc = typeof process === "undefined" ? requestAnimationFrame : (
  // browser
  setTimeout
);
function nextTick2() {
  return new Promise((r) => timerproc(r));
}
function normalize_version(major_version, version_marker) {
  if (!major_version) return `Unknown Version`;
  if (String(major_version) === "1.1") version_marker = null;
  if (!version_marker) return `${major_version}/0`;
  return `${major_version}/${version_marker}`;
}
var ENCRYPTION_FILE_VER_1_1_0 = normalize_version("1.1");
var ENCRYPTION_FILE_VER_1_2_10020 = normalize_version("1.2", 10020);
async function GetFileVersion(file_reader) {
  const header = await file_reader(0, 13);
  if (str_decode(header) !== "MyEncryption/") {
    throw new InvalidFileFormatException();
  }
  const top_header_version = str_decode(await file_reader(13, 16));
  if (!["1.1", "1.2"].includes(top_header_version)) {
    throw new EncryptionVersionMismatchException();
  }
  const version_marker = new DataView((await file_reader(16, 20)).buffer).getUint32(0, true);
  const version = normalize_version(top_header_version, version_marker);
  return version;
}
async function GetFileInfo(file_reader) {
  const version = await GetFileVersion(file_reader);
  if (version === ENCRYPTION_FILE_VER_1_1_0) {
    throw new OperationNotPermittedException("The chunk size is volatile and we cannot get a fixed value.");
  }
  if (version === ENCRYPTION_FILE_VER_1_2_10020) {
    let read_pos = 16 + 4;
    read_pos += PADDING_SIZE;
    const json_len_bytes = await file_reader(read_pos, read_pos + 4);
    const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
    read_pos += 4;
    read_pos += json_len;
    const chunk_size = Number(new DataView((await file_reader(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
    let nonce_counter = Number(new DataView((await file_reader(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
    return { version, chunk_size, nonce_counter };
  }
  throw new EncryptionVersionMismatchException();
}
async function GetFileChunkSize(file_reader) {
  return (await GetFileInfo(file_reader)).chunk_size;
}
function CheckAlgorithm(algorithm) {
  if (!!algorithm && algorithm !== "AES-GCM") {
    if (algorithm === "ChaCha20" || algorithm === "ChaCha20-Poly1305") {
      throw new ChaCha20NotSupportedException();
    }
    if (algorithm === "DES" || algorithm === "RC4") {
      throw new DangerousEncryptionAlgorithmException();
    }
    if (algorithm === "XTS-AES") {
      throw new EncryptionAlgorithmNotSupportedException("XTS-AES Not supported yet");
    }
    throw new EncryptionAlgorithmNotSupportedException(void 0, {
      cause: new Error(String(algorithm))
    });
  }
}
async function IsEncryptedMessage(message) {
  if (typeof message !== "string") return false;
  if (message.charAt(0) === ":") {
    const arr = message.split(":");
    if (arr.length === 8) {
      const [, data, phrase, salt, N, v, a] = arr;
      return !!(data && phrase && salt && N && v && a);
    }
    return false;
  }
  if (message.charAt(0) !== "{") return false;
  try {
    const json = JSON.parse(message);
    return json.data && json.parameter && json.N && json.v;
  } catch {
    return false;
  }
}
async function IsEncryptedFile(file_reader) {
  try {
    const info = await GetFileInfo(file_reader);
    return !!info.version;
  } catch {
    return false;
  }
}

// src/encrypt_data.js
function safeparse(json) {
  try {
    return JSON.parse(json);
  } catch {
    throw new InvalidParameterException("The JSON is not valid.");
  }
}
async function encrypt_data(message, key, phrase = null, N = null) {
  const iv = get_random_bytes(12);
  const { derived_key, parameter, N: N2 } = await derive_key(key, iv, phrase, N);
  N = N2;
  const cipher = await crypto.subtle.importKey("raw", derived_key, "AES-GCM", false, ["encrypt"]);
  if (typeof message !== "string") {
    throw new OperationNotPermittedException("The ability to directly encrypt binary data has been removed in the new version. Please use `encrypt_file` instead.");
  }
  const alg = "AES-GCM";
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: alg,
      iv
    },
    cipher,
    str_encode(message)
  );
  const encrypted_message = new Uint8Array(iv.length + ciphertext.byteLength);
  encrypted_message.set(iv, 0);
  encrypted_message.set(new Uint8Array(ciphertext), iv.length);
  const message_encrypted = hexlify(encrypted_message);
  const v = 5.6;
  return `:${message_encrypted}:${parameter}:${N}:${v}:${alg}:`;
}
async function decrypt_data(message_encrypted, key) {
  let jsoned;
  if (message_encrypted.charAt(0) === ":") {
    const arr = message_encrypted.split(":");
    if (arr.length !== 8) throw new BadDataException("The message is bad.");
    const [, data, phrase2, salt2, N2, v, a] = arr;
    jsoned = { data, phrase: phrase2, salt: salt2, N: +N2, v: +v, a };
  } else {
    jsoned = safeparse(message_encrypted);
  }
  const N = parseInt(jsoned.N);
  const alg = jsoned.a;
  CheckAlgorithm(alg);
  const encrypted_data = unhexlify(jsoned.data);
  let phrase, salt_b64;
  if (jsoned.parameter) [phrase, salt_b64] = jsoned.parameter.split(":");
  else {
    phrase = jsoned.phrase;
    salt_b64 = jsoned.salt;
  }
  const salt = unhexlify(salt_b64);
  if (isNaN(N) || !phrase || !encrypted_data || !salt) throw new BadDataException("The message or parameters are bad.");
  if (encrypted_data.length < 28) throw new BadDataException("The message was too short.");
  const iv = encrypted_data.slice(0, 12);
  const ciphertext = encrypted_data.slice(12, -16);
  const tag = encrypted_data.slice(-16);
  const derived_key = typeof key === "string" ? (await derive_key(key, iv, phrase, N, salt)).derived_key : key;
  const cipher = await crypto.subtle.importKey("raw", derived_key, "AES-GCM", false, ["decrypt"]);
  try {
    const decrypted_data = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv
      },
      cipher,
      new Uint8Array([...ciphertext, ...tag])
    );
    try {
      return str_decode(decrypted_data);
    } catch {
      throw new OperationNotPermittedException("The ability to directly decrypt binary data has been removed in the new version. If you have encrypted binary data, please recover it using the old version.");
    }
  } catch (e) {
    if (!e) throw new InternalError(`Internal error.`, { cause: e });
    const name = e.name;
    if (name === "InvalidAccessError") throw new InvalidParameterException("InvalidAccessError.", { cause: e });
    if (name === "OperationError") throw new CannotDecryptException("Cannot decrypt. Did you provide the correct password?", { cause: e });
    if (!e) throw new InternalError(`Unexpected error.`, { cause: e });
  }
}

// src/derive_key.js
var deriveKey__phrases = ["Furina", "Neuvillette", "Venti", "Nahida", "Kinich", "Kazuha"];
async function derive_key(key, iv, phrase = null, N = null, salt = null, r = 8, p = 1, dklen = 32) {
  if (N === null) N = 262144;
  if (typeof N !== "number" || N > 2097152) {
    throw new InvalidScryptParameterException();
  }
  if (!salt) {
    salt = get_random_bytes(64);
  }
  if (!phrase) {
    phrase = deriveKey__phrases[get_random_uint8_number() % deriveKey__phrases.length];
  }
  if (phrase.includes(":")) {
    throw new InvalidParameterException('phrase MUST NOT contain ":"');
  }
  const parameter = `${phrase}:${hexlify(salt)}`;
  const keyInput = `MyEncryption/1.1 Fontaine/4.2 Iv/${hexlify(iv)} user_parameter=${parameter} user_key=${key}`;
  const derived_key = await scrypt(str_encode(keyInput), salt, N, r, p, dklen);
  return { derived_key, parameter, N };
}
async function derive_key_for_file(file_reader, user_key) {
  let read_pos = 16 + 4;
  const version = await GetFileVersion(file_reader);
  if (version === ENCRYPTION_FILE_VER_1_1_0) {
    throw new NotSupportedException("Deriving a key for V1.1 files is not supported");
  }
  if (version !== ENCRYPTION_FILE_VER_1_2_10020) {
    throw new EncryptionVersionMismatchException();
  }
  const ekey_len = new DataView((await file_reader(read_pos, read_pos + 4)).buffer).getUint32(0, true);
  const ekey = str_decode(await file_reader(read_pos + 4, read_pos + 4 + ekey_len));
  read_pos += PADDING_SIZE;
  if (ekey_len > PADDING_SIZE) {
    throw new InternalError("(Internal Error) This should not happen. Contact the application developer.");
  }
  const key = await decrypt_data(ekey, user_key);
  const json_len_bytes = await file_reader(read_pos, read_pos + 4);
  const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const header_json = JSON.parse(
    str_decode(await file_reader(read_pos, read_pos + json_len))
  );
  read_pos += json_len;
  const header_version = header_json.v;
  if (![5.5].includes(header_version)) throw new EncryptionVersionMismatchException();
  const [phrase, salt_hex] = header_json.parameter.split(":");
  const salt = unhexlify(salt_hex);
  const iv4key = unhexlify(header_json.iv);
  const N = header_json.N;
  const algorithm = header_json.a;
  CheckAlgorithm(algorithm);
  return (await derive_key(key, iv4key, phrase, N, salt)).derived_key;
}
async function scrypt_hex(key, salt, N, r, p, dklen) {
  return hexlify(await scrypt(str_encode(key), str_encode(salt), N, r, p, dklen));
}

// src/encrypt_file.js
async function encrypt_file(file_reader, file_writer, user_key, callback = null, phrase = null, N = null, chunk_size = 32 * 1024 * 1024) {
  if (!chunk_size) throw new InvalidParameterException("chunk_size must be greater than 0.");
  await file_writer(str_encode("MyEncryption/1.2"));
  const VERSION_MARKER = 10020;
  const versionMarkerBuffer = new ArrayBuffer(4);
  new DataView(versionMarkerBuffer).setUint32(0, VERSION_MARKER, true);
  await file_writer(new Uint8Array(versionMarkerBuffer));
  const key = hexlify(get_random_bytes(64));
  const ekey = await encrypt_data(key, user_key);
  const ekey_bytes = str_encode(ekey);
  if (ekey_bytes.length > PADDING_SIZE) {
    throw new InternalError("(Internal Error) This should not happen. Contact the application developer.");
  }
  const lengthBuffer = new ArrayBuffer(4);
  new DataView(lengthBuffer).setUint32(0, ekey_bytes.length, true);
  await file_writer(new Uint8Array(lengthBuffer));
  await file_writer(ekey_bytes);
  const padding = new Uint8Array(PADDING_SIZE - ekey_bytes.length - 4).fill(0);
  await file_writer(padding);
  callback?.(0);
  await nextTick2();
  const iv_for_key = get_random_bytes(12);
  const { derived_key, parameter, N: N2 } = await derive_key(key, iv_for_key, phrase, N);
  N = N2;
  const header_data = {
    "parameter": parameter,
    "N": N,
    "v": 5.5,
    "a": "AES-GCM",
    "iv": hexlify(iv_for_key)
  };
  const header_json = str_encode(JSON.stringify(header_data));
  const headerLengthBuffer = new ArrayBuffer(4);
  new DataView(headerLengthBuffer).setUint32(0, header_json.length, true);
  await file_writer(new Uint8Array(headerLengthBuffer));
  await file_writer(header_json);
  const chunkSizeBuffer = new ArrayBuffer(8);
  new DataView(chunkSizeBuffer).setBigUint64(0, BigInt(chunk_size), true);
  await file_writer(new Uint8Array(chunkSizeBuffer));
  let total_bytes = 0;
  let nonce_counter = 1;
  let position = 0;
  const nonce_counter_start = new ArrayBuffer(8);
  new DataView(nonce_counter_start).setBigUint64(0, BigInt(nonce_counter), true);
  await file_writer(new Uint8Array(nonce_counter_start));
  callback?.(0);
  const cryptoKey = await crypto.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["encrypt"]);
  while (true) {
    const chunk = await file_reader(position, position + chunk_size);
    if (!(chunk instanceof Uint8Array)) throw new BadDataException("The file chunk is not a Uint8Array.");
    if (chunk.length === 0) break;
    const isFinalChunk = chunk.length < chunk_size;
    const iv = new ArrayBuffer(12);
    if (nonce_counter >= 2 ** 64 || nonce_counter >= Number.MAX_SAFE_INTEGER) {
      throw new IVException("nonce_counter exceeded the maximum value.");
    }
    new DataView(iv).setBigUint64(4, BigInt(nonce_counter), true);
    nonce_counter++;
    if (isFinalChunk) {
      await file_writer(new Uint8Array(TAIL_BLOCK_MARKER));
      const chunkLengthBuffer = new ArrayBuffer(8);
      new DataView(chunkLengthBuffer).setBigUint64(0, BigInt(chunk.length), true);
      await file_writer(new Uint8Array(chunkLengthBuffer));
    }
    const ivArray = new Uint8Array(iv);
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: ivArray
      },
      cryptoKey,
      chunk
    );
    const ciphertextArray = new Uint8Array(ciphertext);
    await file_writer(ciphertextArray);
    total_bytes += chunk.length;
    position += chunk.length;
    callback?.(total_bytes);
  }
  await file_writer(new Uint8Array(END_MARKER));
  const totalBytesBuffer = new ArrayBuffer(8);
  new DataView(totalBytesBuffer).setBigUint64(0, BigInt(total_bytes), true);
  await file_writer(new Uint8Array(totalBytesBuffer));
  await file_writer(new Uint8Array(FILE_END_MARKER));
  return true;
}
async function decrypt_file_V_1_1_0(file_reader, file_writer, user_key, callback = null) {
  const header = await file_reader(0, 16);
  if (str_decode(header) !== "MyEncryption/1.1") {
    throw new TypeError("Invalid file format");
  }
  let read_pos = 16;
  const ekey_len_bytes = await file_reader(read_pos, read_pos + 4);
  const ekey_len = new DataView(ekey_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const ekey = str_decode(await file_reader(read_pos, read_pos + ekey_len));
  read_pos += 1024;
  const key = await decrypt_data(ekey, user_key);
  const json_len_bytes = await file_reader(read_pos, read_pos + 4);
  const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const header_json = JSON.parse(
    str_decode(await file_reader(read_pos, read_pos + json_len))
  );
  read_pos += json_len;
  const [phrase, salt_hex] = header_json.parameter.split(":");
  const salt = unhexlify(salt_hex);
  const iv4key = unhexlify(header_json.iv);
  const N = header_json.N;
  callback?.(0);
  await nextTick2();
  const { derived_key } = await derive_key(key, iv4key, phrase, N, salt);
  let total_bytes = 0;
  const cryptoKey = await crypto.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["decrypt"]);
  while (true) {
    const chunk_len_bytes = await file_reader(read_pos, read_pos + 8);
    read_pos += 8;
    if (chunk_len_bytes.every(
      (v, i) => v === [255, 253, 240, 16, 19, 208, 18, 24][i]
    )) break;
    const chunk_len = Number(
      new DataView(chunk_len_bytes.buffer).getBigUint64(0, true)
    );
    const iv = await file_reader(read_pos, read_pos + 12);
    read_pos += 12;
    const ciphertext = await file_reader(read_pos, read_pos + chunk_len + 16);
    read_pos += chunk_len + 16;
    const full_ciphertext = ciphertext;
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv
      },
      cryptoKey,
      full_ciphertext
    );
    await file_writer(new Uint8Array(decrypted));
    total_bytes += decrypted.byteLength;
    if (callback) callback(total_bytes);
  }
  const total_bytes_bytes = await file_reader(read_pos, read_pos + 8);
  const total_bytes_decrypted = Number(
    new DataView(total_bytes_bytes.buffer).getBigUint64(0, true)
  );
  read_pos += 8;
  const end_marker = await file_reader(read_pos, read_pos + 2);
  if (total_bytes !== total_bytes_decrypted) throw new FileCorruptedException("File corrupted: total bytes mismatch");
  if (!end_marker.every((v, i) => v === [85, 170][i])) throw new InvalidEndMarkerException("Invalid end marker");
  return true;
}
async function decrypt_file(file_reader, file_writer, user_key, callback = null) {
  let read_pos = 16 + 4;
  const version = await GetFileVersion(file_reader);
  if (version === ENCRYPTION_FILE_VER_1_1_0) {
    if (typeof user_key !== "string") throw new NotSupportedException("operation not supported");
    return await decrypt_file_V_1_1_0(file_reader, file_writer, user_key, callback);
  }
  const ekey_len = new DataView((await file_reader(read_pos, read_pos + 4)).buffer).getUint32(0, true);
  const ekey = str_decode(await file_reader(read_pos + 4, read_pos + 4 + ekey_len));
  read_pos += PADDING_SIZE;
  if (ekey_len > PADDING_SIZE) {
    throw new InternalError("(Internal Error) This should not happen. Contact the application developer.");
  }
  const key = typeof user_key === "string" ? await decrypt_data(ekey, user_key) : null;
  const json_len_bytes = await file_reader(read_pos, read_pos + 4);
  const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const header_json = JSON.parse(
    str_decode(await file_reader(read_pos, read_pos + json_len))
  );
  read_pos += json_len;
  const header_version = header_json.v;
  if (![5.5].includes(header_version)) throw new EncryptionVersionMismatchException();
  const [phrase, salt_hex] = header_json.parameter.split(":");
  const salt = unhexlify(salt_hex);
  const iv4key = unhexlify(header_json.iv);
  const N = header_json.N;
  const algorithm = header_json.a;
  CheckAlgorithm(algorithm);
  const chunk_size = Number(new DataView((await file_reader(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
  let nonce_counter = Number(new DataView((await file_reader(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
  read_pos += 16;
  callback?.(0);
  await nextTick2();
  const derived_key = typeof user_key === "string" ? (await derive_key(key, iv4key, phrase, N, salt)).derived_key : user_key;
  let total_bytes = 0, is_final_chunk = false;
  const cryptoKey = await crypto.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["decrypt"]);
  while (true) {
    const chunk_tag = await file_reader(read_pos, read_pos + 8);
    let real_size = 0;
    if (chunk_tag.every((v, i) => v === END_IDENTIFIER[i])) {
      const full_bytes = await file_reader(read_pos, read_pos + 32);
      if (full_bytes.every((v, i) => v === END_MARKER[i])) {
        read_pos += 32;
        break;
      }
      if (full_bytes.every((v, i) => v === TAIL_BLOCK_MARKER[i])) {
        is_final_chunk = true;
        read_pos += 32;
        const chunk_len_bytes = await file_reader(read_pos, read_pos + 8);
        read_pos += 8;
        real_size = Number(new DataView(chunk_len_bytes.buffer).getBigUint64(0, true));
        if (real_size === 0) break;
      }
    }
    const ciphertext_length = is_final_chunk ? real_size : chunk_size;
    const iv_array = new ArrayBuffer(12);
    new DataView(iv_array).setBigUint64(4, BigInt(nonce_counter), true);
    nonce_counter++;
    const ciphertext = await file_reader(read_pos, read_pos + ciphertext_length + 16);
    read_pos += ciphertext_length + 16;
    const full_ciphertext = ciphertext;
    try {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(iv_array)
        },
        cryptoKey,
        full_ciphertext
      );
      await file_writer(new Uint8Array(decrypted));
      total_bytes += decrypted.byteLength;
    } catch (e) {
      if (!e) throw new InternalError(`Internal error.`, { cause: e });
      const name = e.name;
      if (name === "InvalidAccessError") throw new InvalidParameterException("InvalidAccessError.", { cause: e });
      if (name === "OperationError") throw new UnexpectedFailureInChunkDecryptionException(void 0, { cause: e });
      if (!e) throw new InternalError(`Unexpected error.`, { cause: e });
    }
    if (callback) callback(total_bytes);
  }
  const total_bytes_bytes = await file_reader(read_pos, read_pos + 8);
  const total_bytes_decrypted = Number(
    new DataView(total_bytes_bytes.buffer).getBigUint64(0, true)
  );
  read_pos += 8;
  const end_marker = await file_reader(read_pos, read_pos + FILE_END_MARKER.length);
  if (total_bytes !== total_bytes_decrypted) throw new FileCorruptedException("total bytes mismatch");
  if (!end_marker.every((v, i) => v === FILE_END_MARKER[i])) throw new InvalidEndMarkerException();
  return true;
}
async function encrypt_blob(blob, password) {
  const buffer = [];
  const file_reader = async (start, end) => new Uint8Array(await blob.slice(start, end).arrayBuffer());
  const file_writer = (data) => buffer.push(data);
  if (!await encrypt_file(file_reader, file_writer, password)) throw new UnexpectedError();
  return new Blob(buffer);
}
async function decrypt_blob(blob, password) {
  const buffer = [];
  const file_reader = async (start, end) => new Uint8Array(await blob.slice(start, end).arrayBuffer());
  const file_writer = (data) => buffer.push(data);
  if (!await decrypt_file(file_reader, file_writer, password)) throw new UnexpectedError();
  return new Blob(buffer);
}

// src/key_management.js
async function export_master_key(file_head, current_key, export_key) {
  if (file_head.size < 1024 + 16 + 4) throw new BadDataException("Data not enough");
  const version = await GetFileVersion(async (start, end) => {
    return new Uint8Array(await file_head.slice(start, end).arrayBuffer());
  });
  if (version === ENCRYPTION_FILE_VER_1_1_0) {
    const ekey_len = new DataView(await file_head.slice(16, 20).arrayBuffer()).getUint32(0, true);
    const buffer = await file_head.slice(20, 20 + ekey_len).arrayBuffer();
    const ekey_ciphertext = str_decode(buffer);
    return await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), export_key);
  }
  if (version === ENCRYPTION_FILE_VER_1_2_10020) {
    if (file_head.size < 16 + PADDING_SIZE) throw new BadDataException("Data not enough");
    const ekey_len = new DataView(await file_head.slice(20, 24).arrayBuffer()).getUint32(0, true);
    const buffer = await file_head.slice(24, 24 + ekey_len).arrayBuffer();
    const ekey_ciphertext = str_decode(buffer);
    return await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), export_key);
  }
  throw new EncryptionVersionMismatchException();
}
async function change_file_password_1_1_0(file_head, current_key, new_key) {
  if (file_head.size < 1024 + 16 + 4) throw new Error("Data not enough");
  const headerBlob = file_head.slice(0, 16);
  const header = await headerBlob.text();
  if (header !== "MyEncryption/1.1") {
    throw new TypeError("Invalid file format");
  }
  const ekey_len = new DataView(await file_head.slice(16, 20).arrayBuffer()).getUint32(0, true);
  const ekey_ciphertext = str_decode(await file_head.slice(20, 20 + ekey_len).arrayBuffer());
  const new_ekey = await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), new_key);
  if (new_ekey.length > 1024) {
    throw new Error("(Internal Error) This should not happen. Contact the application developer.");
  }
  const new_ekey_len = new_ekey.length;
  const new_ekey_len_bytes = new ArrayBuffer(4);
  const new_ekey_len_view = new DataView(new_ekey_len_bytes);
  new_ekey_len_view.setUint32(0, new_ekey_len, true);
  const new_ekey_parts = [headerBlob, new_ekey_len_bytes, str_encode(new_ekey)];
  const padding = new Uint8Array(1024 - new_ekey.length).fill(0);
  new_ekey_parts.push(padding);
  return new Blob(new_ekey_parts);
}
async function change_file_password(file_head, current_key, new_key) {
  if (file_head.size < 1024 + 16 + 4) throw new Error("Data not enough");
  const version = await GetFileVersion(async (start, end) => {
    return new Uint8Array(await file_head.slice(start, end).arrayBuffer());
  });
  if (version === ENCRYPTION_FILE_VER_1_1_0) return await change_file_password_1_1_0(file_head, current_key, new_key);
  const ekey_len = new DataView(await file_head.slice(20, 24).arrayBuffer()).getUint32(0, true);
  const ekey_ciphertext = str_decode(await file_head.slice(24, 24 + ekey_len).arrayBuffer());
  const new_ekey = await encrypt_data(await decrypt_data(ekey_ciphertext, current_key), new_key);
  if (new_ekey.length > 1024) {
    throw new Error("(Internal Error) This should not happen. Contact the application developer.");
  }
  const new_ekey_len = new_ekey.length;
  const new_ekey_len_bytes = new ArrayBuffer(4);
  const new_ekey_len_view = new DataView(new_ekey_len_bytes);
  new_ekey_len_view.setUint32(0, new_ekey_len, true);
  const new_ekey_parts = [file_head.slice(0, 20), new_ekey_len_bytes, str_encode(new_ekey)];
  const padding = new Uint8Array(PADDING_SIZE - new_ekey.length - 4).fill(0);
  new_ekey_parts.push(padding);
  return new Blob(new_ekey_parts);
}

// src/context.js
var CRYPT_CONTEXT = /* @__PURE__ */ Object.create(null);
CRYPT_CONTEXT[Symbol.toStringTag] = "CryptContext";
CRYPT_CONTEXT["toString"] = function() {
  return `${this[Symbol.toStringTag]} Object`;
};
async function _await(PromiseLike) {
  if (PromiseLike instanceof Promise) return await PromiseLike;
  return PromiseLike;
}
async function crypt_context_create() {
  const ctx = Object.create(CRYPT_CONTEXT);
  Object.defineProperty(ctx, "_created", { value: true });
  return ctx;
}
async function crypt_context_destroy(ctx) {
  if (!ctx || ctx._released) throw new InvalidParameterException("Invalid context");
  for (const i of Reflect.ownKeys(ctx)) {
    if (typeof i === "symbol") {
      Reflect.deleteProperty(ctx, i);
      continue;
    }
    const o = Reflect.get(ctx, i);
    if (o) {
      if (o.release) await _await(o.release());
      else if (o.free) await _await(o.free());
      else if (o.reset) await _await(o.reset());
      else if (o.clear) await _await(o.clear());
    }
    if (!i.startsWith("_")) Reflect.deleteProperty(ctx, i);
  }
  Object.defineProperty(ctx, "_released", { value: true });
  return true;
}

// src/stream.js
var InputStream = class {
  #reader = null;
  #cache = {
    position: null,
    end: null,
    data: null
  };
  #size = null;
  get [Symbol.toStringTag]() {
    return "Stream";
  }
  /**
   * @param {function(number, number, AbortSignal): Promise<Uint8Array>} reader The reader function
   * @param {number} size The size of the stream
   */
  constructor(reader, size) {
    if (typeof reader !== "function") throw new InvalidParameterException("Stream: Invalid reader");
    this.#reader = reader;
    if (typeof size !== "number") throw new InvalidParameterException("Stream: Invalid size");
    this.#size = size;
  }
  get size() {
    return this.#size;
  }
  /** @type {AbortController|null} */
  #abort_controller = null;
  /**
   * Read a stream
   * @param {Number} start start pos
   * @param {Number} end end pos
   * @param {Number|null} suggestion_end The suggested end. Used for caching.
   * @param {AbortController|null} abort The abort controller. Used for aborting the read.
   * @returns {Promise<Uint8Array>}
   */
  async read(start, end, suggestion_end = null, abort = null) {
    if (!this.#reader) throw new Error("Stream: The stream has been closed.");
    if (this.#cache.position != null && this.#cache.end && this.#cache.data && (start >= this.#cache.position && end <= this.#cache.end)) {
      return this.#cache.data.slice(start - this.#cache.position, end - this.#cache.position);
    }
    if (start < 0) throw new InvalidParameterException("Stream: Invalid start position");
    if (end > this.#size) end = this.#size;
    if (suggestion_end > this.#size) suggestion_end = this.#size;
    this.#abort_controller = abort;
    if (suggestion_end) {
      const data2 = await this.#reader(start, suggestion_end, abort?.signal);
      this.#abort_controller = null;
      this.#cache.position = start;
      this.#cache.end = start + data2.length;
      this.#cache.data = data2;
      return data2.slice(0, end - start);
    }
    const data = await this.#reader(start, end, abort?.signal);
    this.#abort_controller = null;
    return data;
  }
  abort() {
    this.#abort_controller?.abort();
  }
  purge() {
    this.#cache.position = this.#cache.data = this.#cache.end = null;
  }
  close() {
    this.#reader = null;
    this.purge();
  }
};
async function decrypt_stream_init(ctx, stream, password, {
  cache = true,
  cache_max_size = 256 * 1024 * 1024
} = {}) {
  if (ctx._inited) throw new CryptContextReusedException();
  Object.defineProperty(ctx, "_inited", { value: true });
  ctx._type = "@decrypt_stream";
  ctx.stream = {
    stream,
    release: () => ctx.stream.stream.close()
  };
  const header = await stream.read(0, 13, 5e3);
  if (str_decode(header) !== "MyEncryption/") {
    throw new InvalidFileFormatException();
  }
  const top_header_version = str_decode(await stream.read(13, 16));
  if (!["1.1", "1.2"].includes(top_header_version)) {
    throw new EncryptionVersionMismatchException();
  }
  const version_marker = new DataView((await stream.read(16, 20)).buffer).getUint32(0, true);
  const version = normalize_version(top_header_version, version_marker);
  let read_pos = 16 + 4;
  if (version !== ENCRYPTION_FILE_VER_1_2_10020) {
    throw new NotSupportedException("Cannot perform a streamed decryption on V1.1 files");
  }
  const ekey_len = new DataView((await stream.read(read_pos, read_pos + 4)).buffer).getUint32(0, true);
  const ekey = str_decode(await stream.read(read_pos + 4, read_pos + 4 + ekey_len));
  read_pos += PADDING_SIZE;
  if (ekey_len > PADDING_SIZE) {
    throw new InternalError("(Internal Error) This should not happen. Contact the application developer.");
  }
  const key = await decrypt_data(ekey, password);
  const json_len_bytes = await stream.read(read_pos, read_pos + 4);
  const json_len = new DataView(json_len_bytes.buffer).getUint32(0, true);
  read_pos += 4;
  const header_json = JSON.parse(
    str_decode(await stream.read(read_pos, read_pos + json_len))
  );
  read_pos += json_len;
  const header_version = header_json.v;
  if (![5.5].includes(header_version)) throw new EncryptionVersionMismatchException();
  const [phrase, salt_hex] = header_json.parameter.split(":");
  const salt = unhexlify(salt_hex);
  const iv4key = unhexlify(header_json.iv);
  const N = header_json.N;
  const chunk_size = Number(new DataView((await stream.read(read_pos, read_pos + 8)).buffer).getBigUint64(0, true));
  let nonce_counter = Number(new DataView((await stream.read(read_pos + 8, read_pos + 16)).buffer).getBigUint64(0, true));
  read_pos += 16;
  const { derived_key } = await derive_key(key, iv4key, phrase, N, salt);
  const cryptoKey = await crypto.subtle.importKey("raw", derived_key, { name: "AES-GCM" }, false, ["decrypt"]);
  ctx.key = cryptoKey;
  ctx.chunk_size = chunk_size;
  ctx.nonce_counter = nonce_counter;
  ctx.header_json_length = json_len;
  ctx.cache_enabled = !!cache;
  ctx.cached_chunks = /* @__PURE__ */ new Map();
  ctx.cached_chunks_add_order = new Array();
  ctx.cached_size = 0;
  ctx.cache_max_size = cache_max_size;
  return true;
}
async function decrypt_stream(ctx, bytes_start, bytes_end, abort) {
  if (!ctx._inited) throw new CryptContextNotInitedException();
  if (ctx._type !== "@decrypt_stream") throw new InvalidCryptContextTypeException(ctx._type);
  if (ctx._released) throw new CryptContextReleasedException();
  const stream = ctx.stream.stream;
  const chunk_size = ctx.chunk_size;
  const nonce_counter_start = ctx.nonce_counter;
  const result = [];
  const chunks_start = 16 + 4 + PADDING_SIZE + 4 + ctx.header_json_length + 8 + 8;
  const size_per_chunk = chunk_size + 16;
  const max_chunk = Math.floor((stream.size - chunks_start - (32 + 8 + 32 + 8 + FILE_END_MARKER.length)) / size_per_chunk);
  const start_chunk = Math.max(0, Math.floor(bytes_start / chunk_size));
  const end_chunk = Math.min(max_chunk, Math.floor(bytes_end / chunk_size));
  if (end_chunk < 0 || start_chunk > max_chunk) throw new InvalidParameterException("Out of range");
  const read_chunk = async (chunk) => {
    if (ctx.cache_enabled && ctx.cached_chunks.has(chunk)) {
      return ctx.cached_chunks.get(chunk);
    }
    let pos = chunks_start + chunk * size_per_chunk;
    const eight_bytes = await stream.read(pos, pos + 8, pos + 2 * size_per_chunk, abort);
    let real_size = 0;
    if (eight_bytes.every((v, i) => v === END_IDENTIFIER[i])) {
      const full_bytes = await stream.read(pos, pos + 32, null, abort);
      pos += 32;
      if (full_bytes.every((v, i) => v === END_MARKER[i])) {
        return false;
      }
      if (full_bytes.every((v, i) => v === TAIL_BLOCK_MARKER[i])) {
        const chunk_len_bytes = await stream.read(pos, pos + 8, null, abort);
        pos += 8;
        real_size = Number(new DataView(chunk_len_bytes.buffer).getBigUint64(0, true));
        if (real_size === 0) return false;
      }
    }
    const ciphertext_length = real_size ? real_size : chunk_size;
    const ciphertext = await stream.read(pos, pos + ciphertext_length + 16, null, abort);
    const nonce_counter = nonce_counter_start + chunk;
    const iv_array = new ArrayBuffer(12);
    new DataView(iv_array).setBigUint64(4, BigInt(nonce_counter), true);
    try {
      const data = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(iv_array)
        },
        ctx.key,
        ciphertext
      );
      if (ctx.cache_enabled) {
        if (data.byteLength < ctx.cache_max_size) {
          ctx.cached_chunks_add_order.push(chunk);
          ctx.cached_chunks.set(chunk, data);
          ctx.cached_size += data.byteLength;
        }
        while (ctx.cached_size > ctx.cache_max_size) {
          const oldest_chunk = ctx.cached_chunks_add_order.shift();
          ctx.cached_size -= ctx.cached_chunks.get(oldest_chunk).byteLength;
          ctx.cached_chunks.delete(oldest_chunk);
        }
      }
      return data;
    } catch (e) {
      if (!e) throw new InternalError(`Internal error.`, { cause: e });
      const name = e.name;
      if (name === "InvalidAccessError") throw new InvalidParameterException("InvalidAccessError.", { cause: e });
      if (name === "OperationError") throw new CannotDecryptException("Cannot decrypt. Did you provide the correct password?", { cause: e });
      if (!e) throw new InternalError(`Unexpected error.`, { cause: e });
    }
  };
  let EOFbit = false;
  for (let i = start_chunk; i <= end_chunk; i++) {
    const decrypted_chunk = await read_chunk(i);
    if (!decrypted_chunk) {
      EOFbit = true;
      break;
    }
    result.push(decrypted_chunk);
  }
  const blob_full = new Blob(result);
  const startpos = start_chunk * chunk_size;
  const blob = blob_full.slice(bytes_start - startpos, bytes_end - startpos);
  if (EOFbit) blob.eof = true;
  return blob;
}

// src/internal-expose.js
var Internals = {
  PADDING_SIZE,
  END_IDENTIFIER,
  TAIL_BLOCK_MARKER,
  END_MARKER,
  FILE_END_MARKER,
  nextTick: nextTick2,
  GetFileVersion,
  GetFileInfo,
  GetFileChunkSize,
  derive_key_default_phrases_list: deriveKey__phrases
};

// src/util-wrappers.js
var util_wrappers_exports = {};
__export(util_wrappers_exports, {
  createReaderForFileSystemHandle: () => createReaderForFileSystemHandle,
  createReaderForLocalFile: () => createReaderForLocalFile,
  createReaderForRemoteObject: () => createReaderForRemoteObject,
  createWriterForFileSystemHandle: () => createWriterForFileSystemHandle,
  createWriterForMemoryBuffer: () => createWriterForMemoryBuffer
});
async function createReaderForLocalFile(file) {
  return async (start, end) => {
    return new Uint8Array(await file.slice(start, end).arrayBuffer());
  };
}
async function createReaderForFileSystemHandle(fileSystemHandle) {
  const file = await fileSystemHandle.getFile();
  return await createReaderForLocalFile(file);
}
async function createReaderForRemoteObject(url) {
  return async (start, end) => {
    const resp = await fetch(url, {
      headers: { Range: `bytes=${start}-${end - 1}` }
    });
    if (!resp.ok) throw new NetworkError(`Network Error: HTTP ${resp.status} : ${resp.statusText}`, {
      response: resp
    });
    return new Uint8Array(await resp.arrayBuffer());
  };
}
async function createWriterForFileSystemHandle(fileSystemHandle) {
  const writable = await fileSystemHandle.createWritable();
  return async (data) => {
    await writable.write(data);
  };
}
async function createWriterForMemoryBuffer(bufferOutput) {
  return async (data) => {
    bufferOutput.push(data);
  };
}

// src/version.js
var VERSION = "Encryption/5.6 FileEncryption/1.2 Patch/5.6 Package/1.5.56";
export {
  ENCRYPTION_FILE_VER_1_1_0,
  ENCRYPTION_FILE_VER_1_2_10020,
  exceptions_exports as Exceptions,
  InputStream,
  Internals,
  VERSION,
  util_wrappers_exports as Wrappers,
  change_file_password,
  crypt_context_create,
  crypt_context_destroy,
  decrypt_blob,
  decrypt_data,
  decrypt_file,
  decrypt_stream,
  decrypt_stream_init,
  derive_key,
  derive_key_for_file,
  encrypt_blob,
  encrypt_data,
  encrypt_file,
  export_master_key,
  get_random_bytes,
  get_random_int8_number,
  get_random_uint8_number,
  hexlify,
  IsEncryptedFile as is_encrypted_file,
  IsEncryptedMessage as is_encrypted_message,
  normalize_version,
  scrypt,
  scrypt_hex,
  str_decode,
  str_encode,
  unhexlify
};
//# sourceMappingURL=main.bundle.builder.js.map
