let express = require('express');
let router = express.Router();
const {redisClient} = require('../redis');
const prisma = require('../prisma');

// Get list penyanyi
router.get('/', async function(req, res) {
    const client = redisClient()
    await client.connect();
    if (await client.exists("list_penyanyi")) {
        const penyanyi = await client.get("list_penyanyi");
        await client.disconnect();
        return res.status(200).json({data: JSON.parse(penyanyi)});
    } else {
        const penyanyi = await prisma.user.findMany({
            select: {
                user_id: true,
                name: true
            }
        });
        await client.set("list_penyanyi", JSON.stringify(penyanyi));
        await client.disconnect();
        return res.status(200).json({data: penyanyi});
    }
})

router.get('/:user_id/song', async function(req, res) {
    let {user_id} = req.params;
    user_id = parseInt(user_id);
    const penyanyi = await prisma.user.findUnique({
        where: {
            user_id,
        }
    })
    if (!penyanyi) {
        return res.status(404).json({error: "Singer not found"});
    }
    const lagu = await prisma.song.findMany({
        where: {
            penyanyi_id: user_id
        },
        select: {
            song_id: true,
            Judul: true,
            penyanyi_id: true,
            Audio_path: true
        }
    })
    return res.status(200).json({data: lagu});
})

// Get lagu punya dia sendiri

module.exports = router