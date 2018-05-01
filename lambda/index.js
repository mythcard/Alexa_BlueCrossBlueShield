
'use strict';
const Alexa = require('alexa-sdk');
const request = require('request');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const welcomeMessage = 'Welcome to Bluecross Blueshield of Illinois, We offer individual, family and Medicare supplement plans for your health care needs.';
const SKILL_NAME    =      'Bluecross Blueshield of Illinios';
const HELP_MESSAGE  =    'We are here to care. Just say what you need!';
const HELP_REPROMPT =   'What can I help you with?';
const STOP_MESSAGE  =    'Goodbye!';

const welcomeMessages = [
    'welcome to blue cross blue shield. We can provide you services like getting co pay, finding my doctor, signing up for auto pay and getting fever help line. What do you want me to do?',
    'Hearty welcome. We are here to care .We can provide you services like getting co pay, finding your doctor, signing up for an auto pay or getting a fever help line. What do you want me to do?',
    'Hello there!. We can provide you services like getting co pay, finding my doctor, signing up for auto pay and getting fever help line. What do you want me to do?',
    'as blue cross blue shield, we pride ourselves offering our customer responsive, competant and excellent services. Today, I can help you getting to know your co pay, finding my doctor, signing up for auto pay or getting fever help line. What do you want me to do?'
    ];
    
const infomralStart = ['Hey','Sweet','Dear'];    



