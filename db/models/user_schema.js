/**
 * User Schema
 * @author Mohammad Umaid Ansari
 *
 * @version 1.0
 * @summary Maintain User Schema
 */
const mongoose = require('../connect');
const {Schema, SchemaTypes} = mongoose;
const {USER_SCHEMA} = require('../../utils/config').SCHEMAS;
const UserSchema = new Schema({
    facebookid:{type:SchemaTypes.String, required:true, unique:true},
    email:{type:SchemaTypes.String, required:true, unique:true},
    name:{type:SchemaTypes.String, required:true},
    accesstoken:{type:SchemaTypes.String}
}
)
const UserModel = mongoose.model(USER_SCHEMA,UserSchema);
module.exports = UserModel;