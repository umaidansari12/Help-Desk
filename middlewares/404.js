const {FILE_NOT_FOUND} = require("../utils/config").CODES;
const messageBundle = require("../locales/en.json");
module.exports = (request ,response, next)=>{
    response.status(FILE_NOT_FOUND).send(messageBundle['file.not.found']);
}