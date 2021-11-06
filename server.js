let express = require('express')
let path = require('path')
// let SocketIO = require('socket.io')
let qrcode = require('qrcode')
let uploadFile = require('./lib/uploadFile')
let fs = require('fs')

function connect(conn, PORT) {
    let app = global.app = express()
    let _qr = 'invalid'
    app.use(async (req, res) => {
        if (req.path == '/session' && conn.state == 'open') return res.send(conn.base64EncodedAuthInfo())
        if (conn.state == 'open') return res.status(403).send({status: 403, message: 'Bot Telah Tersambung ke whatsapp web anda!' })
        qrr = await qrcode.toBuffer(_qr, { scale: 75 })
        let { url } = (await uploadFile(qrr)).result
        html = fs.readFileSync('./views/scan.html', 'utf-8')
        res.send(html.replace(/\$QRURL/g, url))
    })
    conn.on('qr', qr => {
        _qr = qr
    })
    
    let server = app.listen(PORT, () => console.log('App listened on port', PORT))
}

module.exports = connect
