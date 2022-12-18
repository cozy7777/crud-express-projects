const express = require('express');
const router = express.Router()

const playerData = require('../data/playerData.json')

//read
router.get('/', (req, res) => {

    //settomg the query to object keys
    let ObjectKeys = Object.keys(req.query)

    //checking if query exists
    if(ObjectKeys.length > 0) {

        //trying to find player by index
        let foundPlayerIndex = playerData.findIndex(item => item.name === req.query.name)
        console.log(`player index: ${foundPlayerIndex}`);

        //responding to request using player index above
        if(foundPlayerIndex === -1) {
            //player not found
            res.status(500).json({
                message: 'failure',
                payload: 'sorry player not found'
            })
        } else {
            //found player send his data
            res.status(200).json({
                message: 'success',
                payload: playerData[foundPlayerIndex]
            })
        }
            
    } else {
        //no query so just send all the  data
        res.status(200).json({
            message: 'success',
            payload: playerData
        })
        
    }
})
//create
router.post('/', (req, res) => {
    //parsing the name from the json body and fingind index 
    let foundPlayerIndex = playerData.findIndex(item => item.name === req.body.name)

    //if player already exists
    if(foundPlayerIndex !== -1) {
        res.status(500).json({
            message: 'failure',
            payload: 'player already exists cannot add'
        })
        //player doesnt exist go ahead and add it
    } else {
        //push json data to player data
        playerData.push(req.body)
        //display new player data for user
        res.status(200).json({
            message: 'success',
            payload: playerData
        })
    }
    
})
//update
router.put('/', (req, res) => {
    //finding player index using the request json body name key like above
    let foundPlayerIndex = playerData.findIndex(item => item.name === req.body.name)

    //if player doesnt exist
    if(foundPlayerIndex === -1) {
        res.status(500).json({
            message: 'failure',
            payload: 'sorry player doesnt exist cannot update'
        })
    } else {
        //declare the target player and the new player data
        let incomingObj = req.body
        let targetObj = playerData[foundPlayerIndex]

        //swap objects
        Object.assign(targetObj, incomingObj)
        
        //send back full data to user
        res.status(200).json({
            message: 'success',
            payload: playerData
        })
    }

})
//delete
router.delete('/', (req, res) => {
    let foundPlayerIndex = playerData.findIndex((item) => item.name === req.query.name)

    if(foundPlayerIndex === -1) {
        res.status(500).json({
            message: 'failure',
            payload: 'sorry player does not exist cannot delete'
        })
    } else {
        playerData.splice(foundPlayerIndex, 1)
        res.status(200).json({
            message: 'success',
            payload: playerData
        })
    }
})











module.exports = router