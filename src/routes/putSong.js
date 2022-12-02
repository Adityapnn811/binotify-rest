// Database Connection
const prisma = require('../prisma')

// Middleware
const post = require("../utils/upload")

module.exports = async (req, res) => {
    try {
        await post(req, res);

        if (req.file == undefined) {
            return res.status(400).send({
                msg: "File not found/Wrong Filetype"
            })
        }

        const query = await prisma.song.update({
            where: {
                song_id: parseInt(req.params.id)
            },
            data: {
                Judul: req.body.judul,
                Audio_path: '/song/' + req.file.filename
            }
        })

        res.status(200).send({
            msg: `Updated`,
            query
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            msg: `Error updating.`,
            err: e
        })
    }
}