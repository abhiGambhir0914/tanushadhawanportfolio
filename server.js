require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 9090;

app.use(express.static('tanusha'));

//body-parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile('index.html',{root: __dirname + '/tanusha' });
});

// http://ttanushadhawan.com/.well-known/acme-challenge/Co7s_UoFa0hIK0nm3L6VQTSX3CW2HELDWwzWqwdMyXM
app.get('/.well-known/acme-challenge/rwXJpp8KrcoMZWBBmX3owCaWb7R8BJi_E1cFjnD9j7g', function(req, res) {
  res.send('rwXJpp8KrcoMZWBBmX3owCaWb7R8BJi_E1cFjnD9j7g.iyC8arb5uN3JZG_ukrvbhewWUx8frNsssUr3JBXax5Q')
})

app.get('/.well-known/acme-challenge/7UA0Sqt77IjbLS8AwxVgNuJA6B-IOdMj83bjHTQUERY', function(req, res) {
  res.send('7UA0Sqt77IjbLS8AwxVgNuJA6B-IOdMj83bjHTQUERY.iyC8arb5uN3JZG_ukrvbhewWUx8frNsssUr3JBXax5Q')
})

app.post('/send', (req,res) => {
  console.log(req.body)

  const output = `
    <p>You have a new message from your website ttanushadhawan.com</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      
      <h3>Message<h3>
      <p> ${req.body.message}</p>
    </ul>
  `;


    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(
      {
          host: "smtp.gmail.com",
          port: 587, 
          secure: false,
          auth: {
              user: process.env.EMAIL_TUNNEL,
              pass: process.env.EMAIL_PASS
          },
          tls:{
            rejectUnauthorized: false
          }
          // logger: true,
          // debug: false // include SMTP traffic in the logs
      },
      {
          // default message fields

          // sender info
          from: process.env.EMAIL_TUNNEL,
          headers: {
              'X-Laziness-level': 1000 // just an example header, no need to use this
          }
      }
  );

  // Message object
  let message = {
      // Comma separated list of recipients
      to: process.env.EMAIL_TO,
      
      // Subject of the message
      subject: 'New Message from your website...',

      // plaintext body
      text: 'Hello to myself!',

      // HTML body
      html: output
  };

  transporter.sendMail(message, (error, info) => {
      if (error) {
          console.log('Error occurred');
          console.log(process.env.EMAIL_TUNNEL)
          console.log(process.env.EMAIL_PASS)
          console.log(process.env.EMAIL_TO)

          return console.log(error.message);
      }

      console.log('Message sent successfully!');
      console.log(info.messageId);
      console.log(nodemailer.getTestMessageUrl(info));

      console.log('refresh')

  });
  
});

app.listen(port, () => console.log(`Server set up at ${port}`));