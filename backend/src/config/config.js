require('dotenv').config()

if (!process.env.MONGODB_URI)
{
    throw new Error ('MongoDB URI not found in the env.')
}

if (!process.env.IMAGEKIT_PRIVATE_KEY)
{
    throw new Error ('ImageKit private key not found in the env.')
}


const config = {
    MONGODB_URI : process.env.MONGODB_URI,
    IMAGEKIT_PRIVATE_KEY : process.env.IMAGEKIT_PRIVATE_KEY,
}

module.exports = config
