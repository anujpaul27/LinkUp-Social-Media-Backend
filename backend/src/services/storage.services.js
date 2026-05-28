const ImageKit = require("@imagekit/nodejs");
const config = require("../config/config");

const ImageKitClient = new ImageKit ({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
}) 

async function uploadImage (file)
{
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "LinkUp_Profile_Picture.jpg",
        folder: "/LinkUp/Profile_Pictures",
    })
    return result 
}

module.exports = uploadImage