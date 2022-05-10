import * as crypto from "crypto";

export function getKeyPair(privateToStorage = false, publicToFirestore = true) {
    const keypair = crypto.generateKeyPairSync("rsa", {
        modulusLength: 8192,
        publicKeyEncoding: {},
    });
}
// TODO: encryption
