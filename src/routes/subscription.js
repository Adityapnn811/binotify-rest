let express = require('express');
let router = express.Router();
const Formatter = require('../utils/formatter');
const Parser = require('../utils/parser');
const axios = require('axios');
const { verifyJWT } = require('../utils/auth');

/* GET subscription requests listing. */
router.get('/:page', verifyJWT, async function(req, res) {
    let { page } = req.params;
    try{
        const url = process.env.SOAP_URL + "/webservice/subscription"
        let payload = {
            "impl:getSubscriptionReq": {
                apiKey: process.env.SOAP_API_KEY
            }
        }

        const headers = {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8'
            }
        }

        let args = Formatter.convertJsonToSoapRequest(payload);
        let remoteResponse = await axios.post(url, args, headers);
        remoteResponse = await Parser.convertXMLToJSON(remoteResponse.data);
        const data = remoteResponse["S:Body"]["ns2:getSubscriptionReqResponse"]["return"]
        if (!data) {
            return res.status(500).json({data: []});
        }
        // paginate
        const limit = 5;
        const offset = (page - 1) * limit;
        const total = data.length;
        const pages = Math.ceil(total / limit);
        const result = data.slice(offset, offset + limit);
        return res.status(200).json({data: result, total: total, pages: pages});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal server error"});
    }
})

// POST approve subs req
router.post('/approve', verifyJWT, async function(req, res) {
    try{
        const url = process.env.SOAP_URL + "/webservice/subscription"
        const {subscriber_id, creator_id} = req.body;
        let payload = {
            "impl:approveSubscriptionReq": {
                subscriberId: subscriber_id,
                creatorId: creator_id,
                apiKey: process.env.SOAP_API_KEY
            }
        }

        const headers = {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8'
            }
        }

        let args = Formatter.convertJsonToSoapRequest(payload);
        let remoteResponse = await axios.post(url, args, headers);
        console.log("ini remoteREsponse" + remoteResponse);
        remoteResponse = await Parser.convertXMLToJSON(remoteResponse.data);
        const data = remoteResponse["S:Body"]["ns2:approveSubscriptionReqResponse"]["return"]
        if (!data) {
            return res.status(500).json({data: []});
        }
        
        return res.status(200).json({data});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal server error"});
    }
})

// POST reject subs req
router.post('/reject', verifyJWT, async function(req, res) {
    try{
        const url = process.env.SOAP_URL + "/webservice/subscription"
        const {subscriber_id, creator_id} = req.body;
        let payload = {
            "impl:rejectSubscriptionReq": {
                subscriberId: subscriber_id,
                creatorId: creator_id,
                apiKey: process.env.SOAP_API_KEY
            }
        }

        const headers = {
            headers: {
                'Content-Type': 'text/xml; charset=utf-8'
            }
        }

        let args = Formatter.convertJsonToSoapRequest(payload);
        let remoteResponse = await axios.post(url, args, headers);
        remoteResponse = await Parser.convertXMLToJSON(remoteResponse.data);
        const data = remoteResponse["S:Body"]["ns2:rejectSubscriptionReqResponse"]["return"]
        console.log(remoteResponse);
        if (!data) {
            return res.status(200).json({data: []});
        }
        
        return res.status(200).json({data});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal server error"});
    }
})

module.exports = router;
