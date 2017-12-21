const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const dataFile = path.join(__dirname, 'data.json');

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('/names', (req, res) => {
  fs.readFile(dataFile, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

fs.stat(dataFile, (err, stat) => {
	if (err) {
		fs.writeFile(dataFile, JSON.stringify([], null, 4));
		console.log('JSON file created.');
	}
});

app.post('/names', (req, res) => {
	fs.readFile(dataFile, (err, data) => {
		const names = JSON.parse(data);

		const newName = {
			name: req.body.name
		};

		names.push(newName);

		fs.writeFile(dataFile, JSON.stringify(names, null, 4), () => {
			res.setHeader('Cache-Control', 'no-cache');
			res.json({});
		});
	});
});

app.listen(3000, function() {
	console.log('running on 3000');
});
