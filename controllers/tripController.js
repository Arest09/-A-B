const path = require("path");
const {mailer} = require('../nodeMailer')

const trip_get = (req, res) => {
  res.sendFile(path.resolve(__dirname, "../pages/index.html"));
};

const trip_post = (req, res) => {
  const { name, email, count, cost } = req.body;
  
  res.status(200).json(req.body);
  console.log(req.body);

  const message = {
    from: "arest09@mail.ru <arest09@mail.ru>", // sender address
    to:`${email}`,
    subject:'Nevatrip',
    text:`Здравствуйте,${name},${cost}рублей;${count}`,
  }
  mailer(message)
};



module.exports = {
  trip_get,
  trip_post,
};
