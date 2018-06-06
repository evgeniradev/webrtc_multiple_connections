const __            = window;
var rtcConnection  = require('./rtc_connection.js');
var notifier        = require('./notifier.js');

function allocate(data, send) {
  switch(data.type) {
    case 'login':
      login(data.success, data.isNameValid, data.doesUserExist);
      break;
    case 'validate':
      validate(
        data.name,
        data.doesUserExist,
        data.isUserLimitReached,
        data.isNameIdentical,
        data.isConnAlreadySet);
      break;
    case 'reply_permission':
      replyPermission(data.name);
      break;
    case 'new_connection':
      newConnection(data.name, data.reply);
      break;
    case 'offer':
      offer(data.offer, data.name);
      break;
    case 'answer':
      answer(data.answer, data.calleeName);
      break;
    case 'candidate':
      candidate(data.candidate);
      break;
    case 'leave':
      leave(data.disconnect_from_name);
      break;
    default:
      break;
   }

  function login(success, isNameValid, doesUserExist) {
    if (success === false) {
      if (doesUserExist)
        alert('Username has already been taken. Please, try again.');
      if (!isNameValid)
        alert('Username must be at least 3 characters long and can only contain letters, numbers and underscores.');
      return false;
    }

    validatedLoginName.innerHTML = __.myName;
    loginZone.classList.add('hidden');
    connectionsZone.classList.remove('hidden');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(function(localStream){
        __.localStream = localStream;
        localVideo.srcObject = localStream;
      })
      .catch(function(error){
        notifier.error('Error when logging in.', error);
      });
  };

  function validate(
    name,
    doesUserExist,
    isUserLimitReached,
    isNameIdentical,
    isConnAlreadySet) {
    if (!doesUserExist)
      alert('User ' + name + ' does not exist.');
    if (isUserLimitReached[0])
      alert('You have reached your user limit.');
    if (isUserLimitReached[1])
      alert( name + ' has reached their user limit.');
    if (isNameIdentical)
      alert('You cannot connect to yourself.');
    if (isConnAlreadySet)
      alert('You are already connected to ' + name + '.');
    if (doesUserExist &&
        !isUserLimitReached[0] &&
        !isUserLimitReached[1] &&
        !isNameIdentical &&
        !isConnAlreadySet) {
      __.otherName = name;
      alert('Connection request sent to ' + name + '.');
      (function askPermission() {
        send({
          type: 'ask_permission'
        });
      })();
    }
    __.otherName = null;
  }

  function replyPermission(name) {
    alert('New connection request.')
    __.otherName = name;
    send({
      type: 'reply_permission',
      reply: confirm(__.otherName + ' wants to connect. Accept?')
    });
  }

  function newConnection(name, reply) {
    if (!reply) return alert(name + ' is busy right now.');
    rtcConnection.newConn(name, send, leave);
    if (name.length == 0) return false
    __.otherName = name;
    __.lastNewConn.createOffer()
      .then(function (offer) {
        send({
          type: 'offer',
          offer: offer
        });
        __.lastNewConn.setLocalDescription(offer);
      })
      .catch(function (error) {
        notifier.error('Error when creating offer.', error);
      });
  }

  function offer(offer, name) {
    rtcConnection.newConn(name, send);
    __.otherName = name;
    __.lastNewConn.name = name;
    __.lastNewConn.setRemoteDescription(new RTCSessionDescription(offer));
    __.lastNewConn.createAnswer()
      .then(function (answer) {
        __.lastNewConn.setLocalDescription(answer);
        send({
          type: 'answer',
          answer: answer,
          calleeName: __.myName
        });
      })
      .catch(function (error) {
        notifier.error('Error when accepting offer.', error);
      });
  };

  function answer(answer, calleeName) {
    if (!__.lastNewConn) return false;
    __.lastNewConn.name = calleeName;
    __.lastNewConn.setRemoteDescription(new RTCSessionDescription(answer));
  }

  function candidate(candidate) {
    if (!__.lastNewConn) return false;
    __.lastNewConn.addIceCandidate(new RTCIceCandidate(candidate));
  }

  function leave(disconnect_from_name) {
    for (var i=0; i<__.users.length; i++) {
      var conn = __.users[i];
      if (disconnect_from_name == null)
        send({
          type: 'leave'
        });
      if (disconnect_from_name == null || conn.name === disconnect_from_name)
        rtcConnection.shutdownConn(conn, i);
    }
    rtcConnection.cleanClosedConns();
  }
}

module.exports = {
  allocate: allocate
};
