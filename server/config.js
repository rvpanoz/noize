const path = require('path');
const url = require('url');

const soundcloudUrl = url.parse('https://api.soundcloud.com');

module.exports = {
  client_id: 'caa597c828eaadfad140af3da084e904',
  protocol: soundcloudUrl.protocol,
  api: {
    tracks: path.join(soundcloudUrl.href, 'tracks')
  }
}
