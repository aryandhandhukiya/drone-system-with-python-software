import fetch from 'node-fetch'

const SERVICE_PLAN_ID = '42f9c99314cc4db78259265ebd085eda';
const API_TOKEN = '3bea8f2ff54c427084d6d164c20e924e';
const SINCH_NUMBER = '+447520651040';
const TO_NUMBER = '+918696074241';

async function run() {
  const resp = await fetch(
    'https://us.sms.api.sinch.com/xms/v1/' + SERVICE_PLAN_ID + '/batches',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_TOKEN
      },
      body: JSON.stringify({
        from: SINCH_NUMBER,
        to: [TO_NUMBER],
        body: 'Programmers are tools for converting caffeine into code. We just got a new shipment of mugs! Check them out: https://tinyurl.com/4a6fxce7!'
      })
    }
  );

  const data = await resp.json();
  console.log('Sinch API Response:', data);

  // Check for errors or additional information in the response.
  if (data.errors) {
    console.error('Sinch API Error:', data.errors);
  }
}

run();
