import CryptoJS from "crypto-js";

export function base64encode(string: string) {
  const encodedWord = CryptoJS.enc.Utf8.parse(string);
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
  return encoded;
}

export function base64decode(string: string) {
  const encodedWord = CryptoJS.enc.Base64.parse(string);
  const decoded = CryptoJS.enc.Utf8.stringify(encodedWord);
  return decoded;
}
