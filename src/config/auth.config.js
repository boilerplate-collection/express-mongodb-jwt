require('dotenv').config();

module.exports = {
    secret: process.env.JWTSECRET,
    validity: process.env.JWT_VALIDITY
};