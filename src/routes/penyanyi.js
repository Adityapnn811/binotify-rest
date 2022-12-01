let express = require('express');
let router = express.Router();
const { redisClient } = require('../redis');
const prisma = require('../prisma');
const Formatter = require('../utils/formatter');
const Parser = require('../utils/parser');
const axios = require('axios')
const {verifyJWT} = require('../utils/auth')

// Get list penyanyi
router.get('/', verifyJWT, async function(req, res) {
    const client = redisClient()
    await client.connect();
    if (await client.exists("list_penyanyi")) {
        const penyanyi = await client.get("list_penyanyi");
        await client.disconnect();
        return res.status(200).json({data: JSON.parse(penyanyi)});
    } else {
        const penyanyi = await prisma.user.findMany({
            select: {
                user_id: true,
                name: true
            }
        });
        await client.set("list_penyanyi", JSON.stringify(penyanyi));
        await client.disconnect();
        return res.status(200).json({data: penyanyi});
    }
})

// Get lagu penyanyi dengan userId
router.get('/:user_id/song', async function(req, res) {
    let {user_id} = req.params;
    user_id = parseInt(user_id);
    let subscriber_id = 1; // Nanti minta data dari bino app
    // let {subscriber_id} = req.body
    // Validasi melalui SOAP
    try{
        const url = process.env.SOAP_URL + "/webservice/subscription"
        let payload = {
            "impl:checkEndpointRequest": {
                subscriberId: subscriber_id,
                creatorId: user_id,
                apiKey: process.env.SOAP_API_KEY
            }
            // "impl:getSubscriptionReq": {
            //     apiKey: process.env.SOAP_API_KEY
            // }
        }

        const headers = {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8'
            }
        }

        let args = Formatter.convertJsonToSoapRequest(payload);
        let remoteResponse = await axios.post(url, args, headers);
        remoteResponse = await Parser.convertXMLToJSON(remoteResponse.data);
        const data = remoteResponse["S:Body"]["ns2:checkEndpointRequestResponse"]["return"]
        console.log(remoteResponse);
        if (!data) {
            return res.status(401).json({error: "User is not subscribed"});
        }
        if (data.status === "ACCEPTED") {
            const penyanyi = await prisma.user.findUnique({
                where: {
                    user_id,
                }
            })
            if (!penyanyi) {
                return res.status(404).json({error: "Singer not found"});
            }
            const lagu = await prisma.song.findMany({
                where: {
                    penyanyi_id: user_id
                },
                select: {
                    song_id: true,
                    Judul: true,
                    penyanyi_id: true,
                    Audio_path: true
                }
            })
            return res.status(200).json({data: lagu});
        } else {
            return res.status(401).json({error: "User is not subscribed"});
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal server error"});
    }
    
})

// Get lagu punya dia sendiri
router.get('/song', verifyJWT, async function(req, res) {
    let user_id = req.userId; // ini nanti diganti sama jwt
    let page = 1
    if (req.query.page) {
        page = parseInt(req.query.page)
    }
    const itemPerPage = 10;
    // Tambahin error unauthorized kalo user_id ga ada
    let lagu = await prisma.song.findMany({
        where: {
            penyanyi_id: user_id
        },
        select: {
            song_id: true,
            Judul: true,
            penyanyi_id: true,
            Audio_path: true
        }
    })
    let totalPage = Math.ceil(lagu.length / itemPerPage);
    if (page > totalPage) {
        return res.status(404).json({error: "Page not found"});
    }
    let start = (page - 1) * itemPerPage;
    let end = start + itemPerPage;
    lagu = lagu.slice(start, end)
    return res.status(200).json({data: lagu, totalPage, page});
})

module.exports = router