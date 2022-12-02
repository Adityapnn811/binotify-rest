// Database Connection
const prisma = require('../prisma')

module.exports = async (req, res) => {
    try {
        const deleteSong = await prisma.user.update({
            where: {
                user_id: req.userId
            },
            data: {
                Song: {
                    delete: {
                        song_id: parseInt(req.params.id)
                    }
                }
            }

        })
        res.status(200).send({
            msg: 'Delete Success',
            data: deleteSong
        })
    } catch (e) {
        res.status(500).send({
            msg:'Delete Failed',
            err: e
        })
    }
}