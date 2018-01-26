
const Alexa = require('alexa-sdk');
var atob = require('atob');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var OktaAPI = require('okta-node');
var okta = new OktaAPI("your token", "your url");

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
};

var oktaUpdate = function(userId, value) {
  var updated;
 
  return new Promise(function(resolve, reject) {
    
      if(value.toUpperCase() == "lion".toUpperCase()){
        okta.users.updatePartial(userId, {firstPicture: value}, null, function(d){
          updated = "test"
          resolve(updated);
        });  

      } else if(value.toUpperCase() == "batman".toUpperCase()){
        okta.users.updatePartial(userId, {secondPicture: value}, null, function(d){
          updated = "test"
          resolve(updated);
        }); 
      } else if(value.toUpperCase() == "starbucks".toUpperCase()){
        okta.users.updatePartial(userId, {lastPurchase: "starbucks"}, null, function(d){
          updated = "test"
          resolve(updated);
        }); 


      } else if(value == "false"){ 
        okta.users.updatePartial(userId, {accessTokenAlexa: value, firstPicture: value, secondPicture: value, lastPurchase: value}, null, function(d){
          updated = "test"
          resolve(updated);
        });
      } else {
        okta.users.updatePartial(userId, {accessTokenAlexa: value}, null, function(d){
          updated = "test"
          resolve(updated);
        });   

      }
   
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
    "pictureRequest": requestPicture,
    "secondPictureRequest": requestPictureTwo,
    "DemoReset": reset,
    "StopDemo": stopTheDemo,
    "LastPurchase": lastTransaction

};


function stopTheDemo() {

  this.emit(":tell", "Please Try again.");


}

function handleSayHello() {
     var token = parseJwt(this.event.session.user.accessToken)
     var name = token.firstname
    this.emit(":ask", "Hey " + name + " What picture do you see? Reply with this is a picture of a");
}

function requestPicture(){

  var token = parseJwt(this.event.session.user.accessToken)


  var picture = this.event.request.intent.slots.PICTURE.value


  var uid = token.uid
  var alexaScope = this
  if(picture.toUpperCase() == "lion".toUpperCase()){
    var makePictureRequest = async (function() {
        var something = await (oktaUpdate(uid, "lion"))
        alexaScope.emit(":ask", 'Correct! It is a picture of a ' + picture +'.  What picture do you see? Reply with this is a picture of the');
    });

    makePictureRequest()
  } else {
     alexaScope.emit(":ask", 'Try again');
  }

}

function requestPictureTwo(){

  var token = parseJwt(this.event.session.user.accessToken)


  var picture = this.event.request.intent.slots.Hero.value
  

  var uid = token.uid
  var alexaScope = this
  if(picture.toUpperCase() == "batman".toUpperCase()){
    var makePictureRequestTwo = async (function() {
        var something = await (oktaUpdate(uid, "batman"))
        alexaScope.emit(":ask", 'Correct it is a picture of the ' + picture +'.  Where was your last purchase?  Reply with my last purchase was at');
    });

    makePictureRequestTwo()
  } else {
     alexaScope.emit(":ask", 'Try again');
  }

}

function blueColor() {

		var token = parseJwt(this.event.session.user.accessToken)
		var userColor = token.favoritecolor

		var color = this.event.request.intent.slots.Answer.value

		if(color == userColor){
			this.emit(":ask", 'You replied with' + this.event.request.intent.slots.Answer.value + ".  What was your city of birth??  Answer by saying my city of birth is");


		} else {

    	this.emit(":ask", 'ohhhh nice choice brah, that color of ' + this.event.request.intent.slots.Answer.value);

    }
    
    this.emit(":ask", 'Try again')	
}

function reset(){
	var token = parseJwt(this.event.session.user.accessToken)
		var uid = token.uid
		var alexaScope = this
		const makeReset = async (function() {
  			var something = await (oktaUpdate(uid, "false"))
  			alexaScope.emit(":tell", 'reseting demo');
		});

		makeReset()

}


function lastTransaction() {

  var token = parseJwt(this.event.session.user.accessToken)


  var coffee = this.event.request.intent.slots.PURCHASE.value
  

  var uid = token.uid
  var alexaScope = this
  if(coffee.toUpperCase() == "Starbucks".toUpperCase()){
    var makeTransactionRequest = async (function() {
        var something = await (oktaUpdate(uid, "starbucks"))
        alexaScope.emit(":ask", 'Correct! your last transaction was at' + coffee +'.  What was your city of birth??  Answer by saying my city of birth is');
    });

    makeTransactionRequest()
  } else {
     alexaScope.emit(":ask", 'Try again');
  }

}




function birthCity() {

		var token = parseJwt(this.event.session.user.accessToken)
		var userCity = token.birthcity
		var uid = token.uid
    var name = token.firstname

		var city = this.event.request.intent.slots.CITY.value

		if(city.toUpperCase() == userCity.toUpperCase()){ 
			var alexaScope = this
			const makeRequest = async (function() {
  				var something = await (oktaUpdate(uid, "signin"))
  				alexaScope.emit(":tell", 'Ok logging you in now.  Have a great day ' + name + "!");
			});

			makeRequest()

		
			
	
		} else {
			this.emit(":ask", 'Try again.');
	

		}


	
    
}




