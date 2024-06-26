const { Service, Characteristic } = require('homebridge');

class MyAccessory {
  constructor(log, mower) {
    this.log = log;
    this.mower = mower;

    this.service = new Service.Switch(this.mower.name);
    this.service.getCharacteristic(Characteristic.On)
      .on('set', this.setOn.bind(this))
      .on('get', this.getOn.bind(this));

    this.batteryService = new Service.BatteryService(this.mower.name);
    this.batteryService.getCharacteristic(Characteristic.BatteryLevel)
      .on('get', this.getBatteryLevel.bind(this));
    this.batteryService.getCharacteristic(Characteristic.ChargingState)
      .on('get', this.getChargingState.bind(this));
  }

  async setOn(value, callback) {
    try {
      if (value) {
        await this.mower.start();
      } else {
        await this.mower.stop();
      }
      callback();
    } catch (error) {
      callback(error);
    }
  }

  async getOn(callback) {
    try {
      const status = await this.mower.getStatus();
      callback(null, status.mainState === 6); // Assuming 6 indicates mowing
    } catch (error) {
      callback(error);
    }
  }

  async getBatteryLevel(callback) {
    try {
      const status = await this.mower.getStatus();
      callback(null, status.chargeLevel);
    } catch (error) {
      callback(error);
    }
  }

  async getChargingState(callback) {
    try {
      const status = await this.mower.getStatus();
      const isCharging = status.mainState === 1; // Assuming 1 indicates charging
      callback(null, isCharging ? 1 : 0); // 1 means charging, 0 means not charging
    } catch (error) {
      callback(error);
    }
  }

  getServices() {
    return [this.service, this.batteryService];
  }
}

module.exports = MyAccessory;

