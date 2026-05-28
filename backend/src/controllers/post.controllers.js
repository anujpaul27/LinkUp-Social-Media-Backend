const uploadImage = require("../services/storage.services");


async function imageUpload (req, res) 
{
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const response = await uploadImage(file.buffer.toString('base64'));
    res.status(200).json({ url: response.url });
}

module.exports = {imageUpload}