let express = require('express');
let router = express.Router();
const prisma = require('../prisma');
const {validateEmail, validateUsername} = require('../utils/validation')
const {hashPassword} = require('../utils/auth')
const {redisClient} = require('../redis');

/* Login. */
router.post('/', async function(req, res) {
    const {username, password, email, name} = req.body;
    const userUname = await prisma.user.findUnique({
        where: {
            username
        }
    })
    const userEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })
    // Kalo ada
    if (userUname) {
        return res.status(400).json({error: "Username is used"});
    }
    if (userEmail) {
        return res.status(400).json({error: "Email is used"});
    }
    // Validasi email sama username
    if (validateEmail(email) && validateUsername(username)) {
        // Hash password
        const hashedPassword = hashPassword(password);
        // Buat user
        const userCreated = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                name,
                isAdmin: false
            }, select: {
                user_id: true,
                username: true,
            }
        })
        // Return error kalo gagal
        if (!userCreated) {
            return res.status(500).json({error: "User creation failed. Please try again."});
        }
        const client = redisClient()
        await client.connect();
        await client.del("list_penyanyi");
        await client.disconnect();
        return res.status(201).json({data: userCreated});
    }
    return res.status(400).json({error: "Invalid email/username"});
});

module.exports = router;
