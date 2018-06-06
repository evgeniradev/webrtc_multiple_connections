const __                = window;
__.users                = [];
__.myName               = null;
__.otherName            = null;
__.lastNewConn          = null;
__.localStream          = null;
var wsConnection        = require('./ws_connection.js');
var requestsManager     = require('./requests_manager.js');
var eventsManager       = require('./events_manager.js');

eventsManager.setup(wsConnection.send, requestsManager.allocate);
wsConnection.setup(new WebSocket('ws://localhost:9090'), requestsManager.allocate);
