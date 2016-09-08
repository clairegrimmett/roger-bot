var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

var token = 'YOUR_TOKEN_HERE';

var rtm = new RtmClient(token, {logLevel: 'debug'});
rtm.start();

var peeOnThings = [{ triggerPhrase: 'hate', thingToPeeOnOffset: 1},
    { triggerPhrase: 'is the worst', thingToPeeOnOffset: -1},
    { triggerPhrase: 'are the worst', thingToPeeOnOffset: -1},
    { triggerPhrase: 'sucks', thingToPeeOnOffset: -1},
    { triggerPhrase: 'sucks', thingToPeeOnOffset: -1}];

var myNames = ['roger', 'roge', 'rog', 'rodge', 'rogie', 'rodgy', '@U1N978ZL1'];

var peeOn = function(rtm, message, triggerPhrase, thingToPeeOnOffset) {
    var words,
        triggerPhraseIndex;
    words = message.text.split(' ');
    triggerPhraseIndex = words.indexOf(triggerPhrase.split(' ')[0]);
    if (words[triggerPhraseIndex + thingToPeeOnOffset]) {
        rtm.sendMessage(':roger: _pees on ' + words[triggerPhraseIndex + thingToPeeOnOffset] +'_', message.channel);
    }
};

var isForMe = function(messageText) {
    var messageIsForMe = false;
    myNames.forEach(function(name){
        if (messageText.includes(name)) {
            messageIsForMe = true;
        }
    });
    return messageIsForMe;
};

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    var sendingUser,
        messageText;
    if (message.type === 'message' && message.text) {
        messageText = message.text.toLowerCase();

        if (isForMe(messageText)) {
            if (messageText.includes('shake')){
                rtm.sendMessage(':roger_shake:', message.channel);
            } else if (messageText.includes('sit')){
                rtm.sendMessage(':roger_sit:', message.channel);
            } else if (messageText.includes('hi') || messageText.includes('hello') || messageText.includes('hey')){
                rtm.sendMessage('RUFF :roger: ', message.channel);
            } else {
                rtm.sendMessage(':roger_sleeping:', message.channel);
            }

        } else {
            peeOnThings.forEach(function(item) {
                if (messageText.includes(item.triggerPhrase)) {
                    peeOn(rtm, message, item.triggerPhrase, item.thingToPeeOnOffset);
                }
            });
        }

        if (messageText.includes('grr')) {
            sendingUser = rtm.dataStore.getUserById(message.user);
            rtm.sendMessage(':rodger: _growls at '+ sendingUser.profile.first_name + '_', message.channel);
        }

    }

});

// you need to wait for the client to fully connect before you can send messages
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {

});
