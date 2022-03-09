const multer = require('multer');
const mongoURL =
	'mongodb+srv://ryanrice:320587rRd%40@cluster0.o8eyc.mongodb.net/userAPI?retryWrites=true&w=majority';
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const storage = new GridFsStorage({
	url: mongoURL,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename,
					bucketName: 'uploads'
				};
				resolve(fileInfo);
			});
		});
	}
});

const upload = multer({ storage: storage });

module.exports = upload;
