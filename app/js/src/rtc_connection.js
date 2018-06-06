const __          = window;
var domManager    = require('./dom_manager.js');
var notifier      = require('./notifier.js');
// google stun server for testing purposes only
var connConfig    = {'iceServers': [{ urls: 'stun:stun2.1.google.com:19302' }]};

function newConn(name, send, leave) {
  var conn = new RTCPeerConnection(connConfig);
  __.users.push(conn);
  __.lastNewConn = conn;
  conn.addStream(__.localStream);
  var video = domManager.newVideoTag(name)
  conn.ontrack = function (event) {
    video.srcObject = event.streams[0];
  }
  conn.oniceconnectionstatechange = function(event) {
    if (conn.iceConnectionState === 'failed') {
      alert(conn.name + '\'s connection failed')
      leave(conn.name);
    }
  }
  conn.onicecandidate = function (event) {
    if (event.candidate) {
      send({
        type: 'candidate',
        candidate: event.candidate
      });
    }
  }
}

function shutdownConn(conn, index){
  conn.onicecandidate = null;
  conn.ontrack = null;
  domManager.removeVideoTag(conn);
  conn.close();
  // the value is set to null and cleaned with cleanClosedConnections() later
  // as the iteration in processLeave() is dependent on the array index
  __.users[index] = null;
}

function cleanClosedConns() {
  __.users = __.users.filter(function(conn){
    return conn !== null
  });
}

module.exports = {
  newConn: newConn,
  shutdownConn: shutdownConn,
  cleanClosedConns: cleanClosedConns
};
