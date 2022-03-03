const mongoose = require('mongoose');
const { Schema } = mongoose;

const userFileModel = new Schema({
	date: { type: Number },
	userId: { type: Number },
	image: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('UserFile', userFileModel);
