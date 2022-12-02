// Define Router
const express = require('express')
const router = express.Router()

// Verification
const {verifyJWT} = require('../utils/auth')

const getSong = require('./getSong')
const postSong = require('./postSong')
const putSong = require('./putSong')
const deleteSong = require('./deleteSong')

router.post('/', verifyJWT, postSong)
router.get('/:id', verifyJWT, getSong)
router.put('/:id', verifyJWT, putSong)
router.delete('/:id', verifyJWT, deleteSong)

module.exports = router