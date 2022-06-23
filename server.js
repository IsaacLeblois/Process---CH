const express = require('express')
const http = require('http')
const logger = require('morgan')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

//RUTAS
const users = require('./routes/usersRoutes.js')

const port = process.env.PORT || 3000;

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(cors())

app.disable('x-powered-by')

app.set('port', port)

//LLAMANDO RUTAS
users(app)

server.listen(3000, '192.168.100.184' || 'localhost', function() {
    console.log('Servidor NODEJS '+process.pid+' iniciado en el puerto '+port)
})

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).send(err.stack)
})

module.exports = {
    app: app,
    server: server
}