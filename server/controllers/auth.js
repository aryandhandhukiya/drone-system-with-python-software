const { pool } = require('../config/dbConfig')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const {verifyrece_token}= require('../middleware/jwtToken')
const sendSms= require('./sendSms')
require('dotenv').config()


const senderEmail = process.env.SENDER_EMAIL
const senderPass = process.env.SENDER_APP_PASS
const secret = process.env.SESSION_SECRET 
const urlAdddress = process.env.FRONTEND_URL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASS
    }
});

const htmlContent = (hospital) => {
    // Replace placeholders with actual values
    const { name, location } = hospital;
    const { x: longitude, y: latitude } = location;
    const googleMapsURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    return `
        <!DOCTYPE html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Emergency Alert</title>
            <meta name="description" content="Emergency Alert Email Template.">
            <style type="text/css">
                a:hover {
                    text-decoration: underline !important;
                }
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" "
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <a href="https://yourwebsite.com" title="logo" target="_blank">
                                        <img src="https://yourwebsite.com/path/to/logo.png" title="logo" alt="logo">
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; ;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 30px; justify-text:auto">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Emergency Alert</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:40px; margin:0;">
                                                    Dear ${name},
                                                    <br/>
                                                    There is an emergency near your hospital. Please take necessary precautions.
                                                    <br/>
                                                    Location Details:
                                                    <br/>
                                                    Latitude: ${latitude}
                                                    <br/>
                                                    Longitude: ${longitude}
                                                    <br/>
                                                    You can view the location on Google Maps by clicking the following link:
                                                    <a href="${googleMapsURL}" target="_blank">View on Google Maps</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        
        </html>
    `;
};


const verifyUser = async (req, res) => {

    const { token } = req.body
    try {
        const user = await verifyrece_token(token)
        if (user == "not valid") {
            return res.send({ error: "invalid user" })
        }
        else if (user) {
            console.log(user);
            const result = await pool.query(
                `INSERT INTO disaster_detail(user_id, location) VALUES($1, POINT($2, $3)) RETURNING *`,
                [user.id, user.location.longitude, user.location.latitude]
            )
            sendSms()

            const query = `
        SELECT
            name,
            email,
            location,
            SQRT(POWER($1 - location[0], 2) + POWER($2 - location[1], 2)) AS distance
        FROM
            hospital
        ORDER BY
            distance
        LIMIT 5;`;

            pool.query(query, [user.longitude, user.latitude])
                .then(result => {
                    console.log(result.rows);
                    const hospitals = result.rows;

                    hospitals.forEach(hospital => {
                        const mailOptions = {
                            from: process.env.SENDER_EMAIL,
                            to: hospital.email,
                            subject: 'Emergency Alert',
                            html: htmlContent(hospital)
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Error sending email:', error);
                                res.status(500).json({ error: 'Error sending emails' });
                            } else {
                                console.log('Email sent:', info.response);
                            }
                        });
                    });

                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
            return res.send({ message: "Alert sent", data: user })
        }
        else {
            res.send({ error: "something went wrong" })
        }
    } catch (error) {
        console.log(error);
        res.send({ error: "something went wrong" })
    }

}
module.exports = verifyUser