import CryptoJS from 'crypto-js';
import patModel from '../models/pat.model.js';
import { responseData } from './response.util.js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes

// Encrypt with random IV
export function encrypt(text) {
  const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
  const iv = CryptoJS.lib.WordArray.random(16); // 128-bit IV

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Combine IV + ciphertext (base64)
  const combined = iv.concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
}

// Decrypt using extracted IV
export function decrypt(base64Ciphertext) {
  const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
  const combined = CryptoJS.enc.Base64.parse(base64Ciphertext);

  // Split IV and ciphertext
  const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16); // 16 bytes
  const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4), combined.sigBytes - 16);

  const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}


export const getPat = async (userId) => {
    try {

        const find_pat = await patModel.findOne({userId: userId});
        if(!find_pat) {
            return ""
        }

        return encrypt(find_pat?.pat);
        
    } catch (error) {

        console.log(error);
    }
}