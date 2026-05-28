require('dotenv').config()

if (!process.env.MONGODB_URI)
{
    throw new Error ('MongoDB URI not found in the env.')
}


const config = {
    MONGODB_URI : process.env.MONGODB_URI,
}

module.exports = config
