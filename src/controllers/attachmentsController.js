const { Storage } = require('@google-cloud/storage');
const { Readable } = require('stream');

// Initialize express and multer

// Initialize GCP Storage
const storage = new Storage({ keyFilename: 'credentials.json' });
const bucket = storage.bucket('sewain');

const attachmentsControllers = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Create a new blob in the bucket and set its content type
    const blob = bucket.file("attachments/" + req.file.originalname);
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });

    // Convert buffer to stream
    const fileStream = new Readable();
    fileStream.push(req.file.buffer);
    fileStream.push(null);  // Indicates the end of the stream

    fileStream.pipe(blobStream);

    blobStream.on('error', err => {
        console.error('Stream error:', err);
        res.status(500).send(err);
    });

    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).json({attachment_url : publicUrl});
    });
};

module.exports = {attachmentsControllers};
