
const Alexa = require('alexa-sdk');
var atob = require('atob');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var OktaAPI = require('okta-node');
var okta = new OktaAPI("api token", "vanbeektech");

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
};

var oktaUpdate = function(userId) {
  var updated;
 
  return new Promise(function(resolve, reject) {
    
    
      okta.users.updatePartial(userId, {accessTokenAlexa: "signin"}, null, function(d){
      	updated = "test"
      	resolve(updated);
      });     
  });
}

var oktaReset = function(userId) {
	var updated;
 
  return new Promise(function(resolve, reject) {
    
    
      okta.users.updatePartial(userId, {accessTokenAlexa: "false"}, null, function(d){
      	updated = "test"
      	resolve(updated);
      });
                
  });
}

exports.handler = function (event, context) {
    console.log("event: " + JSON.stringify(event));
    const alexa = Alexa.handler(event, context);
    alexa.appId = "amzn1.ask.skill.a7447a69-8a3e-43be-a911-71acae900768";
    alexa.registerHandlers(handlers);
    alexa.execute();
};




var handlers = {
    "SayHello": handleSayHello,
    "blue": blueColor,
    "cityOfBirth": birthCity,
    "DemoReset": reset    
};


function handleSayHello() {
    this.emit(":ask", "Hey Avb .... What is your favorite color?  Answer by saying my favorite color is");
}

function blueColor() {

		var token = parseJwt(this.event.session.user.accessToken)
		var userColor = token.favoritecolor

		var color = this.event.request.intent.slots.Answer.value

		if(color == userColor){
			this.emit(":ask", 'You replied with' + this.event.request.intent.slots.Answer.value + "... What was your city of birth??  Answer by saying my city of birth is");


		} else {

    	this.emit(":ask", 'ohhhh nice choice brah, that color of ' + this.event.request.intent.slots.Answer.value);

    }
    
    this.emit(":ask", "What was your city of birth??  Answer by saying my city of birth is")	
}

function reset(){
	var token = parseJwt(this.event.session.user.accessToken)
		var uid = token.uid
		var alexaScope = this
		const makeReset = async (function() {
  			var something = await (oktaReset(uid))
  			alexaScope.emit(":tell", 'reseting demo');
		});

		makeReset()

}




function birthCity() {

		var token = parseJwt(this.event.session.user.accessToken)
		var userCity = token.birthcity
		var uid = token.uid

		var city = this.event.request.intent.slots.CITY.value

		if(city.toUpperCase() == userCity.toUpperCase()){ 
			var alexaScope = this
			const makeRequest = async (function() {
  				var something = await (oktaUpdate(uid))
  				alexaScope.emit(":tell", 'ok logging you in now');
			});

			makeRequest()

		
			
	
		} else {
			this.emit(":tell", 'False credentials, try again.');
			okta.users.updatePartial(uid, {accessTokenAlexa: "false"}, null, function(d){});

		}


	
    
}




