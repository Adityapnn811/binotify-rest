// Database Connection
const prisma = require('../prisma')

module.exports = async (req, res) => {
    try {
        const query = await prisma.song.findFirstOrThrow({
            where: {
                song_id: parseInt(req.params.id)
            }
        })

        res.status(200).send({
            name: query.Judul,
            URL: req.protocol + '://' + req.get('host') + query.Audio_path
        })
    } catch (e) {
        if (e instanceof NotFoundError) {
            res.status(404).send({ msg: '404: Not Found' })
        } else {
            res.status(500).send({
                msg: 'Get Failed',
                err: e
            })
        }
    }
}