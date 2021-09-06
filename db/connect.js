const mongoose = require('mongoose');
const logger = require('../utils/logger')(__filename);

mongoose.connect(process.env.DB_URL,
    {
     useNewUrlParser:true,
     useUnifiedTopology: true,
     poolSize:process.env.POOLSIZE
    }
     ,(err)=>{
        if(err){
            logger.error('Error in DB Connection '+JSON.stringify(err));
        }
        else{
            logger.debug('DB Connection Establish ...');
        }
});

module.exports = mongoose;