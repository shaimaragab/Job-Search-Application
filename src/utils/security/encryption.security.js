import CryptoJS from "crypto-js"
export const generateEncryption = ({plainText='',signature=process.env.ENCRYPTION_SIGNATURE}={})=>{
    const encrypted = CryptoJS.AES.encrypt(plainText,signature).toString()
    return encrypted
}
export const decryption = ({cipherText='',signature=process.env.ENCRYPTION_SIGNATURE}={})=>{
    console.log(cipherText,signature);
    
    const decrypted = CryptoJS.AES.decrypt(cipherText,signature).toString(CryptoJS.enc.Utf8)
    console.log({decrypted:decrypted});
    
    return decrypted

}