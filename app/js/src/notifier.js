function error(message, error) {
  alert(message);
  console.log(message, error);
}

module.exports = {
  error: error
};
