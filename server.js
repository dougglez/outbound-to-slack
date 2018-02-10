const express = require('express');
const slackInstance = require('slack-messenger');
const { SlackHook }= require('./config');
const slackMsg = new slackInstance(SlackHook);

const app = express();

app.get('/api/salesforce/pto', (req,res,next) => {
  console.log('get');
  console.log('req', req);
  slackMsg.sendMessage('testing');
  res.sendStatus(200);
});

app.post('/api/salesforce/pto', (req,res,next) => {
  console.log('post');
  console.log('req', req);
  slackMsg.sendMessage('testing');
  res.sendStatus(200);
});

app.listen(9001, console.log('Port running on 9001'));