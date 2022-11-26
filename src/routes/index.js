let express = require('express');
let router = express.Router();
const {redisClient} = require('../redis');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const client = redisClient()
  await client.connect();
  if (await client.exists("kunci_coba")) {
    console.log("ada")
    console.log(await client.get("kunci_coba"));
    await client.del("kunci_coba");
  } else {
    console.log("ga ada");
    await client.set("kunci_coba", "nilai_coba");
  }
  await client.disconnect();
  console.log("Homepage")
  res.status(200).send("<p>Homepage edited yay 2 dasdasdasd</p>");
});

module.exports = router;
