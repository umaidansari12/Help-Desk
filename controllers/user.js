const userOperations= require('../db/services/user_operations');
const {SUCCESS, SERVER_ERROR} = require('../utils/config').CODES;
const messageBundle = require('../locales/en.json');
const logger = require('../utils/logger')(__filename);
module.exports = {
    async facebookLogin(request, response){
        try{
        console.log('BODY ::::::: ', request.body);
        const userObject = request.body;
        const user = await userOperations.login(userObject);
        console.log('User ', user);
        response.status(SUCCESS).json({...user});
        }
        catch(err){
            response.status(SERVER_ERROR).json({message:messageBundle['facebook.user.loginfails']})
            logger.error(JSON.stringify(err));
        }

    },
    dashboard(request,response){
        response.render("dashboard");
    }



}