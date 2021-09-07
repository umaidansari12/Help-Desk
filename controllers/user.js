const userOperations= require('../db/services/user_operations');
const conversationOperations = require('../db/services/conversation_operations');
const { SUCCESS, SERVER_ERROR } = require('../utils/config').CODES;
const messageBundle = require('../locales/en.json');
const logger = require('../utils/logger')(__filename);
module.exports = {
	async facebookLogin(request, response) {
		try {
			console.log('BODY ::::::: ', request.body);
			const userObject = request.body;

			const user = await userOperations.login(userObject);
			console.log('userObject is ',userObject, " User ", user);
			userObject._id=user.doc._id.toHexString();
			console.log('User ', user,' UserObject is ',userObject);
			if (request.session) {
				request.session.userinfo = userObject;
				console.log("Session Set ", request.session.userinfo);
			}
			response.status(SUCCESS).json({ ...user });
		} catch (err) {
			logger.error(JSON.stringify(err));
			response
				.status(SERVER_ERROR)
				.json({ message: messageBundle['facebook.user.loginfails'] });
		}
	},
	async dashboard(request, response) {
		try {
			// await conversationOperations.addMessage(
			// 	'61346fa662cf77cc9b3f9cd2',
			// 	'hook id',
			// 	'whatever user sent',
			// 	'admin',
			// 	'post',
			// 	{
			// 		name: 'Himanshu Chandra',
			// 		profileUrl:
			// 			'https://scontent.fdel3-1.fna.fbcdn.net/v/t1.6435-1/p200x200/241521040_110296651388250_6396391355727168699_n.png?_nc_cat=109&ccb=1-5&_nc_sid=dbb9e7&_nc_ohc=byktpu-i0awAX-HviCh&_nc_ht=scontent.fdel3-1.fna&oh=a2bd03dfc02b27079c08b03908d4c39a&oe=6159E614',
			// 	}
			// );

			const convos = await conversationOperations.getAllConversations(
				request.session.userinfo._id
			);


			//console.log(convos);
			response.render('dashboard', { convos });
		} catch (err) {
			logger.error(JSON.stringify(err));
			response
				.status(SERVER_ERROR)
				.json({ message: messageBundle['general.server.error'] });
		}
	},


	async getConvo(request, response) {
		try {
			const convo = await conversationOperations.getConversationById(
				request.body.id
			);
			// console.log(convo);
			response.json({ success: true, status: 200, convo: convo });
		} catch (err) {
			logger.error(JSON.stringify(err));
			response
				.status(SERVER_ERROR)
				.json({ message: messageBundle['general.server.error'] });
		}
	},
};