const Crypto = require('crypto-random-string');

const generateToken = (): string => {
    return Crypto(128)
}

export default generateToken;