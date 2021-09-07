const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/sendreply',async (request, response)=>{
    let pageAccessToken = request.session.pageAccessToken;
    try{
    const result = await axios.post(`https://graph.facebook.com/v11.0/me/messages?access_token=${pageAccessToken}`,{
        messaging_type:'',
        recipient:{
            id:request.body.id, // this is the conversation id

        },
        message:{
            text:request.body.message
        }
    });
    response.status(200).json(result);
}
catch(err){
    console.log('Error During Send Reply to Comment ', err);
}
})
router.get('/getpostconversation',async (request, response)=>{
    let currentPage ;
    let posts= [];
    const {facebookid, accesstoken} = request.session.userinfo;
    try{
        const pageList = await axios(`https://graph.facebook.com/${facebookid}/accounts?access_token=${accesstoken}`);

        if(pageList && pageList.data){

            pageList.data.data.forEach(page=>{ // Usually one page is per business , i pick out of 3
                if(page.name=='Richpaneltestpage'){
                    currentPage = page;
                }
            })
        }
        request.session.pageAccessToken= currentPage.access_token;
        // get the page post
        const postList = await axios(`https://graph.facebook.com/${currentPage.id}/feed?access_token=${currentPage.access_token}`);

         if(postList && postList.data){
            postList.data.data.forEach(post=>{
                if(post.message){
                    posts.push(post);
                }
            })
        }
        // get the page wise comments and then replies
        for(let i = 0; i<posts.length; i++){
            const commentList= await axios(`https://graph.facebook.com/v11.0/${posts[i].id}/comments?access_token=${currentPage.access_token}`);

            if(commentList && commentList.data){
                posts[i].comments = commentList.data.data;
                for (let j = 0;j<posts[i].comments.length; j++){
                    const replies = await axios(`https://graph.facebook.com/v11.0/${posts[i].comments[j].id}/comments?access_token=${currentPage.access_token}`)

                    if(replies && replies.data){
                        posts[i].comments[j].replies = replies.data.data;
                    }
                }
            }
        }

        response.status(200).json({"posts":posts});

    }
    catch(err){
        console.log('Error in Post Conversation ', err);
    }

})
module.exports = router;