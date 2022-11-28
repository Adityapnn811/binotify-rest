const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")


function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function signJWT(user, res) {  
    const token = jwt.sign({ id: user.user_id }, "ini rahasia negara top secret", {
        algorithm: 'HS256',
    });
    // res.cookie('token', token, {
    //     httpOnly: true,
    // });
    return token
  }

module.exports = {hashPassword, checkPassword, signJWT}