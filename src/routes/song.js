// Define Router
const express = require('express')
const router = express.Router()

router.get('/:name', async (req, res) => {
    const PATH = __basedir + "/song/" + req.params.name

    res.download(PATH, req.params.name, (e) => {
        if (e) {
            res.status(500).send({
                msg: "Download failed",
                err: e
            })
        }
    })
})

module.exports = router