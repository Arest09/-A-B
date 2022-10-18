const express = require("express");
const router = express.Router();

const {trip_get,trip_post} = require("../controllers/tripController")

router.get('/',trip_get)

router.post('/',trip_post)


module.exports = router;

