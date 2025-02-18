/* ------------------------------- encription ------------------------------- */



const crypto = require('crypto');
// require('dotenv/config');
// const ENC_KEY = process.env.ENCRYPTIONKEY;
 const ENC_KEY= "f15ff91b59354c50b224d2ef77c835bf14f28efc9a1b446f839899c7d3774cbb" // set random encryption key
// const IV = process.env.ENCIV;

const IV = "89959e390a16454b9956d33c6d930a9d";
// set random initialisation vector
// ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex');



var encrypt = ((val) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY.substring(0,32), IV.substring(0,16));
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
});

var decrypt = ((encrypted) => {
  let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY.substring(0,32), IV.substring(0,16));
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return (decrypted + decipher.final('utf8'));
});
module.exports = {encrypt, decrypt}