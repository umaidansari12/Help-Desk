const UserModel = require('../models/user_schema');
const messageBundle = require('../../locales/en.json');
const login = async(userObject)=>{
    let doc = await find(userObject.facebookid);
    if(doc && doc.name){
        return {message:messageBundle['facebook.user.login'],doc};
    }
    else{
       doc =   await UserModel.create(userObject);
       return {message: messageBundle['facebook.user.register'],doc};
    }

}
const find = async (facebookId)=>{
    return await UserModel.findOne({facebookid: facebookId})
}
module.exports = {login};