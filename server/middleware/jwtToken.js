const jwt = require('jsonwebtoken')

const secret = process.env.SESSION_SECRET
const verifytokentest = (req, res, next) => {

  const token = req.headers['authorization']

  if (typeof token !== "undefined") {
    const response = verifyrece_token(token)
    if (response == "not valid") {
      return res.send("not valid")
    }
    else {
      return next()
    }
  }
  else {
    res.send('auth')
  }
}
const verifyrece_token = (token) => {

  return jwt.verify(token, secret,
    function (err, decoded) {
      if (err) {
        console.log(err)
        return "not valid"
      }
      else {
        const userid = decoded
        return decoded
      }
    })

}

module.exports = { verifyrece_token, verifytokentest }