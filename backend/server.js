const app = require('./src/app')
const ConnectDB = require('./src/db/db')
const http = require('http')
const initSocket = require('./src/services/socket.services')

    ConnectDB()

// connect socket.io
const server = http.createServer(app) // websocket with express HTTP request handling
initSocket(server)

server.listen(5000, ()=> {
    console.log('Socket server is connected');
})