module.exports = {
    ROUTES:{
        DASHBOARD:'/dashboard',
        LOGIN:'/login',
        POST:'/post'
    },
    SCHEMAS:{
        USER_SCHEMA:'helpdesk'
    },

    CODES:{
        FILE_NOT_FOUND:404,
        SERVER_ERROR:500,
        SUCCESS:200
    },
    OAUTH:{
        FACE_BOOK:{
            CLIENT_ID:process.env.FB_APP_ID,
            CLIENT_SECRET:process.env.FB_SECRET,
            CALLBACK_URL:process.env.FB_CALLBACK_URL
        },
        GOOGLE:{

        }

    }

}