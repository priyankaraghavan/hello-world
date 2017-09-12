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
const topicName1 = 'MyLatestPSIBuildStatus'
const subscriptionName = 'MyPSISubscription';
const subscriptionName1 = 'MyLatestPSISubscription';
const pubsub = Pubsub({
    projectId: 'psipubsubproject'
});



// [START app]
const express = require('express');
const template = require('template-js')
const app = express();
var fs = require('fs');
var path = require('path')
const showAnalytics = require('./showAnalytics.js');
app.use('/cssFiles', express.static(path.join(__dirname + '/public')));
app.use('/', express.static(path.join(__dirname)));
app.set('view engine', 'ejs');
var servedMessage;
console.log("Hello")
console.log(__dirname);
// List of all messages received by this instance
var messagesLatest="";
var messages30Days = "";
const latestBuildNameAndStatus = [];
var maxCheckinPSI="";
var maxCheckinPSV="";
var maxCheckinOC = "";


showAnalytics.subscribePSV((err, message) => {
    // Any errors received are considered fatal.
    if (err) {
        throw err;
    }
    maxCheckinPSV = message;
});
showAnalytics.subscribeOC((err, message) => {
    // Any errors received are considered fatal.
    if (err) {
        throw err;
    }
    maxCheckinOC = message;
});
showAnalytics.subscribePSI((err, message) => {
    // Any errors received are considered fatal.
    if (err) {
        throw err;
    }
    maxCheckinPSI = message;   
});
subscribeLatestBuild((err, message) => {
    // Any errors received are considered fatal.
    if (err) {
        throw err;
    }
    messagesLatest=message;   
});
subscribe((err, message) => {
    // Any errors received are considered fatal.
    if (err) {
        throw err;
    }
    messages30Days=message;    
});
app.get('/', (req, res) => {
    // var dictLatest = {};
    writeDefaultStylePage(res, "Latest build result");
    console.log("message latest length" + messagesLatest.length);
    var messageFromLatest = messagesLatest;
    var i = 0;
    var resultArray = messageFromLatest.split(";");
    console.log("lengthofsplit" + resultArray.length);
    writeTopHtml(res);
    writeResultsTable(res, resultArray);
    while (i < resultArray.length) {
        var buildName = null;
        var buildstatus = null;

        if ((i) < resultArray.length) {
            buildName = resultArray[i];
        }
        if ((i + 2) < resultArray.length) {
            buildstatus = resultArray[i + 2];
        }
        if (buildName) {
            latestBuildNameAndStatus[buildName] = buildstatus;
        }
        i = i + 9;
    }
    
    var lengthOfDict = Object.keys(latestBuildNameAndStatus).length
    if (lengthOfDict > 0) {
        console.log("dictionaryof build stats");
        console.log(latestBuildNameAndStatus);
        writeCIStatusCircles(res) ;
    }
    
    var imageLoc;
    
    res.write('</div>');
    res.write('</body>');
    res.write('</html>');

});

app.get('/failedreports', (req, res) => {
    //var dict = {};
    writeDefaultStylePage(res, "Results from last 30 days");
    var j = 0;
    console.log("message 30 days length" + messages30Days.length);

    var messageFrom30Days = messages30Days;
    var resultArray = messageFrom30Days.split(";");
    console.log("lengthofsplit" + resultArray.length);
    writeTopHtml(res);    
    writeResultsTable(res, resultArray);
    res.write('</div>');
    res.write('</body>');
    res.write('</html>');
});
app.get('/analytics', (req, res) => {

    //showAnalytics.writeStylePageAnalytics(res, "Analytics");
    var maxCheckinPSIArray = maxCheckinPSI.split(";");
    var maxCheckinOCArray = maxCheckinOC.split(";");
    var maxCheckinPSVArray = maxCheckinPSV.split(";");
   
    res.render('showAnalyticsViewExtended.ejs', {
        maxCheckinPSIArray: maxCheckinPSIArray,
        maxCheckinOCArray: maxCheckinOCArray,
        maxCheckinPSVArray: maxCheckinPSVArray,
    });
    
});
function writeResultsTable(res, resultArray)
{
    var i = 0;
    while (i < resultArray.length) {
        res.write('<tr>');
        if ((i) < resultArray.length) {
            res.write('<td>');

            res.write(resultArray[i]);
            res.write('</td>');
        }
        if ((i + 1) < resultArray.length) {
            res.write('<td>');
            res.write(resultArray[i + 1]);
            res.write('</td>');
        }
        if ((i + 2) < resultArray.length) {
            res.write('<td>');
            res.write(resultArray[i + 2]);
            res.write('</td>');
        }
        if ((i + 3) < resultArray.length) {
            res.write('<td>');
            res.write(resultArray[i + 3]);
            res.write('</td>');
        }
        if ((i + 4) < resultArray.length) {
            res.write('<td>');
            res.write(resultArray[i + 4]);
            res.write('</td>');
        }
        if ((i + 5) < resultArray.length) {
            res.write('<td>');
            res.write(resultArray[i + 5]);
            res.write('</td>');
        }
        if ((i + 6) < resultArray.length) {
            res.write('<td>');
            res.write(resultArray[i + 6]);
            res.write('</td>');
        }
        if ((i + 7) < resultArray.length) {
            res.write('<td>');
            res.write(resultArray[i + 7]);
            res.write('</td>');
        }
        //url
        if ((i + 8) < resultArray.length) {
            res.write('<td>');
            res.write('<a href=');
            res.write(resultArray[i + 8]);
            res.write('>More information</a>');
            res.write('</td>');
        }
        res.write('</tr>');
        i = i + 9;
    }
}

