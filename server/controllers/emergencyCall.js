// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = 'ACa790495d718da26cba1114f0000a4718';
const authToken = '4f585d77913d52b9688348ef2cd83801';
const client = require('twilio')(accountSid, authToken);

client.calls
      .create({
         url: 'https://9812-2409-40f0-100d-b93f-d8c0-cf69-971b-2d4b.ngrok-free.app/callRes.xml',
         to: '+918696074241',
         from: '+14155551212'
       })
      .then(call => console.log(call.sid));
