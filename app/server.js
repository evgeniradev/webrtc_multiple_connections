var WebSocketServer   = require('ws').Server;
var ws                = new WebSocketServer({port: 9090});
var validators        = require('./js/src/validators.js');
var users             = {};
var user_limit        = 200;

ws.on('connection', function(connection) {
  console.log('New user connected');
  connection.on('message', function(message) {
    var data; ensureJSON(message);
    allocateRequest(data, connection);
    function ensureJSON(message) {
      try {
        data = JSON.parse(message);
      } catch (event) {
        console.log('Invalid JSON');
        data = {};
      }
    }
  });
  // when user closes browser, refreshes page, or navigates to a different page
  connection.on('close', function() {
    if (connection.name == null) return false;
    delete users[connection.name];
    leave(connection)
  });
});

function allocateRequest(data, connection) {
  var existing_connection = users[data.name];
  if (!existing_connection &&
    data.type !== 'login' &&
    data.type !== 'validate') return false
  switch (data.type) {
    case 'login':
      login(existing_connection, connection, data.name)
      break;
    case 'validate':
      validate(connection, existing_connection, data.name, data.type)
      break;
    case 'ask_permission':
      askPermission(existing_connection, connection)
      break;
    case 'reply_permission':
      replyPermission(existing_connection, connection, data.reply)
      break;
    case 'offer':
      offer(existing_connection, connection, data.offer, data.name)
      break;
    case 'answer':
      answer(existing_connection,
        connection,
        data.answer,
        data.name,
        data.calleeName)
      break;
    case 'candidate':
      candidate(existing_connection, data.candidate, data.name)
      break;
    case 'leave':
      leave(connection)
      break;
    default:
      console.log('Unknown data type', data.type)
      break;
  }
}

function sendTo(connection, message) {
  connection.send(JSON.stringify(message));
}

function validate(connection, existing_connection, name, type) {
  if (type !== 'validate') return false;
  sendTo(connection, {
    type: 'validate',
    doesUserExist: validators.doesUserExist(existing_connection, name),
    isUserLimitReached: [validators.isUserLimitReached(connection),
      validators.isUserLimitReached(existing_connection)],
    isNameIdentical: validators.isNameIdentical(connection, name),
    isConnAlreadySet: validators.isConnAlreadySet(connection, name),
    name: name
  });
}

function candidate(existing_connection, candidate, name) {
  console.log('Sending candidate:', name);
  sendTo(existing_connection, {
    type: 'candidate',
    candidate: candidate
  });
}

function replyPermission(existing_connection, connection, reply) {
  console.log('Permission granted?', reply);
  sendTo(existing_connection, {
    type: 'new_connection',
    reply: reply,
    name: connection.name
  });
}

function askPermission(existing_connection, connection) {
  console.log('Asking ' + existing_connection.name + ' for permission');
  sendTo(existing_connection, {
    type: 'reply_permission',
    name: connection.name
  });
}

function answer(existing_connection, connection, answer, name, calleeName) {
  console.log('Answering:', name);
  connection.otherUsernames.push(name);
  sendTo(existing_connection, {
    type: 'answer',
    answer: answer,
    calleeName: calleeName
  });
}

function offer(existing_connection, connection, offer, name) {
  console.log('Sending offer to:', name);
  connection.otherUsernames.push(name);
  sendTo(existing_connection, {
    type: 'offer',
    offer: offer,
    name: connection.name
  });
}

function login(existing_connection, connection, name) {
  var success;
  var doesUserExist = validators.doesUserExist(existing_connection, name)
  var isNameValid = validators.isNameValid(name)

  if(doesUserExist || !isNameValid) {
    success = false;
  }
  else {
    users[name] = connection;
    connection.name = name;
    connection.otherUsernames = [];
    success = true
  }
  console.log('User ' + name + ' added: ' + success);
  sendTo(connection,{
    type: 'login',
    success: success,
    doesUserExist: doesUserExist,
    isNameValid: isNameValid
  });
}

function leave(connection){
  if (connection.otherUsernames.length <= 0) return false;
  for(var i=0;i<connection.otherUsernames.length; i++) {
   var otherUsername = connection.otherUsernames[i];
   var conn = users[otherUsername];
   if (!conn) continue;
   var disconnect_from_index = conn.otherUsernames.indexOf(connection.name)
   if (disconnect_from_index === -1) continue;
   console.log('Asking ' + conn.name + ' to disconnect from ' + connection.name);
   conn.otherUsernames.splice(disconnect_from_index, 1);
    sendTo(conn, {
      type: 'leave',
      disconnect_from_name: connection.name
    });
  }
  connection.otherUsernames = [];
}
