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
const topicName = 'MaxCheckinPSI';
const topicName1 = 'MaxCheckinPSV';
const topicName2 = 'MaxCheckinOC';
const subscriptionName = 'MaxCheckinPSISubscription';
const subscriptionName1 = 'MyPSVSubscription';
const subscriptionName2 = 'MyOCSubscription';
const pubsub = Pubsub({
    projectId: 'psipubsubproject'
});

function getTopicMaxCheckInPSI(cb) {
    pubsub.createTopic(topicName, (err, topic) => {
        // topic already exists.
        if (err && err.code === 409) {
            cb(null, pubsub.topic(topicName));
            return;
        }
        cb(err, topic);
    });
}
function getTopicMaxCheckInPSV(cb) {
    pubsub.createTopic(topicName1, (err, topic) => {
        // topic already exists.
        if (err && err.code === 409) {
            cb(null, pubsub.topic(topicName1));
            return;
        }
        cb(err, topic);
    });
}
function getTopicMaxCheckInOC (cb) {
    pubsub.createTopic(topicName2, (err, topic) => {
        // topic already exists.
        if (err && err.code === 409) {
            cb(null, pubsub.topic(topicName2));
            return;
        }
        cb(err, topic);
    });
}
exports.subscribePSI = function (cb) {
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

    getTopicMaxCheckInPSI((err, topic) => {
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
};

exports.subscribePSV = function (cb) {
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

    getTopicMaxCheckInPSV((err, topic) => {
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
};
exports.subscribeOC = function (cb) {
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

    getTopicMaxCheckInOC((err, topic) => {
        if (err) {
            cb(err);
            return;
        }

        topic.subscribe(subscriptionName2, {
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

            console.log(`Listening to ${topicName2} with subscription ${subscriptionName2}`);
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
};


exports.writeStylePageAnalytics= function (res, title) {
    res.write('<html>');
    res.write('<head>');
    res.write('<meta charset="utf-8" />');
    res.write(' <meta http-equiv="X-UA-Compatible" content="IE=edge">');
    res.write(' <meta name="viewport" content="width=device-width, initial-scale=1">');
    res.write('<meta name="description" content="">');
    res.write('<meta name="author" content="">');
    res.write('<link rel="stylesheet" type="text/css" href="/cssFiles/bootstrap.min.css" />');
    res.write('<link rel="stylesheet" href="/cssFiles/dashboard.css"> ');
    res.write('<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>');
    res.write('<script type="text/javascript">');
    res.write('google.charts.load(current, {packages: [corechart]})');
    res.write('google.charts.setOnLoadCallback(drawBarChart)');
    res.write('</script>');

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
    res.write(' <div id="chart_div" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main"></div>');
};

// [END app]
