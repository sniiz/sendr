import * as crypto from "crypto";
import Storage from "expo-storage";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    getAuth,
    updateDoc,
    deleteDoc,
} from "../firebase";

export function generateKeyPair(
    privateToStorage = true,
    publicToFirestore = true
) {
    return new Promise((resolve, reject) => {
        const keypair = crypto.generateKeyPairSync("rsa", {
            modulusLength: 8192,
            namedCurve: "secp256k1",
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
                cipher: "aes-256-cbc",
                passphrase: getAuth().currentUser.uid, // (probably not the greatest idea of all time)
            },
        });

        if (privateToStorage) {
            Storage.setItem({
                key: "privateKey",
                value: keypair.privateKey,
            });
        }

        if (publicToFirestore) {
            updateDoc(doc(getFirestore(), "users", getAuth().currentUser.uid), {
                publicKey: keypair.publicKey,
            });
        }

        resolve(keypair);
    });
}

export function encryptWithPublicKey(publicKey, data) {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(data);
        const encrypted = crypto.publicEncrypt(publicKey, buffer);
        resolve(encrypted.toString("base64"));
    });
}

export function decryptWithPrivateKey(privateKey, data) {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(data, "base64");
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                passphrase: getAuth().currentUser.uid,
            },
            buffer
        );
        resolve(decrypted.toString());
    });
}

export function destroyLocalKeys() {
    return new Promise((resolve, reject) => {
        Storage.removeItem({
            key: "privateKey",
        });
        Storage.removeItem({
            key: "publicKey",
        });
        resolve();
    });
}

export function getKeys() {
    return new Promise((resolve, reject) => {
        Storage.getItem({
            key: "privateKey",
        }).then((privateKey) => {
            Storage.getItem({
                key: "publicKey",
            }).then((publicKey) => {
                resolve({
                    privateKey: privateKey,
                    publicKey: publicKey,
                });
            });
        });
    });
}

// TODO: encryption
