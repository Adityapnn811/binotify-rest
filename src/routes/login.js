let express = require('express');
let router = express.Router();
const prisma = require('../prisma');
const {checkPassword, signJWT} = require('../utils/auth')

/* Login. */
router.post('/', async function(req, res) {
  const {username, password} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    const email = await prisma.user.findUnique({
        where: {
            email: username
        }
    })
    // Kalo ada user
    if (user) {
        // Cek password
        const valid = checkPassword(password, user.password);
        if (valid) {
            const token = signJWT(user, res)
            const userData = {
                user_id: user.user_id,
                name: user.name,
                username: user.username,
                isAdmin: user.isAdmin
            }
            return res.status(200).json({data: userData, token: token});
        }else{
            return res.status(401).json({data: "Password Anda salah"});
        }
    }else if (email){
        const valid = checkPassword(password, email.password);
        if (valid) {
            const token = signJWT(email, res)
            const userData = {
                user_id: email.user_id,
                name: email.name,
                username: email.username,
                isAdmin: email.isAdmin
            }
            return res.status(200).json({data: userData, token: token});
        }else{
            return res.status(401).json({data: "Password Anda salah"});
        }

    }
    return res.status(200).json({data: "Couldn't find an account with that username/email"});
});

module.exports = router;
