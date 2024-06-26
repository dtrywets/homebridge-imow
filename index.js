const { API } = require('homebridge');
const MyPlatform = require('./platform');
const homebridge = require('homebridge');

module.exports = (api) => {
  api.registerPlatform('HomebridgeIMow', MyPlatform);
};
