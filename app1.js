/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
const Pubsub = require('@google-cloud/pubsub');
const topicName = 'MyPSIBuildStatus'
const subscriptionName = 'MyPSISubscription';
const pubsub = Pubsub({
    projectId: 'psipubsubproject'
});



// [START app]
const express = require('express');

const app = express();
var fs = require('fs');
var path = require('path')
app.use('/cssFiles', express.static(path.join(__dirname + '/public')));
app.use('/', express.static(path.join(__dirname)));
var servedMessage;
console.log("Hello")
console.log(__dirname);

var messageFromPubSub="";
global.buildId = "";
app.get('/' ,(req, res) =>{    
    fs.readFile('PSICDI.html', function (err, data) {
        res.writeHeader(200, { 'Content-Type': 'text/html' });
        res.write(data);       
    });
    

});

app.get('/failedreports', (req, res) => {
    
    subscribe((err, message) => {
        // Any errors received are considered fatal.
        if (err) {
            throw err;
        }
        fs.readFile('FailedResults.html', function (err, data) {
            res.writeHeader(200, { 'Content-Type': 'text/html' });
            res.write(data);
        });
        var messageFromPubSub = message;
        console.log("message from pubsub");
        console.log(messageFromPubSub);
        var resultArray = messageFromPubSub.split(";");        
        var buildId = resultArray[0];
        res.write("Build id:"+buildId)        
    });
});

function getBuildID() {
    var table = document.getElementById("BuildTable");
    return buildId;
}

function getTopic(cb) {
    pubsub.createTopic(topicName, (err, topic) => {
        // topic already exists.
        if (err && err.code === 409) {
            cb(null, pubsub.topic(topicName));
            return;
        }
        cb(err, topic);
    });
}
function subscribe (cb) {
  let subscription;

  // Event handlers
  function handleMessage(message) {
      console.log("got message");
      console.log(message);
    cb(null, message.data);
  }
  function handleError (err) {
    console.log(err);
  }

  getTopic((err, topic) => {
    if (err) {
      cb(err);
      return;
    }

    topic.subscribe(subscriptionName, {
      autoAck: true
    }, (err, sub) => {
      if (err) {
        cb(err);
        return;
      }

      subscription = sub;

      // Listen to and handle message and error events
      subscription.on('message', handleMessage);
      subscription.on('error', handleError);

      console.log(`Listening to ${topicName} with subscription ${subscriptionName}`);
    });
  });

  // Subscription cancellation function
  return () => {
    if (subscription) {
      // Remove event listeners
      subscription.removeListener('message', handleMessage);
      subscription.removeListener('error', handleError);
      subscription = undefined;
    }
  };
}



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
