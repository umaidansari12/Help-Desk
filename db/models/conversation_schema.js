const mongoose = require('../connect');
const { Schema, SchemaTypes } = mongoose;
const { CONVERSATION_SCHEMA, USER_SCHEMA } =
	require('../../utils/config').SCHEMAS;
const ConversationSchema = new Schema(
	{
		admin: { type: Schema.Types.ObjectId, ref: USER_SCHEMA },
		user: { type: SchemaTypes.String },
		userInfo: {
			name: { type: SchemaTypes.String },
			profileUrl: { type: SchemaTypes.String },
		},
		messages: [
			{
				sender: {
					type: SchemaTypes.String,
					enum: ['user', 'admin'],
				},
				message: { type: SchemaTypes.String },
				timestamp: { type: SchemaTypes.Date, default: Date.now },
			},
		],
		type: { type: SchemaTypes.String, enum: ['post', 'dm'] },
		postId: SchemaTypes.String,
		commentId: SchemaTypes.String,
	},
	{ timestamps: true }
);

ConversationSchema.index({ user: 1, admin: 1 });
const ConversationModel = mongoose.model(
	CONVERSATION_SCHEMA,
	ConversationSchema
);
module.exports = ConversationModel;