const handlers = {
    'LaunchRequest': function () {
        this.emit('getHi');
    },
     'getHi':function(){
    
        // sending the welcome message + asking user identity details (Phone number) (member id) (email id) (ssn)
        
        const index = Math.floor(Math.random() * welcomeMessages.length);
        const randomWelcomeMessage = welcomeMessages[index];
	    var message = randomWelcomeMessage;
	
	
	    if(!this.attributes.lookUp)
	    {
	
	        console.log("User id: "+ this.event.context.System.user.userId);
	        console.log("Device id: "+ this.event.context.System.device.deviceId);
	
	        this.attributes.fromIntent = "getHi";
	        this.attributes.toIntent = "identifyUser";
	
	        this.emit(this.attributes.toIntent);
	
    	}
	
	    else if (this.attributes.lookUp && this.attributes.fromIntent === "identifyUser" &&  this.attributes.toIntent === "getHi") 
	    {
	        console.log("Final frontier");
	        this.emit(':ask', message );
	    }
    },
    'captureName':function()
    {
        console.log("Name object1 ",this.context);
        console.log("Name object3 ",this.event.request.intent.slots.name.value);
        
        this.attributes.name = this.event.request.intent.slots.name.value;
	
	   this.attributes.fromIntent = "captureName";
	   this.attributes.toIntent = "identifyUser";
	
	   this.emit(this.attributes.toIntent);
        
    },
    'noPhone':function()
    {
        this.emit(':ask','May I know your name?');
    },
    'capturePhoneNo':function()
    {
       console.log("Phone number value: ", this.event.request.intent.slots);
        
       this.attributes.phNum        = this.event.request.intent.slots.phoneNumber.value;
	   this.attributes.fromIntent   = "capturePhoneNo";
	   this.attributes.toIntent     = "identifyUser";
	
	   this.emit(this.attributes.toIntent);
    },
    'identifyUser': function() 
    {
        console.log("I am actually at the bgining of identifyUser");
        
        
        if ((this.attributes.lookUp && this.attributes.lookUp.length == 0)  && this.attributes.fromIntent  === "processHttpPost" &&  this.attributes.toIntent === "identifyUser" ){
            
            this.attributes.fromIntent = 'identifyUser';
            this.attributes.toIntent = 'identifyUser';
            
            
            this.emit(':ask', welcomeMessage + ' Before we proceed, May I know your Phone Number?');
        }
         
         // make an http get call to obtain a patient object
         // an http get (to demo-api.vagmi.io/patients) is only necessary when identification is not confirmed for the current session
         // this is the only place for now where look up does not exist in
         if(!this.attributes.lookUp && this.attributes.fromIntent  !== "processHttpPost"){
             
            this.attributes.fromIntent = "identifyUser"; 
             // Set the headers
           // var header1 = {
           //     'BCBS-API-DEVICEID'         :     'deviceid1',
          //     'BCBS-API-DEVICE-USERID'    :     'device_userid1'
          //  }
            
            var header2 = {
                'BCBS-API-DEVICEID'         :     'deviceid2',
                'BCBS-API-DEVICE-USERID'    :     'device_userid1'
            }

            // Configure the request
            var options = {
                url: 'http://demo-api.vagmi.io/patients/lookup',
                method: 'POST',
                headers: header2
            }
            
            
	        this.attributes.toIntent = "processHttpPost";
         
            this.emit(this.attributes.toIntent, options);
         }
         
         if((this.attributes.lookUp && this.attributes.lookUp.length === 0)  && this.attributes.fromIntent  === "capturePhoneNo" &&  this.attributes.toIntent === "identifyUser"){
                 // Set the headers
                var header1 = {
                        'BCBS-API-DEVICEID'         :     'deviceid1',
                        'BCBS-API-DEVICE-USERID'    :     'device_userid1'
                }
                
                // Configure the request
                options = {
                    url: 'http://demo-api.vagmi.io/patients/lookup',
                    method: 'POST',
                    headers: header1,
                    qs : {
                        name : this.attributes.phNum
                    }
                }
                
                this.attributes.fromIntent = "capturePhoneNo";
                this.attributes.toIntent = "processHttpPost";
                
                console.log("Options at phnum: ",options);
         
                this.emit(this.attributes.toIntent, options);
            }
            
            
            //for phone capture identification
            if((this.attributes.lookUp && this.attributes.lookUp.length === 0)  && this.attributes.fromIntent  === "captureName" &&  this.attributes.toIntent === "identifyUser"){
                 // Set the headers
                var header1 = {
                        'BCBS-API-DEVICEID'         :     'deviceid1',
                        'BCBS-API-DEVICE-USERID'    :     'device_userid1'
                }
                
                // Configure the request
                options = {
                    url: 'http://demo-api.vagmi.io/patients/lookup',
                    method: 'POST',
                    headers: header1,
                    qs : {
                        name : this.attributes.name
                    }
                }
                
                this.attributes.fromIntent = "captureName";
                this.attributes.toIntent = "processHttpPost";
                
                console.log("Options: ",options);
         
                this.emit(this.attributes.toIntent, options);
            }
             
             
         
         
         // this is a hack to adjust the same header id in case of first time usage, needs to be changed when there are multiple ones for test
         // because device id and device user id  right now returns something whatso ever, to simulate null response I am following this startegy where 
         // two device ids are used one dummy and other that is present in the DB, similar mechanism shall be done for phone too
        if ((this.attributes.lookUp && this.attributes.lookUp.length !== 0)  && this.attributes.fromIntent  === "processHttpPost" &&  this.attributes.toIntent === "captureName" )
        {
            console.log("I am inside idetify user capture name section");
           
        
            //this.attributes.fromIntent = "identifyUser";
	        //this.attributes.toIntent = "getHi";
        
            console.log("I am at the end of identifyUser  capture name section");
            this.emit(':ask',"Hello "+this.attributes.name+", What can I do for you today?");
        }
        
        if ((this.attributes.lookUp && this.attributes.lookUp.length !== 0)  && this.attributes.fromIntent  === "processHttpPost" &&  this.attributes.toIntent === "capturePhoneNo" )
        {
            console.log("I am inside idetify user capture phnum section", this.attributes.lookUp.length );
        
            console.log("I am at the end of identifyUser  capture name section", this.attributes.lookUp);
            
            this.emit(':ask',"Hello there! What can I do for you today?");
        }
        
        // a handle is required when name look up returns null and you might have to gracefully terminate 
         
         
        
        // if identify user successful, trigger respective intent functions based on session attr
        if ((this.attributes.lookUp && this.attributes.lookUp.length !== 0)  && (this.attributes.fromIntent  === "getHi" || this.attributes.fromIntent  === "processHttpPost") &&  this.attributes.toIntent === "identifyUser" )
        {
            console.log("I am at the bgining of identifyUser");
           
        
            this.attributes.fromIntent = "identifyUser";
	        this.attributes.toIntent = "getHi";
        
            console.log("I am at the end of identifyUser");
            this.emit(this.attributes.toIntent);
        }
    },
    'processHttpGet': function (url) {    // for now this seems unnecessary, but I am sure I will come banging your doors baby
        
        request.get(url, (error, response, body) => {
            // let json = JSON.parse(body);
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the body
            
            //store the response in the session based on url
            if(url === "http://demo-api.vagmi.io/devices"){
                this.attributes.devices = response;
            }
            
            // attribute userIdentified should become yes when we obtain a object properly upon get
            this.attributes.userIdentified = "yes";
            
            const tempVariable          =   this.attributes.fromIntent;
            this.attributes.fromIntent  =   this.attributes.toIntent;
	        this.attributes.toIntent    =   tempVariable;
	    
	        this.emit(this.attributes.toIntent);
        });
    },
    'processHttpPut': function (options) {    // for now this seems unnecessary, but I am sure I will come banging your doors baby
        
        request.put(options, (error, response, body) => {
            // let json = JSON.parse(body);
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the body
            
            //store the response in the session based on url
            if(options.url === "http://demo-api.vagmi.io/patients/5abd277bf200095fcb9b1f54"){
                var body = JSON.parse(body);
                this.attributes.lookUp[0].auto_pay = body.auto_pay;
            }
            
            const tempVariable          =   this.attributes.fromIntent;
            this.attributes.fromIntent  =   this.attributes.toIntent;
	        this.attributes.toIntent    =   tempVariable;
	    
	        this.emit(this.attributes.toIntent);
        });
    },
    'processHttpPost': function (options) {
        
        console.log("In here inside request post");
        
        request.post(options, (error, response, body) => {
            // let json = JSON.parse(body);
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the body
            console.log('options:', options.url); // Print the body
            
            //store the response in the session based on url
            if(options.url === "http://demo-api.vagmi.io/patients/lookup"){
                this.attributes.lookUp = JSON.parse(body);
                console.log("The look up size: ",this.attributes.lookUp.length);
            }
            
            if(this.attributes.fromIntent === "captureName"){
                
                this.attributes.fromIntent    =   "processHttpPost";
                this.attributes.toIntent    =   "captureName";
                
                this.emit("identifyUser");
            }
            else if (this.attributes.fromIntent === "capturePhoneNo"){
                this.attributes.fromIntent    =   "processHttpPost";
                this.attributes.toIntent    =   "capturePhoneNo";
                
                this.emit("identifyUser");
            }
            else{
            
            const tempVariable          =   this.attributes.fromIntent;
            this.attributes.fromIntent  =   this.attributes.toIntent;
	        this.attributes.toIntent    =   tempVariable;
	    
	        this.emit(this.attributes.toIntent);
            }
        });
    },
    'getCoPay': function () {
        const index = Math.floor(Math.random() * infomralStart.length);
        const infomralStartPhrase = infomralStart[index];
        var speechOutput = infomralStartPhrase + " ";
        
        var name = this.attributes.lookUp[0].name;
        speechOutput += name + ", ";
        
        var copay = this.attributes.lookUp[0].plans[0].co_pay;  // for plans you need iteration to respective plan from plan id in the begining, or in other words the index is determined by the plan id
        speechOutput += " Your co pay is: $"+ copay + ". ";
        
        speechOutput += " Is there anything else, you want me to do today?"
        console.log("Plans: ", this.attributes.lookUp[0]);
        
        this.emit(':ask',speechOutput);
    },
    'autoSignForPay': function () {
        console.log("Let us see if I fail here");
        var autoPay = this.attributes.lookUp[0].auto_pay;
        
        var speechOutput = "";
        if(autoPay === true){
            speechOutput = "You are signed up, You are good to go...";
            this.response.cardRenderer(SKILL_NAME, speechOutput);
            this.response.speak(speechOutput);
            this.emit(':responseReady');
        }
        else{
             // Set the headers
                var header1 = {
                        'BCBS-API-DEVICEID'         :     'deviceid1',
                        'BCBS-API-DEVICE-USERID'    :     'device_userid1'
                }
                
                // Configure the request
                var options = {
                    url: 'http://demo-api.vagmi.io/patients/5abd277bf200095fcb9b1f54',
                    method: 'PUT',
                    headers: header1,
                    qs : {
                        'patient[auto_pay]' : true
                    }
                }
                
            this.attributes.fromIntent  =   'autoSignForPay';
	        this.attributes.toIntent    =   'processHttpPut';    
            this.emit(this.attributes.toIntent,options);    
            
        }
        
    },
    'findDoctor':function() {
        
        var message = "";
        
        var filledSlots = delegateSlotCollection.call(this);
        
        var specialistValue = this.event.request.intent.slots.specialist.value;
        
        if(specialistValue){
            this.event.request.dialogState = "COMPLETED";
        }
        
        console.log("Specialist value: ", specialistValue);
        console.log("Doctor slot value: ", this.event.request.intent.slots);
        
        message += "There are 3 results for the speciality, "+specialistValue+". A link for these results has been emailed to you.";
        
        this.emit(':tell',message);
    },
    'toothache':function() {
        
        var message = "";
        
        var filledSlots = delegateSlotCollection.call(this);
        
        var age = this.event.request.intent.slots.age.value;
        
        if(age < 4 && age > 0){
            this.event.request.dialogState = "COMPLETED";
            message = "Sorry to hear about the toothache. I am glad you are here. My best guess is that it is because of teething. I would recommend to give 1 teaspoon of Infant ibuprofen. I believe teething rings in these circumstances helps alleviate the pain. I know I don't have to tell you this, but seeing a dentist is best recommended. "
        }
        else if(age > 4 && age < 100){
            this.event.request.dialogState = "COMPLETED";
            message = "Sorry to hear about the toothache. I am glad you are here. I recommend a dosage of Paracetamol for pain relief. I know I don't have to tell you but seeing a doctor is best recommended. " 
        }        
        else{
            this.emit('AMAZON.StopIntent');
        }
        
        message += " Is there anything else I can do for you today?";

        
        this.emit(':ask',message);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function () {
        this.response.speak('Take care! ' + STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'Unhandled': function () { 
        console.log("===Unhandled Intent start"); 
        console.log("this.event = " + JSON.stringify(this.event));
        let speechOutput = "Sorry, I am having difficulty understanding your request. I can swiftly get you, your co pay, find you, your doctor, or sign you up for an auto pay. What do you want me to do?";
        this.emit(':ask', speechOutput, speechOutput);
        console.log("===Unhandled Intent end");
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};



/*========================================================================================
 2. Helper Function for getting the requiired fields for an intent 
(example for findMyDoctor, speciality is a necessary field)
========================================================================================*/

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
  
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}