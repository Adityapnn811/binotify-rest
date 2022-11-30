let express = require('express');
let router = express.Router();
const Formatter = require('../utils/formatter');
const Parser = require('../utils/parser');
const axios = require('axios')

/* GET subscription requests listing. */
router.get('/', async function(req, res) {
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
