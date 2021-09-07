const express = require('express');
const app = express();

//const passport = require('passport');
const dotenv = require('dotenv');
const expressSession = require('express-session');
//const https = require('https');
//const httpsOptions= require('./utils/cert');
dotenv.config();
const logger= require('./utils/logger')(__filename);
app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());
app.use(expressSession({
    secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 20*60000 } // 20 Mins
}));
app.set('view engine','ejs');
//app.use(passport.initialize());
//app.use(passport.session());
//require('./utils/oauth');




app.use('/', require('./routes/user'));
app.use('/',require('./routes/hooks'));
app.use('/', require('./routes/comment_replies'));
app.use(require('./middlewares/404'));

const server = app.listen(process.env.PORT||1234,err=>{
    if(err){
           console.log('Error in Server Start ',err);
    }
    else{
        console.log('Server Started... ', server.address().port);
    }
});