'use strict';

const Conversations = require('../models/conversation_schema');
const maxTimeDifference = 86399584; //24 hours

const addMessage = async (
	admin,
	user,
	message,
	sender,
	type,
	userInfo,
	postId,
	commentId
) => {
	const today = new Date();
	const existingConversations = await Conversations.find({
		admin,
		user,
		type,
	})
		.limit(1)
		.sort({ updatedAt: -1 });

	const existingConversation =
		existingConversations && existingConversations.length
			? existingConversations[0]
			: null;

	if (
		existingConversation &&
		((existingConversation.type === 'dm' &&
			today - new Date(existingConversation.updatedAt) <
				maxTimeDifference) ||
			existingConversation.type === 'post')
	) {
		await Conversations.updateOne(
			{
				_id: existingConversation._id,
			},
			{
				$push: { messages: { sender, message } },
			}
		);
		return;
	}

	await Conversations.create({
		admin,
		user,
		type,
		userInfo,
		postId: type === 'post' ? postId : null,
		commentId: type === 'post' ? commentId : null,
		messages: [
			{
				sender,
				message,
			},
		],
	});

	return;
};

const getAllConversations = async (admin) => {
	const convos = await Conversations.find({ admin })
		.sort({ updatedAt: -1 })
		.populate('admin');
	return convos;
};

const getConversationById = async (id) => {
	const convo = await Conversations.findById(id).populate('admin');
	return convo;
};

module.exports = { addMessage, getAllConversations, getConversationById };
