const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");

const data = {
  id: 10
};

let token = jwt.sign(data, "123abc");
console.log(token);
let decoded = jwt.verify(token, "123abc");
console.log(decoded);

/*
const msg = "User number 3";
const code = SHA256(msg).toString();

console.log(`msg: ${msg}`);
console.log(`code:${code}`);

const data = {
  id: 4
};
const token = {
  data,
  hash: SHA256(JSON.stringify(data) + "somesecret").toString()
};
*/
