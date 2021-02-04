const resutlEnv = require('dotenv').config()

if (resutlEnv.error) {
    throw resutlEnv.error;
}

console.log(resutlEnv.parsed);
const app = require("./app");
