function newVideoTag(connName) {
  var video = document.createElement('video');
  video.setAttribute('id', 'remoteVideo-' + connName);
  video.autoplay = true;
  remoteVideoStreams.appendChild(video);
  return video;
}

function videoTag(connName) {
  return document.querySelector('#remoteVideo-' + connName);
}

function removeVideoTag(conn) {
  var video = videoTag(conn.name);
  if (!video) return false;
  video.remove();
}

module.exports = {
  videoTag: videoTag,
  newVideoTag: newVideoTag,
  removeVideoTag: removeVideoTag
};
