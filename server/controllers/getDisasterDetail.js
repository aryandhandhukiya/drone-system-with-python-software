const { pool } = require('../config/dbConfig')

getDisasterDetail=async(req,res)=>{
    try {
        const result = await pool.query(`SELECT * FROM disaster_detail`) 
        return res.send(result.rows)
    } catch (error) {
        return res.send({error:"Something went wrong"})
    }
}

module.exports = getDisasterDetail