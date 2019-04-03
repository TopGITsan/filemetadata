'use strict';

const express = require('express');
const cors = require('cors');

// require and use "multer"...
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

const app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/hello', function (req, res, next) {
	res.json({ message: "Hello, API" });
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
	const fileName = req.file.filename;
	const size = req.file.size;

	res.json({ filename: fileName, size: size })

});


// Not found middleware
app.use((req, res, next) => {
	return next({ status: 404, message: 'not found' })
})

// Error Handling middleware
app.use((err, req, res, next) => {
	let errCode, errMessage

	if (err.errors) {
		// mongoose validation error
		errCode = 400 // bad request
		const keys = Object.keys(err.errors)
		// report the first validation error
		errMessage = err.errors[keys[0]].message
	} else {
		// generic or custom error
		errCode = err.status || 500
		errMessage = err.message || 'Internal Server Error'
	}
	res.status(errCode).type('txt')
		.send(errMessage)
})

const port = process.env.PORT;

app.listen(port, () => {
	console.log('App is running on port: ' + port);
});
