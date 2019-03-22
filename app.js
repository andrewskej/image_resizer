const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const indexRouter = require('./routes/index')
app.use('/', indexRouter)
app.use('/uploads', express.static('uploads')) //For image uploads

http.Server(app).listen(port = 3000, () => {
    console.log('Server listening on *:' + port)
});

