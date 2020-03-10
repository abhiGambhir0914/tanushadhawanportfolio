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
              user: 'abigambhir@gmail.com',
              pass: 'bc9a96@CODE'
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
          from: 'abigambhir@gmail.com',
          headers: {
              'X-Laziness-level': 1000 // just an example header, no need to use this
          }
      }
  );

  // Message object
  let message = {
      // Comma separated list of recipients
      to: 'abhigambhir97@gmail.com',

      // Subject of the message
      subject: 'Nodemailer is unicode friendly ✔' + Date.now(),

      // plaintext body
      text: 'Hello to myself!',

      // HTML body
      html: output
  };

  transporter.sendMail(message, (error, info) => {
      if (error) {
          console.log('Error occurred');
          return console.log(error.message);
      }

      console.log('Message sent successfully!');
      console.log(info.messageId);
      console.log(nodemailer.getTestMessageUrl(info));

      console.log('refresh')

  });
  
});

app.listen(port, () => console.log(`Server set up at ${port}`));