module.exports = {
	ROUTES: {
		DASHBOARD: '/dashboard',
		LOGIN: '/login',
		GET_CONVO: '/get-convo',
		//LOGIN_FB:'/auth/facebook',
		//FB_CALLBACK:'/auth/facebook/callback',
		POST: '/post',
	},
	SCHEMAS: {
		USER_SCHEMA: 'users',
		CONVERSATION_SCHEMA: 'conversations',
	},

	CODES: {
		FILE_NOT_FOUND: 404,
		SERVER_ERROR: 500,
		SUCCESS: 200,
	},
	OAUTH: {
		FACE_BOOK: {
			CLIENT_ID: process.env.FB_APP_ID,
			CLIENT_SECRET: process.env.FB_SECRET,
			CALLBACK_URL: process.env.FB_CALLBACK_URL,
		},
		GOOGLE: {},
	},
};