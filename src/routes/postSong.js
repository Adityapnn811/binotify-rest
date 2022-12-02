// Database Connection
const prisma = require('../prisma')

// Middleware
const post = require("../utils/upload")

module.exports = async (req, res) => {
    try {
        await post(req, res);

        console.log(req);

        if (req.file == undefined) {
            return res.status(400).send({
                msg: "File not found/Wrong Filetype"
            })
        }

        const query = await prisma.song.create({
            data: {
                Judul: req.body.judul,
                Audio_path: '/song/' + req.file.filename,
                Penyanyi: {
                    connect: {
                        user_id: req.userId
                    }
                }
            }
        })

        res.status(200).send({
            msg: `Uploaded`,
            query
        })

    } catch (e) {
        console.log(e);
        res.status(500).send({
            msg: `Error uploading.`,
            err: e
        })
    }
}