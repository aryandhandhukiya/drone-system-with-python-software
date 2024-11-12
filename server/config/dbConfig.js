const fs = require('fs');
const { Pool } = require('pg')
const url = require('url');



// const { Pool } = require('pg')
// const pool = new Pool({
//     "user": "postgres",
//     "host": "localhost",
//     "port": "5432",
//     "database": "disasterMgmt",
//     "password": "khatri15"
// })

// const connectDb = () => {
//     try {
//         pool.connect()
//         console.log("Database connected")
//     } catch (error) {
//         console.log(error)
//     }
// }


const config = {
    user: "avnadmin",
    password: "AVNS_CsmifaPG0_r4xuo5-SH",
    host: "codecopter-hello937282-c48c.a.aivencloud.com",
    port: 10759,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIURb2koYYPXdvpatXlRMcXxSvB4hQwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvNDIyZjBlYzktZGNjOC00ZWIyLTg0NTQtODI2YzIxMGNi
ZjIwIFByb2plY3QgQ0EwHhcNMjMxMjE5MTMyOTI1WhcNMzMxMjE2MTMyOTI1WjA6
MTgwNgYDVQQDDC80MjJmMGVjOS1kY2M4LTRlYjItODQ1NC04MjZjMjEwY2JmMjAg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBALXAnZLh
o0LEe3xYmKfbSZ10mKFCWECpxvYSeaD0uoFCqDay6B7gjsqadBTANLHhsm2tnYQ0
5JJV6kxn3/NMaTO+AyXOEicSNT/61Mt2gVlkXip9VpChUEKUIl4u/yQy7NkqUQ4p
pwLO0hBTaEb9bf7d+ZWvtUju03/Caixp/wMTwkMCTgHkCGOpfXwLOGKKcAVcKsqi
1W5kBNDZ/t/PZYmAx6fie4qV0pDDATaSZQAfOqCnWo0Vbe7rTduzoTVm2Z2B5odE
RaV+C8/fk+qrcgC+SwzbI+z59Tiv66m+3yqqDBUZX5SCuUIBDmBnTp07H2p/ss5w
sPOgmAVEMeqt/1l2fIVH5wTW/oSbIwOaAWBTDG4wLGIS8T5j5gQibnd2u+sRZEoy
1g7BuxGOcG+39FPQcIsZt7yXC+Xqyh/KXTVFbmx8tgJ6Pc1ic6XcYWi2+KEqEUq0
I5eJ0+tiMiWiTiNfLndWwJ55sZ63FCq7QIsCJ3IDL+DRqIBzQYkxP73yKQIDAQAB
oz8wPTAdBgNVHQ4EFgQU/junQZxMQI1jpuaZb9zByhdaFeYwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBADyrE4g9aynDuwhR
AO3tUdtPqta7lHnvPkAwfMzLM9M95oM/ENnXqgt+WnWR5m6/zw1eE5WfCyvNnnvv
FoiR4IRyKHIbN3aL9PoTm7uIwJc1QHDqKyu6a1zMp83OeKEDKjQxSlCOazQ6m9g7
47PuwhpO1sCPi4FQOvMnjzGhEeAe4E4+KEH09cFzczKOLvUMqHMSEIdWZju3Yt+n
ceDLKn1Kf1mt1EHnRgR/VVYeaX9duvzNEd1AzT0xBzT7yNALI9aHfMQ38ntoRDhK
mxNOsK43gnj15sXE3iERmBf5vhhApmM7I+QGcAYJAdBufUF8MxWU0DEp4xo1sryL
cTICy7Uwo4eqjHDNNGOxSgkxagPG2DYcyB2SICRLJJcs194pbv59w1dhD14c8M/U
CVCWxFiDiDWnlvl0c8C7Kefz7weDB6e4OvVlUsiUvRRkMhnZ3FeBrZfZ99lqZmjU
dvQyqw49XtZ2kdngClu9lBFrep/Jl62GzIRpOguLtwVd9UurOA==
-----END CERTIFICATE-----`,
    },
};

const pool = new Pool(config);
const connectDb = () => {
    try {
        pool.connect()
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }}
module.exports = { pool, connectDb }