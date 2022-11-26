const bcrypt = require('bcryptjs');

function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {hashPassword, checkPassword}