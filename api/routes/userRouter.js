const express = require('express');
const upload = require('../upload');
const Grid = require('gridfs-stream');
const mongoURL =
	'mongodb+srv://ryanrice:320587rRd%40@cluster0.o8eyc.mongodb.net/userAPI?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const conn = mongoose.createConnection(mongoURL);

function routes(User, UserFile) {
	const userRouter = express.Router();

	let gfs;
	let gridfsBucket;

	conn.once('open', () => {
		gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
			bucketName: 'uploads'
		});
		gfs = Grid(conn.db, mongoose.mongo);
		gfs.collection('uploads');
	});

	userRouter.route('/users').get((req, res) => {
		User.find((err, users) => {
			if (err) {
				return res.send(err);
			} else {
				return res.json(users);
			}
		});
	});

	userRouter.route('/user/:_id').post(upload.single('file'), (req, res, next) => {
		const _id = mongoose.Types.ObjectId(req.params._id);
		console.log(_id);
		if (!req.file) {
			const error = new Error('Please upload a file');
			error.httpStatusCode = 400;
			return next(error);
		} else {
			User.updateOne(
				{ _id: req.params._id },
				{
					$set: {
						avatarId: req.file.filename
					}
				},
				(err, result) => {
					if (err) {
						return res.send(err);
					} else {
						return res.json(result);
					}
				}
			);
		}
	});

	userRouter.route('/image/:filename').get((req, res) => {
		gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
			if (!file || file.length === 0) {
				return res.status(404).json({
					err: 'No files exist'
				});
			}
			if (
				file.contentType === 'image/jpeg' ||
				file.contentType === 'img/png' ||
				file.contentType === 'image/jpg'
			) {
				const readstream = gridfsBucket.openDownloadStream(file._id);
				readstream.pipe(res);
			} else {
				res.status(404).json({
					err: 'Not an image'
				});
			}
		});
	});

	userRouter.route('/users').post((req, res) => {
		const user = new User(req.body);
		console.log(user);
		user.save();
		return res.status(201).json(user);
	});

	userRouter.route('/login').get((req, res) => {
		const username = req.query.username;
		const password = req.query.password;
		console.log(username);
		/* Find user with matching password otherwise return error */
		User.findOne({ userName: username, password: password }, (error, result) => {
			if (error) {
				return res.send(error);
			} else {
				return res.json(result);
			}
		});
	});

	userRouter.route('/user/:_id').get((req, res) => {
		User.findOne({ _id: req.params._id }, (err, result) => {
			if (err) {
				return res.send(err);
			} else {
				return res.status(200).json(result);
			}
		});
	});

	userRouter.route('/delete/:_id').delete((req, res) => {
		User.remove({ _id: req.params._id }, (err, result) => {
			if (err) {
				return res.send(err);
			} else {
				return res.status(204).json(result);
			}
		});
	});
	return userRouter;
}

module.exports = routes;
