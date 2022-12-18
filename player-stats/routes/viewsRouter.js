const express = require('express');
const router = express.Router()

const playerData = require('../data/playerData.json')


router.get('/players', (req, res) => {

    res.render('data', { players: playerData })
})







module.exports = router