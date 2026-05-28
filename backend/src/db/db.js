const mongoose = require('mongoose')
const config = require('../config/config')

async function ConnectDB ()
{
    try 
    {
        await mongoose.connect(config.MONGODB_URI)
        console.log('Database Connected...');
    }
    catch (err)
    {
        console.log(err.message);
    }
}

module.exports = ConnectDB 