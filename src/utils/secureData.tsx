import CryptoJS from "crypto-js"
const mailyr = process.env.REACT_APP_CryptoKey as string;
export const encryptedData = (datasend: string): string => {
    try {
        const data = CryptoJS.AES.encrypt(datasend, mailyr).toString();
        return data
    }
    catch (err) {
        return "error: encrypting data"
    }
}

export const decryptData = (datasend: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(datasend, mailyr);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText
    }
    catch (err) {
        return "error: decrypting data"
    }
}