function writeTopHtml(res) {
    res.write('<html>');
    res.write('<head>');
    res.write('<meta charset="utf-8" />');
    res.write(' <meta http-equiv="X-UA-Compatible" content="IE=edge">');
    res.write(' <meta name="viewport" content="width=device-width, initial-scale=1">');
    res.write('<meta name="description" content="">');
    res.write('<meta name="author" content="">');
    res.write('<link rel="stylesheet" type="text/css" href="/cssFiles/bootstrap.min.css" />');
    res.write('<link rel="stylesheet" href="/cssFiles/dashboard.css"> ');
    res.write('</head>');
    res.write('<body>');
    res.write('<div class="table-responsive">');
}

function writeDefaultStylePage(res, title) {
    res.write('<html>');
    res.write('<head>');
    res.write('<meta charset="utf-8" />');
    res.write(' <meta http-equiv="X-UA-Compatible" content="IE=edge">');
    res.write(' <meta name="viewport" content="width=device-width, initial-scale=1">');
    res.write('<meta name="description" content="">');
    res.write('<meta name="author" content="">');
    res.write('<link rel="stylesheet" type="text/css" href="/cssFiles/bootstrap.min.css" />');
    res.write('<link rel="stylesheet" href="/cssFiles/dashboard.css"> ');


    res.write('</head>');
    res.write('<body>')
    res.write('<div class="container-fluid">');
    res.write('<div class="row">');
    res.write('<div class="col-sm-3 col-md-2 sidebar">');
    res.write('<ul class="nav nav-sidebar">');
    res.write('<li class="active"><a href="/">Overview <span class="sr-only">(current)</span></a></li>');
    res.write('<li><a href="/failedreports">Failed build reports </a></li>');
    res.write('<li><a href="/analytics">Analytics</a></li>');
    res.write('<li><a href="#">Export</a></li>');
    res.write('</ul>');
    res.write('</div>');
    res.write('</div>');
    res.write('</div>');
    res.write('<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">');
    res.write('<h1 class="page-header">Build Monitor</h1>');
    res.write('<h2 class="sub-header">');
    res.write(title);
    res.write('</h2>');
    res.write('<div class="table-responsive">');
    res.write('<table  name="BuildTable" id="BuildTable" class="table table-striped">');
    res.write(' <tr>');
    res.write('<th>Build Name</th>');
    res.write('<th>Build Number</th>');
    res.write('<th>Status</th>');
    res.write('<th>Compile Status</th>');
    res.write('<th>Test Status</th>');
    res.write('<th>Changeset</th>');
    res.write('<th>Requested by</th>');
    res.write('<th>Date</th>');
    res.write('<th>Build results URL</th>');
    res.write('</tr>');
}

function writeCIStatusCircles(res) {
    res.write('<div class="row placeholders">');
    for (var item in latestBuildNameAndStatus) {
       
        var buildstatus = latestBuildNameAndStatus[item];
        if (buildstatus) {
            res.write('<div class="col-xs-6 col-sm-3 placeholder">');
            res.write('<img src="');
            if (buildstatus == "Succeeded") {
                res.write('/cssFiles/pictures/Succeeded.ico');
            }
            if (buildstatus == "PartiallySucceeded") {
                res.write('/cssFiles/pictures/PartiallySucceeded.ico');
            }
            if (buildstatus == "Failed") {
                res.write('/cssFiles/pictures/Failed.ico');
            }
            res.write('" width="200" height="200" class="img-responsive" alt="Generic placeholder thumbnail">');
            res.write('<h4>');
            res.write(item);
            res.write('</h4>');
            res.write('</div>');
        }
       
    }
    res.write('</div>');
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
function getTopic1(cb) {
    pubsub.createTopic(topicName1, (err, topic) => {
        // topic already exists.
        if (err && err.code === 409) {
            cb(null, pubsub.topic(topicName1));
            return;
        }
        cb(err, topic);
    });
}
function subscribe(cb) {
    let subscription;

    // Event handlers
    function handleMessage(message) {
        console.log("got message");
        console.log(message);
        cb(null, message.data);
    }
    function handleError(err) {
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

function subscribeLatestBuild(cb) {
    let subscription;

    // Event handlers
    function handleMessage(message) {
        console.log("got message");
        console.log(message);
        cb(null, message.data);
    }
    function handleError(err) {
        console.log(err);
    }

    getTopic1((err, topic) => {
        if (err) {
            cb(err);
            return;
        }

        topic.subscribe(subscriptionName1, {
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

            console.log(`Listening to ${topicName1} with subscription ${subscriptionName1}`);
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
