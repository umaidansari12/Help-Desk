const init = ()=>{
    FB.getLoginStatus(function(response) {
      if (response.authResponse && response.status === 'connected') {
        console.log('Login Status ',response);
      }
      else{
        return ;
      }
    });
}
window.addEventListener('load',init);



function doLogin() {
    FB.login( function(response) {
      if (response.authResponse && response.status === 'connected') {
        const {userID,accessToken } = response.authResponse;
        FB.api(`https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`,function(res){
        (async function(facebookid, accesstoken,email,name){
          console.log(facebookid, accesstoken, email, name);
          const result = await fetch('https://serene-dawn-33480.herokuapp.com/login',{
            headers: {
              'Content-Type': 'application/json'
            },
            method:'POST',
            body: JSON.stringify({facebookid, accesstoken, email, name})
          });
          console.log('::::Result is ',result);
          location.href="/dashboard";
        })(userID,accessToken,res.email,res.name);
        });

      } else {
        document.querySelector('#result').innerText = 'Problem During FaceBook Login';
        console.log("Unable to Login ", response);
      }

      console.log(response);
    },{scope: 'email,public_profile',auth_type: 'rerequest'});
  }