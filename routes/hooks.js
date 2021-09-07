const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const request = require('request');
//const {io} = require('../utils/socket');
//console.log('IO object is ',io);
const conversationOperations = require('../db/services/conversation_operations');
// Creates the endpoint for our webhook
const express = require('express');
const UserModel = require('../db/models/user_schema');

const route = express.Router();
// Just for SSE Testing and then remove it, add this in dashboard
route.get('/listen',(req,res)=>{
  res.render('lisen');
})
route.post('/webhook', (req, res) => {
  let webhook_event;
  let sender_psid ;
    let body = req.body;
    console.log('::::HOOK BODY ', body);
    // Checks this is an event from a page subscription
    if (body.object === 'page') {

      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        // Gets the message. entry.messaging is an array, but
        // will only ever contain one message, so we get index 0
         webhook_event = entry.messaging[0];
        console.log(webhook_event);

          // Get the sender PSID
   sender_psid = webhook_event.sender.id;
  console.log('Sender PSID: ::::::::' + sender_psid);
      });

      // Check if the event is a message or postback and
  // pass the event to the appropriate handler function
  if (webhook_event && webhook_event.message) {
    handleMessage(sender_psid, webhook_event.message,res);
  } else if (webhook_event && webhook_event.postback) {
    handlePostback(sender_psid, webhook_event.postback);
  }

      // Returns a '200 OK' response to all requests
      console.log("Event Rec");
      //res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      //res.sendStatus(404);
      console.log("404 Not Found in Hooks Post");
    }

  });
  // Verification Hook
  route.get('/webhook', (req, res) => {
    console.log("HOOK VER CALL:::::::::");
    // Your verify token. Should be a random string.
    //let VERIFY_TOKEN = "HELLOIAMTOKEN"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);

      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });


  // Message Stub Starts Here
// Handles messages events
async function handleMessage(sender_psid, received_message, res) {
  let response;
  console.log('Handle Mesage Called :::::::', sender_psid, received_message);
  // console.log('IO is ',io);
  // console.log('Socket ',io.sockets);
  // console.log('EMIT ',io.sockets.emit);

  //io.sockets.emit()
  //io.sockets.emit('dm',{sender_psid, received_message});
  // Check if the message contains text

//   res.writeHead(200, {
//     'content-type' : 'text/event-stream',
//     'connection' : 'keep-alive',
//     'Access-Control-Allow-Origin' : '*'
// });
var obj = {
  received_message,sender_psid
}
// res.write('event: dmmessage\n');
//             res.write('mydata: ' +JSON.stringify(obj)  + '\n\n');
console.log('Response Write ..... ',obj);
  if (received_message.text) {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }
  // Handling Attachment
  else if (received_message.attachments) {

    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;

  }
  // Sends the response message
  try{
  callSendAPI(sender_psid, response);
  const admin = await UserModel.findOne({});
  console.log("MESSAGEEEEEEEEEEEEEEEEEEEEEEE",obj)
  await conversationOperations.addMessage(admin._id.toHexString(), obj.sender_psid.toString(), obj.received_message.text,"user", "dm",{
    "name" : "Himanshu",
    "profileUrl" : "https://scontent.fdel3-1.fna.fbcdn.net/v/t1.6435-1/p200x200/241521040_110296651388250_6396391355727168699_n.png?_nc_cat=109&ccb=1-5&_nc_sid=dbb9e7&_nc_ohc=byktpu-i0awAX-HviCh&_nc_ht=scontent.fdel3-1.fna&oh=a2bd03dfc02b27079c08b03908d4c39a&oe=6159E614"
});
  }
  catch(err){
    console.log("Error During Hook DB Update ", err);
  }
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }


  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}


// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      //socket.emit('dm',{sender_psid, response});
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

// Message Stub ends Here
// Sending Message to Messanger
route.post('/sendmsg',async (request, response)=>{
  try {
		let {message,
    user,
    userInfo,
    type,
    sender} = request.body;
    console.log("Sessionnn:",request.session.userinfo, user,);
		await conversationOperations.addMessage(request.session.userinfo._id,user,message,sender,type,userInfo );
		response.json({ success: true, status: 200 });
  } catch (err) {
    console.log(err)
		logger.error(JSON.stringify(err));
		response
			.status(SERVER_ERROR)
			.json({ message: messageBundle['general.server.error'] });
  }

})




  async function  storeInDb(request,sender_psid, message){
    let userInfo = request.session.userinfo;
    try {
        await conversationOperations.addMessage(
            //'61346fa662cf77cc9b3f9cd2',
            userInfo._id,
            //'hook id',
            sender_psid,
            //'whatever user sent',
            message,
            'admin',
            'post',
            {
                name: 'Himanshu Chandra',
                profileUrl:
                    'https://scontent.fdel3-1.fna.fbcdn.net/v/t1.6435-1/p200x200/241521040_110296651388250_6396391355727168699_n.png?_nc_cat=109&ccb=1-5&_nc_sid=dbb9e7&_nc_ohc=byktpu-i0awAX-HviCh&_nc_ht=scontent.fdel3-1.fna&oh=a2bd03dfc02b27079c08b03908d4c39a&oe=6159E614',
            }
        );
        const convos = await conversationOperations.getAllConversations(
            '61346fa662cf77cc9b3f9cd2'
        );

        console.log(convos);
        response.render('dashboard', { convos });
    } catch (err) {
        logger.error(JSON.stringify(err));
        response
            .status(SERVER_ERROR)
            .json({ message: messageBundle['general.server.error'] });
    }
}


  module.exports= route;