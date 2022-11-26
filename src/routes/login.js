let express = require('express');
let router = express.Router();
const prisma = require('../prisma');
const {checkPassword} = require('../utils/auth')

/* Login. */
router.post('/', async function(req, res) {
  const {username, password} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    })
    // Kalo ada user
    if (user) {
        // Cek password
        const valid = checkPassword(password, user.password);
        if (valid) {
            // Jika password benar, buat token
            // const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'});
            return res.status(200).json({data: "Login success"});
        } 
    }
    return res.status(401).json({error: "Username/password salah"});
});

module.exports = router;
