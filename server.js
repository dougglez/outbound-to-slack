const express = require('express');
const slackInstance = require('slack-messenger');
const { SlackHook }= require('./config');
const slackMsg = new slackInstance(SlackHook);
const bodyP = require('body-parser');
const xmlP = require('express-xml-bodyparser');

const app = express();
app.use(bodyP.json());
app.use(bodyP.urlencoded({ extended: false }))
app.use(xmlP());

app.post('/api/salesforce/pto', (req,res,next) => {
  console.log('post');
//  console.log('req.body\n', req.body);
  console.log('\n\n$\n',req.body[ 'soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0]);
  console.log('\n\nxml stuff\n', req.body[ 'soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0]['sf:type_of_car_chosen__c']);
  let sfFields = req.body[ 'soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0],
      sfKeys = Object.keys(sfFields),
      message =  sfFields['sf:name'] ? 'Incoming From Salesforce by: ' + sfFields['sf:name'] : 'Incoming From Salesforce';
  for (let key in sfFields) {
    if(key != '$' && key != 'sf:id') {
	let subKey = key.substring(3);
	message += '\n' + subKey + ' = ' + sfFields[key];
    }
  }

console.log('\n\nmessage\n', message);

slackMsg.sendMessage(message);

  res.send(`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
<soapenv:Body>
<notificationsResponse xmlns="http://soap.sforce.com/2005/09/outbound">
<Ack>true</Ack>
</notificationsResponse>
</soapenv:Body>
</soapenv:Envelope>`)
});

app.listen(9001, console.log('Port running on 9001'));
