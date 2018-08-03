const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const password = "123abc!";

/*
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});
*/

const hashedValue =
  "$2a$10$M.x7n24qUw5jGlviRo9TuewWMrwLmQp9pxUn5Aq.IQazi9PUhWY6a";

bcrypt.compare(password, hashedValue, (e, res) => {
  console.log(res);
});

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
