let express = require('express');
let router = express.Router();
const axios = require('axios')

router.post('/createSubs', async function(req, res){
    const {creatorId, subscriberId, status} = req.body;
    
    res.status(200).json({data: {creatorId, subscriberId, status}});
})

router.put('/approveSubs', async function(req, res){
    const {creatorId, subscriberId, status} = req.body;
    console.log(creatorId, subscriberId, status)
    const url = "http://php8:80/subscription/approveRequest";
    const payload = {
        creatorId: creatorId,
        subscriberId: subscriberId,
    }
    const headers = {
        headers: {
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
        }
    }
    await axios.post(url, payload, headers).then(result => {
        const {status} = result.data;
        if (status == 1) {
            return res.status(200);
        }
        return res.status(500);
    }).catch(err => {
        console.log(err)
        return res.status(500).json({error: "Internal server error"});
    })
})

router.put('/rejectSubs', async function(req, res){
    const {creatorId, subscriberId, status} = req.body;
    console.log(creatorId, subscriberId, status)
    const url = "http://php8:80/subscription/rejectRequest";
    const payload = {
        creatorId: creatorId,
        subscriberId: subscriberId,
    }
    const headers = {
        headers: {
            'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>'
        }
    }
    await axios.post(url, payload, headers).then(result => {
        const {status} = result.data;
        if (status == 1) {
            return res.status(200);
        }
        return res.status(500);
    }).catch(err => {
        return res.status(500).json({error: "Internal server error"});
    })
})

module.exports = router