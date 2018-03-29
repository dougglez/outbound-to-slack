const express = require('express');
const slackInstance = require('slack-messenger');
const bodyP = require('body-parser');
const xmlP = require('express-xml-bodyparser');

const sfResponse = require("./sfResponse");
const { SlackHook }= require('./config');
const slackMsg = new slackInstance(SlackHook);

const app = express();
app.use(bodyP.json());
app.use(bodyP.urlencoded({ extended: false }));
app.use(xmlP());

app.post('/api/salesforce/pto', (req,res,next) => {
  let sfFields = req.body[ 'soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0],
    //sfKeys = Object.keys(sfFields),
    message =  sfFields['sf:name'] ? 'Incoming From Salesforce by: ' + sfFields['sf:name'] : 'Incoming From Salesforce';
  for (let key in sfFields) {
    if(key != '$' && key != 'sf:id') {
	    let subKey = key.substring(3);
	    message += '\n' + subKey + ' = ' + sfFields[key];
    }
  }
  slackMsg.sendMessage(message);
  res.send(sfResponse)
});

app.post('/api/slack', (req, res, next) => {
  console.log(req.body);
  slackMsg.sendMessage('Message from salesforce');
});

app.listen(9001, console.log('Port running on 9001'));
