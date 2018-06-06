var userLimit       = 3;
var minNameLength   = 3;

function doesUserExist(existing_connection, name) {
  var temp = existing_connection != null;
  console.log('Does user ' + name + ' exist?', temp);
  return temp;
}

function isUserLimitReached(connection) {
  if (!connection) return false;
  var temp = connection.otherUsernames.length > userLimit;
  console.log('Is ' + connection.name + ' user limit reached?', temp);
  return temp;
}

function isNameIdentical(connection, name) {
  var temp = connection.name === name
  console.log('Is user '+ name +'s name identical?', temp);
  return temp;
}

function isConnAlreadySet(connection, name) {
  var temp = connection.otherUsernames.indexOf(name) !== -1
  console.log('Is ' + name + ' connection already set up?', temp);
  return temp;
}

function isNameValid(name){
  if (name.length < minNameLength) {
    console.log('Username must be at least ' + minNameLength + ' characters.');
    return false;
  }
  if (/\W/.test(name)) {
    console.log('Username can only contain letters, numbers and underscores.');
    return false;
  }
  return true;
}

module.exports = {
  doesUserExist: doesUserExist,
  isUserLimitReached: isUserLimitReached,
  isNameIdentical: isNameIdentical,
  isConnAlreadySet: isConnAlreadySet,
  isNameValid: isNameValid
};
