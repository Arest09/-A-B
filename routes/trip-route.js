const express = require("express");
const router = express.Router();

const {trip_get} = require("../controllers/tripController")

router.get('/',trip_get)


module.exports = router;

