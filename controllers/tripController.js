const path = require('path');

const trip_get = (req,res)=>{
    res.sendFile(path.resolve(__dirname,'../pages/index.html'))
}


module.exports = {trip_get};