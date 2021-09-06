const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const logger= require('./utils/logger')(__filename);
app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());
app.set('view engine','ejs');
app.use('/', require('./routes/user'));

const server = app.listen(process.env.PORT||1234,err=>{
    if(err){
           console.log('Error in Server Start ',err);
    }
    else{
        console.log('Server Started... ', server.address().port);
    }
})
