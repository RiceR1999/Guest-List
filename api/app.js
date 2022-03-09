const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;
const User = require('./models/userModel');
const dbUrl =
	'mongodb+srv://ryanrice:320587rRd%40@cluster0.o8eyc.mongodb.net/userAPI?retryWrites=true&w=majority';
const db = mongoose.connect(dbUrl);
const userRouter = require('./routes/userRouter.js')(User);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	res.send('Welcome to my API!');
});

app.listen(port, () => {
	console.log('API running on port ' + port);
});

app.use('/api', userRouter);
