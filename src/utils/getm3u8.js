// CODE By riimuru/gogoanime
import CryptoJS from 'crypto-js'

let iv = null;
let key = null;
let second_key = null;
const fetch_keys = () => {
  const res = {
    "key": "37911490979715163134003223491201",
    "second_key": "54674138327930866480207815084989",
    "iv": "3134003223491201"
  }
  return {
    iv: CryptoJS.enc.Utf8.parse(res.iv),
    key: CryptoJS.enc.Utf8.parse(res.key),
    second_key: CryptoJS.enc.Utf8.parse(res.second_key),
  };
};

export function generateEncryptAjaxParameters($, id) {
  const keys = fetch_keys();
  iv = keys.iv;
  key = keys.key;
  second_key = keys.second_key;
  const encrypted_key = CryptoJS.AES.encrypt(id, key, {
    iv,
  });
  const script = $("script[data-name='episode']").data().value;
  const token = CryptoJS.AES.decrypt(script, key, {
    iv,
  }).toString(CryptoJS.enc.Utf8);
  return 'id=' + encrypted_key + '&alias=' + id + '&' + token;
}
export function decryptEncryptAjaxResponse(obj) {
  const decrypted = CryptoJS.enc.Utf8.stringify(
    CryptoJS.AES.decrypt(obj.data, second_key, {
      iv,
    })
  );
  return JSON.parse(decrypted);
}