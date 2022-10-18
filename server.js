require('dotenv').config()
const express = require ('express');
const tripRoute = require ('./routes/trip-route')

const app = express();

const PORT = 3000;

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(process.env.PORT || 3000, (error) => {
    error ? console.log(error) : console.log(`listening port ${PORT}`);
  });


app.use(tripRoute)

