const express = require('express');
const upload = require('../upload');
const Grid = require('gridfs-stream');
const mongoURL =
	'mongodb+srv://ryanrice:320587rRd%40@cluster0.o8eyc.mongodb.net/userAPI?retryWrites=true&w=majority';
const mongoose = require('mongoose');
const conn = mongoose.createConnection(mongoURL);
const jwt = require('jsonwebtoken');
require('dotenv').config();

function routes(User) {
	const userRouter = express.Router();

	let gfs;
	let gridfsBucket;

	function authenticateToken(req, res, next) {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (token == null) return res.sendStatus(401);

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.sendStatus(403);
			req.user = user;
			next();
		});
	}

	conn.once('open', () => {
		gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
			bucketName: 'uploads'
		});
		gfs = Grid(conn.db, mongoose.mongo);
		gfs.collection('uploads');
	});

	userRouter.route('/users').get(authenticateToken, (req, res) => {
		User.find((err, users) => {
			if (err) {
				return res.send(err);
			} else {
				return res.json(users);
			}
		});
	});

	userRouter.route('/user/pdf/:_id').post(upload.single('file'), (req, res, next) => {
		if (!req.file) {
			const error = new Error('Please upload a file');
			error.httpStatusCode = 400;
			return next(error);
		} else {
			User.updateOne(
				{ _id: req.params._id },
				{
					$set: {
						pdfId: req.file.filename
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

	userRouter.route('/user/:_id').post(upload.single('file'), (req, res, next) => {
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
					},
					$push: {
						files: req.file.filename
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

	userRouter.route('/pdf/:filename').get((req, res) => {
		gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
			if (!file || file.length === 0) {
				return res.status(404).json({
					err: 'No files exist'
				});
			}
			if (file.contentType === 'application/pdf') {
				const readstream = gridfsBucket.openDownloadStream(file._id);
				readstream.pipe(res);
			} else {
				res.status(404).json({
					err: 'Not an image'
				});
			}
		});
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
				console.log(result);
				const accessToken = jwt.sign(result.toJSON(), process.env.ACCESS_TOKEN_SECRET);
				return res.json({ accessToken: accessToken, _id: result._id });
			}
		});
	});

	userRouter.route('/user/:_id').get(authenticateToken, (req, res) => {
		User.findOne({ _id: req.params._id }, (err, result) => {
			if (err) {
				return res.send(err);
			} else {
				return res.status(200).json(result);
			}
		});
	});

	userRouter.route('/delete/:_id').delete(authenticateToken, (req, res) => {
		User.findOne({ _id: req.params._id }, (err, result) => {
			console.log(res.json(result));
			if (err) {
				return res.send(err);
			} else {
				gfs.files.remove({ filename: result.pdfId });
				gfs.files.remove({ filename: result.avatarId });
			}
		});
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
