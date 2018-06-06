const __      = window;
var notifier  = require('./notifier.js');
var conn      = null;

function setup(wsAddress, allocate) {
  conn = wsAddress;
  conn.onopen = function () {
     console.log('Connection to server established successfully.');
  }
  conn.onmessage = function (msg) {
    console.log('Got message.', msg.data);
    var data = JSON.parse(msg.data);
    allocate(data, send);
  }
  conn.onerror = function (error) {
     notifier.error('Server connection error.', error);
  }
  conn.onclose  = function (event) {
    notifier.error('Server shut down.', event);
  }
}

function send(data) {
  if (__.otherName) data.name = __.otherName;

  conn.send(JSON.stringify(data));
}

module.exports = {
  setup: setup,
  send: send
};
