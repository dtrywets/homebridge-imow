const axios = require('axios');
const API_URL = 'http://localhost:5000';

class IMowPlatform {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.token = null;

    this.log("Initializing the iMow platform...");
    console.log("IMowPlatform constructor called"); // Debugging-Ausgabe
    this.registerDevice();
  }

  async registerDevice() {
    console.log("Registering device..."); // Debugging-Ausgabe
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email: this.config.email,
        password: this.config.password
      });
      this.token = response.data.token;
      this.log(`Registered successfully. Token: ${this.token}`);
      console.log(`Registered successfully. Token: ${this.token}`); // Debugging-Ausgabe
      this.setupAccessory();
    } catch (error) {
      this.log(`Error during registration: ${error.message}`);
      console.error(`Error during registration: ${error.message}`); // Debugging-Ausgabe
    }
  }

  async setupAccessory() {
    try {
      const mowersResponse = await axios.get(`${API_URL}/mowers`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      const mowers = mowersResponse.data;
      mowers.forEach(mower => {
        const uuid = this.api.hap.uuid.generate('homebridge-imow-' + mower.id);
        const accessory = new this.api.platformAccessory(mower.name, uuid);
        accessory.context.mower = mower;
        accessory.addService(this.api.hap.Service.Switch, mower.name);

        this.api.registerPlatformAccessories('homebridge-imow', 'HomebridgeIMow', [accessory]);
        this.log(`${mower.name} accessory registered.`);
        console.log(`${mower.name} accessory registered.`); // Debugging-Ausgabe

        const service = accessory.getService(this.api.hap.Service.Switch);
        service.getCharacteristic(this.api.hap.Characteristic.On)
          .on('set', this.handleSetOn.bind(this, accessory))
          .on('get', this.handleGetOn.bind(this, accessory));
      });
    } catch (error) {
      this.log(`Error setting up accessory: ${error.message}`);
      console.error(`Error setting up accessory: ${error.message}`); // Debugging-Ausgabe
    }
  }

  handleSetOn(accessory, value, callback) {
    const action = value ? 'start' : 'dock';
    axios.post(`${API_URL}/mower/${accessory.context.mower.id}/action`, { action }, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    })
      .then(response => {
        this.log(`Mower action (${action}) executed:`, response.data);
        console.log(`Mower action (${action}) executed:`, response.data); // Debugging-Ausgabe
        callback(null, value);
      })
      .catch(error => {
        this.log(`Failed to execute mower action (${action}): ${error.message}`);
        console.error(`Failed to execute mower action (${action}): ${error.message}`); // Debugging-Ausgabe
        callback(error);
      });
  }

  handleGetOn(accessory, callback) {
    axios.get(`${API_URL}/mower/${accessory.context.mower.id}/status`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    })
      .then(response => {
        this.log(`Mower status:`, response.data);
        console.log(`Mower status:`, response.data); // Debugging-Ausgabe
        const isMowing = response.data.mainState === 5; // 5 indicates mowing
        callback(null, isMowing);
      })
      .catch(error => {
        this.log(`Error getting mower status: ${error.message}`);
        console.error(`Error getting mower status: ${error.message}`); // Debugging-Ausgabe
        callback(error);
      });
  }
}

module.exports = IMowPlatform;
