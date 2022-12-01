// Database Connection
const prisma = require('../prisma')

module.exports = async (req, res) => {
    try {
        const query = prisma.song.delete({
            where: {
                song_id: parseInt(req.params.id)
            }
        })
        res.status(200).send({
            msg: 'Delete Success'
        })
    } catch (e) {
        res.status(500).send({
            msg:'Delete Failed',
            err: e
        })
    }
}