// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = 'ACa790495d718da26cba1114f0000a4718';
const authToken = '4f585d77913d52b9688348ef2cd83801'; // Replace with your actual Auth Token
const client = require('twilio')(accountSid, authToken);

 const sendSms = () => {
  try {
    client.messages.create({
      body: 'Alert there is a disaster occured location:- https://www.google.com/maps?q=17.45666667,78.66527778',
      from: '+12059272734',
      to: '+918696074241'
    }).then(message => console.log(message.sid));
  } catch (error) {
    console.error(error);
  }
};
module.exports=sendSms