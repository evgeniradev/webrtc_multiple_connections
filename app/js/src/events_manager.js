const __ = window;

function setup(send, allocate) {
  disconnectBtn.addEventListener('click', function () {
    allocate({type: 'leave'}, send);
  });

  connectBtn.addEventListener('click', function () {
    var calleeName = otherNameInput.value;
    __.otherName = calleeName;
    send({
      type: 'validate'
    });
  });

  loginBtn.addEventListener('click', function (event) {
    __.myName = loginNameInput.value;
    send({
      type: 'login',
      name: __.myName
    });
  });
}

module.exports = {
  setup: setup
};
