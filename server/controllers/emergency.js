const { pool } = require('../config/dbConfig')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const senderEmail = process.env.SENDER_EMAIL
const senderPass = process.env.SENDER_APP_PASS
const secret = process.env.SESSION_SECRET 
const urlAdddress = process.env.FRONTEND_URL


const htmlContent = (url) => {
    return (`
      
    <!doctype html>
    <html lang="en-US">
    
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Verify Your Email</title>
        <meta name="description" content="Verify Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
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
                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Verify Your Email</h1>
                              
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
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Verify</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:40px; margin:0;">
                                            Verify Your Email Address. If you did not make this request, please ignore this email.
                                            <br/>
                                            This request will expire in 10 minutes for security reasons.
                                            <br/>
                                            To verify your email, click on the below :
                                            </p>
                                            
                                            <a href=${url}
                                                style="background:#208AB4;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;">Verify
                                                Email</a>
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
    `)
}

const getInfo = async (adharNumber) => {
    // const userInfo = await pool.query(`SELECT * FROM user`)
    const userInfo = await pool.query(`SELECT email,id FROM user_register WHERE adhar_number = $1`, [adharNumber])
    // console.log(userInfo)
    return userInfo.rows[0]
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderEmail,
        pass: senderPass
    }
})

const emergency = async (req, res) => {
    
    const { name, number, location } = req.body

    try {
        const userinfo = await getInfo(number)
        if (!userinfo) {
            res.send({error:"User not found"})
        }
        console.log(userinfo.email);
        const { longitude, latitude } = location


        const payload = {...req.body,id:userinfo.id}
        const token = jwt.sign(payload, secret, {
            expiresIn: '10m'
        })
        // verifyrece_token(token)
        const mailOptions = {
            from: senderPass,
            to: userinfo.email,
            subject: 'Verify user',
            html: htmlContent(`${urlAdddress}/verify-email/${token}`)
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.send({Error: error})
            } else {
                return res.send({ message: "Check mail" })
            }
        })
        // res.status(200).json({ message: 'Data inserted successfully', insertedData: result.rows[0] })
    } catch (error) {
        console.error('Error inserting data:', error)
        res.status(500).send({ error: 'Something went wrong' })
    }
}

module.exports = emergency
