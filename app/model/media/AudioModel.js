SDL.AudioModel = Em.Object.extend({

    bluetoothModel: null,
    cdModel: null,
    lineInModel: null,
    usbModel: null,
    ipodModel: null,

    init: function() {
        this.createDefaultData();
        this.createEqualizerSettings();
        this.set('bluetoothModel', SDL.BluetoothModel.create());
        this.set('cdModel', SDL.CDModel.create());
        this.set('lineInModel', SDL.LineInModel.create());
        this.set('usbModel', SDL.USBModel.create());
        this.set('ipodModel', SDL.IPodModel.create());
        this.set('currentSelectedPlayer', this.cdModel.player);          
    },

    createEqualizerSettings: function() {
        this.tempEqualizerSettIndex = 1;
        this.tempEqualizerSettings.channelName = this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex - 1].channelName;
        this.tempEqualizerSettings.channelId = parseInt(this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex - 1].channelId);
        this.tempEqualizerSettings.channelSetting = parseInt(this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex - 1].channelSetting);
        for (var i = 4; i <= 10; i++) {
            temp = {};
            temp.channelId = parseInt(i);
            temp.channelSetting = parseInt(i);
            temp.channelName = 'Name' + ' ' + i.toString();
            this.lastRadioControlStruct.equalizerSettings.push(temp);
            this.radioControlStruct.equalizerSettings.push(temp);
        }  
    },

    createDefaultData: function() {
        this.set('radioControlStruct',{
            source: 'CD',
            equalizerSettings: [{
              channelSetting: 50,
              channelId: 1,
              channelName: 'Treble'
            },
            {
              channelSetting: 50,
              channelId: 2,
              channelName: 'Midrange'
            }, {
              channelSetting: 50,
              channelId: 3,
              channelName: 'Bass'
            }],
          }
        );
        this.set('lastRadioControlStruct', {
            source: 'CD',
            equalizerSettings: [{
              channelSetting: 50,
              channelId: 1,
              channelName: 'Treble'
            },
            {
              channelSetting: 50,
              channelId: 2,
              channelName: 'Midrange'
            }, {
              channelSetting: 50,
              channelId: 3,
              channelName: 'Bass'
            }],
          }
        );
        this.set('radioControlAudioValue', {
            keepContext: true,
            volume: true,
            equalizerSettings: true,
            channelName: true
    
          }
        );
        this.set('activeState', 'media.player.cd');
        this.set('keepContext', false);
        this.set('tempSource', 'CD');
        this.set('currentVolume', 50);
        this.set('tempEqualizerSettings', {});
        this.set('tempEqualizerSettIndex', 3);        
        this.set('usbControl', {keepContext: false});
        this.set('boolStruct', [true, false]);
    },

    saveButtonPress: function () {

      var equalizerSettings = [];
      this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex - 1].channelId =
        parseInt(this.tempEqualizerSettings.channelId);
      this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex - 1].channelSetting =
        parseInt(this.tempEqualizerSettings.channelSetting);
      this.lastRadioControlStruct.equalizerSettings[this.tempEqualizerSettIndex - 1].channelName =
        this.tempEqualizerSettings.channelName;

      var lengthLast = this.lastRadioControlStruct.equalizerSettings.length;
      for (var i; i < lengthLast; i++) {
        this.lastRadioControlStruct.equalizerSettings[i].channelId =
          parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelId);
        this.lastRadioControlStruct.equalizerSettings[i].channelSetting =
          parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelSetting);
      }
      var lengthCurrent = this.radioControlStruct.equalizerSettings.length;
      if (lengthLast > lengthCurrent) {
        if (lengthLast != lengthCurrent) {
          for (var i = lengthCurrent; i < lengthLast; i++) {
            equalizerSettings.push(this.lastRadioControlStruct.equalizerSettings[i]);
          }
        }
        for (var i = 0; i < lengthCurrent; ++i) {
          if (this.lastRadioControlStruct.equalizerSettings[i].channelId !=
            this.radioControlStruct.equalizerSettings[i].channelId ||
            this.lastRadioControlStruct.equalizerSettings[i].channelSetting !=
            this.radioControlStruct.equalizerSettings[i].channelSetting) {
            temp = {};
            temp.channelId =
              parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelId);
            temp.channelSetting =
              parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelSetting);
            if (this.lastRadioControlStruct.equalizerSettings[i].channelName !=
              this.radioControlStruct.equalizerSettings[i].channelName) {
              temp.channelName =
                this.lastRadioControlStruct.equalizerSettings[i].channelName;
            }
            equalizerSettings.push(temp);
            continue;
          }
          if (this.lastRadioControlStruct.equalizerSettings[i].channelName !=
            this.radioControlStruct.equalizerSettings[i].channelName) {
            equalizerSettings.push(this.lastRadioControlStruct.equalizerSettings[i]);
          }
        }
      }
      else {
        for (var i = 0; i < lengthLast; ++i) {
          if (this.lastRadioControlStruct.equalizerSettings[i].channelId !=
            this.radioControlStruct.equalizerSettings[i].channelId ||
            this.lastRadioControlStruct.equalizerSettings[i].channelSetting !=
            this.radioControlStruct.equalizerSettings[i].channelSetting) {
            temp = {};
            temp.channelId =
              parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelId);
            temp.channelSetting =
              parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelSetting);
            if (this.lastRadioControlStruct.equalizerSettings[i].channelName !=
              this.radioControlStruct.equalizerSettings[i].channelName) {
              temp.channelName =
                this.lastRadioControlStruct.equalizerSettings[i].channelName;
            }
            equalizerSettings.push(temp);
            continue;
          }
          if (this.lastRadioControlStruct.equalizerSettings[i].channelName !=
            this.radioControlStruct.equalizerSettings[i].channelName) {
            equalizerSettings.push(this.lastRadioControlStruct.equalizerSettings[i]);
          }
        }
      }
      SDL.RCModulesController.currentAudioModel.toggleProperty('optionsEnabled');
      if (equalizerSettings.length) {
        var size = equalizerSettings.length;
        for (var i = 0; i < size; i++) {
          equalizerSettings[i].channelId = parseInt(equalizerSettings[i].channelId);
          equalizerSettings[i].channelSetting =
            parseInt(equalizerSettings[i].channelSetting);
        }
        FFW.RC.onInteriorVehicleDataNotification({ moduleType: 'AUDIO', audioControlData: { equalizerSettings: equalizerSettings } });
        this.setLastData();
      }
    },
    setLastData: function () {
      this.radioControlStruct = SDL.deepCopy(this.lastRadioControlStruct);
    },
    getCurrentData: function () {
      var result = {
        'source': this.lastRadioControlStruct.source,
        'equalizerSettings': {
          'channelSetting': this.lastRadioControlStruct.equalizerSettings.channelSetting,
          'channelId': this.lastRadioControlStruct.equalizerSettings.channelId,
          'channelName': this.lastRadioControlStruct.equalizerSettings.channelName
        },

      };
      return result;
    },


    optionsEnabled: false,
    toggleOptions: function () {
      SDL.RCModulesController.currentAudioModel.toggleProperty('optionsEnabled');
    },
    /**
     * Turn on CD
     */
    returnParameters:function()
    {
      this.set('state', true);
      this.set('tempSource','');
    },
    turnOnCD: function () {
      if (!SDL.States.media.player.cd.active) {
        this.deactivateAll();
        SDL.States.goToStates('media.player.cd');
      }
      this.onPlayerEnter(SDL.RCModulesController.currentAudioModel.cdModel, 'cd');
     this.returnParameters();
    },
    /**
     * Turn on USB
     */
    turnOnUSB: function () {
      if (!SDL.States.media.player.usb.active) {
        this.deactivateAll();
        SDL.States.goToStates('media.player.usb');
      }
      this.onPlayerEnter(SDL.RCModulesController.currentAudioModel.usbModel, 'usb');
      this.returnParameters();
    },
    /**
     * Turn on Radio
     */
    turnOnRadio: function () {
      if (!SDL.States.media.player.radio.active) {
        this.deactivateAll();
        SDL.States.goToStates('media.player.radio');
      }
      SDL.RCModulesController.currentRadioModel.saveCurrentOptions();
      SDL.RCModulesController.currentRadioModel.set('active', true);
      this.returnParameters();
    },
    turnOnBluetooth: function () {
      if (!SDL.States.media.player.bluetooth.active) {
        this.deactivateAll();
        SDL.States.goToStates('media.player.bluetooth');
      }
      this.onPlayerEnter(SDL.RCModulesController.currentAudioModel.bluetoothModel, 'bluetooth');
      this.returnParameters();
    },

    turnOnLineIn: function () {
      if (!SDL.States.media.player.lineIn.active) {
        this.deactivateAll();
        SDL.States.goToStates('media.player.lineIn');
      }
      this.onPlayerEnter(SDL.RCModulesController.currentAudioModel.lineInModel, 'lineIn');
      this.returnParameters();
    },

    turnOnIPod: function () {
      if (!SDL.States.media.player.ipod.active) {
        this.deactivateAll();
        SDL.States.goToStates('media.player.ipod');
      }
      this.onPlayerEnter(SDL.RCModulesController.currentAudioModel.ipodModel, 'ipod');
      this.returnParameters();
    },
    /**
     * Switching on Application
     */
    turnOnSDL: function () {
      SDL.RCModulesController.currentAudioModel.cdModel.set('active', false);
      this.set('state', true);
      this.set('tempSource','');
      /**
       * Set SDL Data active, flag for status bar
       */
      if (SDL.SDLController.model) {
        SDL.SDLController.model.set('active', true);
      }
      /**
       * Go to SDL state
       */
      if (SDL.SDLController.model.appType) {
        for (var i = 0; i < SDL.SDLController.model.appType.length; i++) {
          if (SDL.SDLController.model.appType[i] == 'NAVIGATION' ||
              SDL.SDLController.model.appType[i] == 'PROJECTION') {
            SDL.BaseNavigationView.update();
            SDL.States.goToStates('navigationApp.baseNavigation');
            return;
          }
        }
      }

      SDL.States.goToStates('media.sdlmedia');
    },
    /**
     * Volume level up
     */
    volumeUpPress: function () {
      if (this.currentVolume < 100) {
        this.set('currentVolume', this.currentVolume + 1);
        if (this.radioControlAudioValue.volume) {
          FFW.RC.onInteriorVehicleDataNotification({ moduleType: 'AUDIO', audioControlData: { 'volume': this.currentVolume } });
        }
      }
    },
    /**
     * Volume level down
     */
    volumeDownPress: function () {
      if (this.currentVolume > 0) {
        this.set('currentVolume', this.currentVolume - 1);
        if (this.radioControlAudioValue.volume) {
          FFW.RC.onInteriorVehicleDataNotification({ moduleType: 'AUDIO', audioControlData: { 'volume': this.currentVolume } });
        }
      }
    },
    /**
     * Switching off CD
     */
    deactivateCD: function () {
      SDL.RCModulesController.currentAudioModel.cdModel.set('active', false);
      SDL.States.set('media.player.radio.active', false);
      SDL.States.set('media.player.usb.active', false);
      SDL.States.set('media.player.bluetooth.active', false);
      SDL.States.set('media.player.lineIn.active', false);
      SDL.States.set('media.player.ipod.active', false);
    },
    /**
     * Switching off USB
     */
    deactivateUSB: function () {
      SDL.RCModulesController.currentAudioModel.usbModel.set('active', false);
      SDL.States.set('media.player.radio.active', false);
      SDL.States.set('media.player.cd.active', false);
      SDL.States.set('media.player.usb.active', false);
      SDL.States.set('media.player.lineIn.active', false);
      SDL.States.set('media.player.ipod.active', false);
    },
    /**
     * Switching off Radio
     */
    deactivateRadio: function () {
      SDL.RCModulesController.currentRadioModel.set('active', false);
      SDL.States.set('media.player.cd.active', false);
      SDL.States.set('media.player.usb.active', false);
      SDL.States.set('media.player.bluetooth.active', false);
      SDL.States.set('media.player.lineIn.active', false);
      SDL.States.set('media.player.ipod.active', false);
    },

    deactivateBluetooth: function () {
      SDL.RCModulesController.currentAudioModel.bluetoothModel.set('active', false);
      SDL.States.set('media.player.radio.active', false);
      SDL.States.set('media.player.usb.active', false);
      SDL.States.set('media.player.cd.active', false);
      SDL.States.set('media.player.lineIn.active', false);
      SDL.States.set('media.player.ipod.active', false);
    },
    deactivateLineIn: function () {
      SDL.RCModulesController.currentAudioModel.lineInModel.set('active', false);
      SDL.States.set('media.player.radio.active', false);
      SDL.States.set('media.player.usb.active', false);
      SDL.States.set('media.player.bluetooth.active', false);
      SDL.States.set('media.player.cd.active', false);
      SDL.States.set('media.player.ipod.active', false);
    },
    deactivateIPod: function () {
      SDL.RCModulesController.currentAudioModel.ipodModel.set('active', false);
      SDL.States.set('media.player.radio.active', false);
      SDL.States.set('media.player.usb.active', false);
      SDL.States.set('media.player.bluetooth.active', false);
      SDL.States.set('media.player.lineIn.active', false);
      SDL.States.set('media.player.cd.active', false);
    },
    deactivateAll:function(){
      SDL.States.set('media.player.cd.active', false);
      SDL.States.set('media.player.usb.active', false);
      SDL.States.set('media.player.radio.active', false);
      SDL.States.set('media.player.lineIn.active', false);
      SDL.States.set('media.player.ipod.active', false);
      SDL.States.set('media.player.bluetooth.active', false);
    },
    /**  On player module enter event */
    onPlayerEnter: function (data, state) {
      if (this.currentSelectedPlayer) {
        this.currentSelectedPlayer.pause();
      }
      data.set('active', true);
      this.set('currentSelectedPlayer', data.player);
      if (state) {
        SDL.States.goToState('media.player.' + state);
      }
    },
    /**
     * Player Prev track event
     */
    prevTrack: function () {
      this.currentSelectedPlayer.prevTrackPress();
    },
    /**
     * Player Play track event
     */
    playTrack: function () {
      this.currentSelectedPlayer.playTrackPress();
    },
    /**
     * Player Next track event
     */
    nextTrack: function () {
      this.currentSelectedPlayer.nextTrackPress();
    },
    /**
     * Turn on shuffle help video event
     */
    turnOnShuffle: function () {
      this.currentSelectedPlayer.shufflePress();
    },
    /**
     * Repeat mode pressed
     */
    repeatPress: function () {
      this.currentSelectedPlayer.repeatPress();
    },
    /**
     * Eject/insert CD
     */
    ejectCD: function () {
      this.currentSelectedPlayer.ejectPress();
    },
    /**
     * Change media audio source
     */
    changeSource: function () {
      var is_background =
        SDL.States.currentState.get('path').indexOf('media.') < 0;

      switch (SDL.RCModulesController.currentAudioModel.activeState) {
        case 'media.player.radio': {
          this.changeSourceFromRadio(is_background);
          break;
        }
        case 'media.player.cd': {
          this.changeSourceFromCD(is_background);
          break;
        }
        case 'media.player.usb': {
          this.changeSourceFromUSB(is_background);
          break;
        }
        case 'media.player.bluetooth': {
          this.changeSourceFromBluetooth(is_background);
          break;
        }
        case 'media.player.lieIn': {
          this.changeSourceFromLineIn(is_background);
          break;
        }
        case 'media.player.ipod': {
          this.changeSourceFromIpod(is_background);
          break;
        }
        default: {
          this.changeSourceFromUnknown(is_background);
        }
      }
    },
    /**
     * Switches to next after radio source
     * @param is source switched from background or not
     */
    changeSourceFromRadio: function (is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.deactivateRadio();
      this.turnOnCD();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    /**
     * Switches to next after CD source
     * @param is source switched from background or not
     */
    changeSourceFromCD: function (is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.deactivateCD();
      this.turnOnUSB();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    /**
     * Switches to next after USB source
     * @param is source switched from background or not
     */
    changeSourceFromUSB: function (is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.deactivateUSB();
      if (SDL.SDLMediaController.currentAppId != null && !is_background) {
        SDL.SDLMediaController.activateCurrentApp();
      } else {
        this.turnOnRadio();
      }
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    changeSourceFromBluetooth: function (is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.deactivateBluetooth();
      this.turnOnLineIn();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    changeSourceFromLineIn: function (is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.deactivateLineIn();
      this.turnOnIpod();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    changeSourceFromIpod: function (is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.deactivateIpod();
      this.turnOnIpod();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },
    /**
     * Switches to next after unknown source
     * @param is source switched from background or not
     */
    changeSourceFromUnknown: function (is_background) {
      var old_state = SDL.States.currentState.get('path');
      this.turnOnRadio();
      if (is_background) {
        SDL.States.goToStates(old_state);
      }
    },

    getAudioControlData: function () {
      var size = this.lastRadioControlStruct.equalizerSettings.length;
      for (var i = 0; i < size; i++) {
        this.lastRadioControlStruct.equalizerSettings[i].channelId =
          parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelId);
        this.lastRadioControlStruct.equalizerSettings[i].channelSetting =
          parseInt(this.lastRadioControlStruct.equalizerSettings[i].channelSetting);
      }
      result = SDL.deepCopy(this.lastRadioControlStruct);
      result.volume = this.currentVolume;
      return result;
    },
    getResultWithKeepContext: function () {
      equalizerSettings: [];
      equalizerSettings = SDL.deepCopy(this.lastRadioControlStruct.equalizerSettings);
      result = { equalizerSettings };
      result.source = SDL.deepCopy(this.tempSource);
      var size = result.equalizerSettings.length;
      for (var i = 0; i < size; i++) {
        result.equalizerSettings[i].channelId =
          parseInt(result.equalizerSettings[i].channelId);
        result.equalizerSettings[i].channelSetting =
          parseInt(result.equalizerSettings[i].channelSetting);

      }
      return result;

    },
    switchSource: function (source) {
      switch (source) {
        case 'AM':
        case 'XM':
        case 'FM': this.turnOnRadio(); break;
        case 'BLUETOOTH_STEREO_BTST': this.turnOnBluetooth(); break;
        case 'CD': this.turnOnCD(); break;
        case 'USB': this.turnOnUSB(); break;
        case 'LINE_IN': this.turnOnLineIn(); break;
        case 'IPOD': this.turnOnIPod(); break;
        case 'MOBILE_APP': SDL.SDLMediaController.activateCurrentApp(); break;
      }
    },
    state: true,
    setFalseStateModel: function () {
      SDL.SDLModel.set('data.limitedExist', false);
      SDL.RCModulesController.currentRadioModel.set('active', false);
      SDL.RCModulesController.currentAudioModel.cdModel.set('active', false);
      SDL.RCModulesController.currentAudioModel.usbModel.set('active', false);
      SDL.RCModulesController.currentAudioModel.ipodModel.set('active', false);
      SDL.RCModulesController.currentRadioModel.set('active', false);
      SDL.RCModulesController.currentAudioModel.bluetoothModel.set('active', false);
      SDL.RCModulesController.currentAudioModel.lineInModel.set('active', false);
    },
    tempSource: '',
    setAudioControlDataWithKeepContext: function (data) {
      result = {};
      if (data.keepContext) {
        if (data.source != null) {
          result.source = data.source;
          if (SDL.States.media.sdlmedia.active) {
            if (this.state) {
              this.set('state', false);
              SDL.SDLController.onEventChanged('player', true);
            }
            switch (data.source) {
              case 'AM':
              case 'XM':
              case 'FM': SDL.States.set('media.player.radio.active', true);
                SDL.States.set('media.player.cd.active', false);
                SDL.States.set('media.player.usb.active', false);
                SDL.States.set('media.player.bluetooth.active', false);
                SDL.States.set('media.player.lineIn.active', false);
                SDL.States.set('media.player.ipod.active', false);
                break;
              case 'BLUETOOTH_STEREO_BTST': SDL.States.set('media.player.bluetooth.active', true);
                SDL.States.set('media.player.cd.active', false);
                SDL.States.set('media.player.usb.active', false);
                SDL.States.set('media.player.radio.active', false);
                SDL.States.set('media.player.lineIn.active', false);
                SDL.States.set('media.player.ipod.active', false);
                break;
              case 'CD': SDL.States.set('media.player.cd.active', true);
                SDL.States.set('media.player.radio.active', false);
                SDL.States.set('media.player.usb.active', false);
                SDL.States.set('media.player.bluetooth.active', false);
                SDL.States.set('media.player.lineIn.active', false);
                SDL.States.set('media.player.ipod.active', false);
                break;
              case 'USB': SDL.States.set('media.player.usb.active', true);
                SDL.States.set('media.player.cd.active', false);
                SDL.States.set('media.player.radio.active', false);
                SDL.States.set('media.player.bluetooth.active', false);
                SDL.States.set('media.player.lineIn.active', false);
                SDL.States.set('media.player.ipod.active', false);
                break;
              case 'LINE_IN': SDL.States.set('media.player.lineIn.active', true);
                SDL.States.set('media.player.cd.active', false);
                SDL.States.set('media.player.usb.active', false);
                SDL.States.set('media.player.bluetooth.active', false);
                SDL.States.set('media.player.radio.active', false);
                SDL.States.set('media.player.ipod.active', false);
                break;
              case 'IPOD': SDL.States.set('media.player.ipod.active', true);
                SDL.States.set('media.player.cd.active', false);
                SDL.States.set('media.player.usb.active', false);
                SDL.States.set('media.player.bluetooth.active', false);
                SDL.States.set('media.player.lineIn.active', false);
                SDL.States.set('media.player.radio.active', false);
                break;
              case 'MOBILE_APP':
                SDL.States.set('media.player.cd.active', false);
                SDL.States.set('media.player.usb.active', false);
                SDL.States.set('media.player.bluetooth.active', false);
                SDL.States.set('media.player.lineIn.active', false);
                SDL.States.set('media.player.radio.active', false);
                SDL.States.set('media.player.ipod.active', false);
                SDL.States.goToStates('media.sdlmedia'); this.set('state', true);
                SDL.SDLController.onEventChanged('player', false);
                break;
            }
          } else {
            var value = (this.lastRadioControlStruct.source == 'MOBILE_APP') ?
              this.lastRadioControlStruct.source :
              this.tempSource;
            if (value != 'MOBILE_APP') {
              return this.setAudioControlData(data, true);
            } else {
              this.set('lastRadioControlStruct.source', data.source);

              if (this.state) {
                this.set('tempSource', 'MOBILE_APP');
                this.set('state', false);
                SDL.SDLController.onEventChanged('player', true);
              }
              switch (data.source) {
                case 'AM':
                case 'XM':
                case 'FM':
                  this.setFalseStateModel();
                  SDL.RCModulesController.currentRadioModel.set('active', true);
                  this.set('activeState', 'media.player.radio');
                  break;
                case 'USB':
                  this.setFalseStateModel();
                  SDL.RCModulesController.currentAudioModel.usbModel.set('active', true);
                  this.set('activeState', 'media.player.usb');
                  break;
                case 'CD':
                  this.setFalseStateModel();
                  SDL.RCModulesController.currentAudioModel.cdModel.set('active', true);
                  this.set('activeState', 'media.player.cd');
                  break;
                case 'BLUETOOTH_STEREO_BTST':
                  this.setFalseStateModel();
                  SDL.RCModulesController.currentAudioModel.bluetoothModel.set('active', true);
                  this.set('activeState', 'media.player.bluetooth');
                  break;
                case 'LINE_IN':
                  this.setFalseStateModel();
                  SDL.RCModulesController.currentAudioModel.lineInModel.set('active', true);
                  this.set('activeState', 'media.player.lineIn');
                  break;
                case 'IPOD':
                  this.setFalseStateModel();
                  SDL.RCModulesController.currentAudioModel.ipodModel.set('active', true);
                  this.set('activeState', 'media.player.ipod');
                  break;
                case 'MOBILE_APP':
                  this.setFalseStateModel();
                  SDL.SDLModel.set('data.limitedExist', true);
                  this.set('activeState', 'media.sdlmedia'); this.set('state', true);
                  SDL.SDLController.onEventChanged('player', false);
                  this.set('tempSource', '');
                  break;
              }
            }
          }
        }
      } else { return this.setAudioControlData(data. true); }

      SDL.RCModulesController.currentRadioModel.checkoutRadioSource(data);

      if (data.volume != null) {
        this.set('currentVolume', data.volume);
        result.volume = data.volume;
      }

      if (data.equalizerSettings != null) {
        var dataLength = data.equalizerSettings.length;
        var currentLength = this.lastRadioControlStruct.equalizerSettings.length;
        resultNew = { equalizerSettings: [] };
        if (result.source != null) {
          resultNew.source = data.source;
        }
        if (result.volume != null) {
          resultNew.volume = data.volume;
        }
        for (var i = 0; i < dataLength; i++) {
          for (var j = 0; j < currentLength; j++) {
            if (data.equalizerSettings[i].channelId == this.lastRadioControlStruct.equalizerSettings[j].channelId) {
              this.lastRadioControlStruct.equalizerSettings[j].channelSetting = SDL.deepCopy(data.equalizerSettings[i].channelSetting);
              if (j == this.tempEqualizerSettIndex - 1) {
                this.set('tempEqualizerSettings.equalizerSettings', data.equalizerSettings[i].equalizerSettings);
              }
            }
          }
        }
        resultNew.equalizerSettings = SDL.deepCopy(this.lastRadioControlStruct.equalizerSettings);


        this.setLastData();
        result = SDL.deepCopy(resultNew);
      }

      return result;
    },
    setAudioControlData: function (data, switchSource) {
      result = {};
      if (data.source != null) {
        
        SDL.RCModulesController.currentRadioModel.checkoutRadioSource(data);
        
        this.set('lastRadioControlStruct.source', data.source);
        if(switchSource) {
            this.switchSource(data.source);
        }
        result.source = data.source;
      }
      if (data.volume != null) {
        this.set('currentVolume', data.volume);
        result.volume = data.volume;
      }

      if (data.equalizerSettings != null) {
        var dataLength = data.equalizerSettings.length;
        var currentLength = this.lastRadioControlStruct.equalizerSettings.length;
        resultNew = { equalizerSettings: [] };
        if (result.source != null) {
          resultNew.source = data.source;
        }
        if (result.volume != null) {
          resultNew.volume = data.volume;
        }
        for (var i = 0; i < dataLength; i++) {
          for (var j = 0; j < currentLength; j++) {
            if (data.equalizerSettings[i].channelId == this.lastRadioControlStruct.equalizerSettings[j].channelId) {
              this.lastRadioControlStruct.equalizerSettings[j].channelSetting = SDL.deepCopy(data.equalizerSettings[i].channelSetting);
              if (j == this.tempEqualizerSettIndex - 1) {
                this.set('tempEqualizerSettings.equalizerSettings', data.equalizerSettings[i].equalizerSettings);
              }
            }
          }
        }
        resultNew.equalizerSettings = SDL.deepCopy(this.lastRadioControlStruct.equalizerSettings);


        this.setLastData();
        result = SDL.deepCopy(resultNew);
      }

      return result;
    },
    getAudioControlCapabilities: function () {
      var result = [];
      var capabilities = {
        moduleName: 'AudioControlCapabilities',
        keepContextAvailable: true,
        sourceAvailable: true,
        volumeAvailable: true,
        equalizerAvailable: true,
        equalizerMaxChannelId: 10
      };
      result.push(capabilities);
      return result;
    },
    /**
     * turn on scan event
     */
    turnOnScan: function () {
    },
    /**
     * turn on more info event
     */
    turnOnMoreInfo: function () {
    },
    /**
     * turn on options event
     */
    turnOnOptions: function () {
    },
    /**
     * turn on browse event
     */
    turnOnBrowse: function () {
    },
    update: function() {
        var data = this.getAudioControlData();
        this.setAudioControlData(data, SDL.States.media.active);
    },

    /**
     * @description Function to generate audio capabilities
     * @param {Object} element 
     */
    generateAudioCapabilities: function(element) {
      var capabilities = {};
      SDL.SDLModelData.audioControlCapabilitiesValues.forEach(capability => {
          if('moduleName' === capability) {
              capabilities[capability] = 'Audio';
              return;
          }
          if('moduleInfo' === capability) {
              var moduleInfo = {location: element};
              moduleInfo['moduleId'] = 
                SDL.VehicleModuleCoverageController.getModuleKeyName(element);
              capabilities[capability] = moduleInfo;
              return;
          }
          if('equalizerMaxChannelId' === capability) {
              capabilities[capability] = 10;
              return;
          }
          capabilities[capability] = true;
      });
      SDL.remoteControlCapability['audioControlCapabilities'].push(capabilities);
    }
})