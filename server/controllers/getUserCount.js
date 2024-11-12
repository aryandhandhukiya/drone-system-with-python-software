const express = require('express');
const disasterRoute = express.Router();

const { pool } = require('../config/dbConfig');
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASS,
    },
});

const htmlContent = (hospital, count) => {
    // Replace placeholders with actual values
    const { name, location, distance } = hospital;
    const { x: longitude, y: latitude } = location;
    const googleMapsURL = `https://www.google.com/maps?q=17.4569692,78.6652037`;

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
                                                    There is an emergency near your hospital.
                                                    We found ${count} people injured.
                                                    Please take necessary precautions to save human life.
                                                    <br/>
                                                    Location Details:
                                                    <br/>
                                                    Latitude: ${latitude}
                                                    <br/>
                                                    Longitude: ${longitude}
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


const getUserCount = (req, res) => {
    const count = req.params.count; // Corrected to retrieve count from req.params.count

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

    pool.query(query, [78.6652037, 17.4569692])
        .then(result => {
            const hospitals = result.rows;

            hospitals.forEach(hospital => {
                const mailOptions = {
                    from: process.env.SENDER_EMAIL,
                    to: hospital.email,
                    subject: 'Emergency Alert',
                    html: htmlContent(hospital, count),
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

            res.status(200).json({ message: 'Emergency emails sent successfully' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

module.exports = getUserCount;
