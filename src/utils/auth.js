const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

const jwtSecret = "ini rahasia negara top secret"
function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function signJWT(user, res) {  
    const token = jwt.sign({ id: user.user_id }, jwtSecret, {
        algorithm: 'HS256',
    });
    return token
}

function verifyJWT(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    // parse authorization headers
    const bearerToken = token.split(' ');
    console.log(bearerToken)
    jwt.verify(bearerToken[1], jwtSecret, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
}


module.exports = {hashPassword, checkPassword, signJWT, verifyJWT}