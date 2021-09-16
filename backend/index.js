const express =require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')
const router = require('./controller/file.router')

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(router);

app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), () => {
    console.log('server started');
})