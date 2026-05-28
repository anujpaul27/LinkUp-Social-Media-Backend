const app = require('./src/app')
const ConnectDB = require('./src/db/db')

    ConnectDB()

app.listen(5000,()=>{
    console.log('Server is running on the 5000 port.');
})