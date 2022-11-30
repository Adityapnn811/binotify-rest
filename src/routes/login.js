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
            return res.status(200).json({data: "Login success", token: token});
        }else{
            return res.status(200).json({data: "Password salah"});
        }
    }else if (email){
        const valid = checkPassword(password, email.password);
        if (valid) {
            const token = signJWT(email, res)
            return res.status(200).json({data: "Login success", token: token});
        }else{
            return res.status(200).json({data: "Password salah"});
        }

    }
    return res.status(200).json({data: "No user on database"});
});

module.exports = router;
