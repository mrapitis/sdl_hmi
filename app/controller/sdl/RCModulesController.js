/*
 * Copyright (c) 2019, Ford Motor Company All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: ·
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. · Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. · Neither the name of the Ford Motor Company nor the
 * names of its contributors may be used to endorse or promote products derived
 * from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @name SDL.RCModulesController
 * @desc RC modules controller logic
 * @category Controller
 * @filesource app/controller/sdl/RCModulesController.js
 * @version 1.0
 */
SDL.RCModulesController = Em.Object.create({
    /**
     * @description Mapping of module seats and audio data models
     * @type {Map}
     */
    audioModels: {},

    /**
     * @description Mapping of module seats and climate data models
     * @type {Map}
     */
    climateModels: {},

    /**
     * @description Mapping of module seats and radio data models
     * @type {Map}
     */
    radioModels: {},

    /**
     * @description Mapping of module seats and seat data models
     * @type {Map}
     */
    seatModels: {},

    /**
     * @description Mapping of module seats and hmi settings data models
     * @type {Map}
     */
    hmiSettingsModels: {},

    /**
     * @description Mapping of module seats and light data models
     * @type {Map}
     */
    lightModels: {},

    /**
     * @description Mapping of module types and internal mapping of module
     * seats and responsible module
     * @type {Map}
     */
    moduleModelsMapping: {},

    /**
     * @description Mapping of user friendly seat names and their key names
     * @type {Map}
     */
    seatKeyLabelMapping: {},

    /**
     * @description Reference to currently active seat model
     * @type {Object}
     */
    currentSeatModel: null,
    
    /**
     * @description Reference to currently active audio model
     * @type {Object}
     */
    currentAudioModel: null,

    /**
     * @description Reference to currently active climate model
     * @type {Object}
     */
    currentClimateModel: null,

    /**
     * @description Reference to currently active radio model
     * @type {Object}
     */
    currentRadioModel: null,

    /**
     * @description Reference to currently active hmi settings model
     * @type {Object}
     */
    currentHMISettingsModel: null,

    /**
     * @description Reference to currently active light model
     * @type {Object}
     */
    currentLightModel: null,

    /**
     * @description Function for controller initialization
     */
    init: function() {
        // Mock models required for early binding initialization
        this.set('currentAudioModel', SDL.AudioModel.create());
        this.set('currentClimateModel', SDL.ClimateControlModel.create());
        this.set('currentSeatModel', SDL.SeatModel.create());
        this.set('currentRadioModel', SDL.RadioModel.create());
        this.set('currentHMISettingsModel', SDL.HmiSettingsModel.create());
        this.set('currentLightModel', SDL.LightModel.create());
    },

    /**
     * @description Function for generating a coverage according to specified
     * settings and saving into the moduleModelsMapping  
     * @param {String} module_type
     * @param {Array} module_coverage 
     */
    fillModuleModelsMapping: function(module_type, module_coverage) {
      var mapping = {};

      module_coverage.forEach(module => {
        // These fields are not mandatory according to API so should be checked
        var module_level = module.hasOwnProperty('level') ? module.level : 0;
        var module_row = module.row;
        var module_col = module.col;

        var covering_module_name = SDL.VehicleModuleCoverageController.getModuleKeyName({
          "col": module_col,
          "row": module_row,
          "level": module_level
        });

        var level_span = module.hasOwnProperty('levelspan') ? module.levelspan : 1;
        var row_span = module.hasOwnProperty('rowspan') ? module.rowspan : 1;
        var col_span = module.hasOwnProperty('colspan') ? module.colspan : 1;
        
        for (var level = module_level; level < module_level + level_span; ++level) {
          for (var row = module_row; row < module_row + row_span; ++row) {
            for (var col = module_col; col < module_col + col_span; ++col) {
              var covered_item = {
                "col" : col,
                "row" : row,
                "level" : level
              }
              var covered_module_name = 
                SDL.VehicleModuleCoverageController.getModuleKeyName(covered_item);
              mapping[covered_module_name] = covering_module_name;              
            }
          }
        }
      });

      this.moduleModelsMapping[module_type] = mapping;
    }, 
    
    /**
     * @description Function for getting covering module key by specified
     * module type + actual seat key
     * @param {String} module_type 
     * @param {String} module_key
     * @returns covering module key 
     */
    getCoveringModuleKey: function(module_type, module_key) {
      var mapping = this.moduleModelsMapping[module_type];
      return mapping[module_key];
    },

    /**
     * @description Function for getting module model by specified module
     * type + actual seat key
     * @param {String} module_type 
     * @param {String} module_key 
     */
    getCoveringModuleModel: function(module_type, module_key) {
      var covering_module_key = this.getCoveringModuleKey(module_type, module_key);
      switch (module_type) {
        case 'CLIMATE': return this.climateModels[covering_module_key];
        case 'RADIO': return this.radioModels[covering_module_key];
        case 'SEAT': return this.seatModels[covering_module_key];
        case 'AUDIO': return this.audioModels[covering_module_key];
        case 'LIGHT': return this.lightModels[covering_module_key];
        case 'HMI_SETTINGS': return this.hmiSettingsModels[covering_module_key];
      }
      return null;   
    },

    /**
     * @description Function for creation of models and assigning them to
     * responsible modules according to coverage settings
     */
    populateModels: function() {
        var vehicleRepresentation = 
            SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
        
        var contentBinding = [];
        vehicleRepresentation.forEach(element => {
          var moduleKeyName =  SDL.VehicleModuleCoverageController.getModuleKeyName(element);
          contentBinding.push(moduleKeyName);
        });

        var self = this;
        var coverageSettings = SDL.VehicleModuleCoverageController.getCoverageSettings();
        Object.keys(coverageSettings).forEach(module_type => {
          var module_coverage = coverageSettings[module_type];
          switch (module_type) {
            case 'CLIMATE': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('climateModels.' + key_name, SDL.ClimateControlModel.create());
                self.climateModels[key_name].generateClimateCapabilities(module);
                self.fillButtonCapabilitiesContent(self.climateModels[key_name], module);   
              });              
              break;
            }
            case 'RADIO': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('radioModels.' + key_name, SDL.RadioModel.create()); 
                self.radioModels[key_name].generateRadioControlCapabilities(module);
                self.fillButtonCapabilitiesContent(self.radioModels[key_name], module);        
              });
              break;
            }
            case 'SEAT': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('seatModels.' + key_name, SDL.SeatModel.create({ID: key_name}));
                self.seatModels[key_name].generateSeatCapabilities(module);
              });
              break;    
            }
            case 'AUDIO': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('audioModels.' + key_name, SDL.AudioModel.create());   
                this.audioModels[key_name].generateAudioCapabilities(module);
              });              
              break;   
            }
            case 'LIGHT': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('lightModels.' + key_name, SDL.LightModel.create());
                self.lightModels[key_name].generateLightCapabilities(module);  
              });
              break;
            }
            case 'HMI_SETTINGS': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('hmiSettingsModels.' + key_name, SDL.HmiSettingsModel.create());
                self.hmiSettingsModels[key_name].generateHMISettingsCapabilities(module);   
              });
              break;
            }
          }
          self.fillModuleModelsMapping(module_type, module_coverage);
        });

        this.fillModuleSeatLocationContent(contentBinding);
        this.fillSeatLocationCapabilities(vehicleRepresentation);

        this.updateCurrentModels(contentBinding[0]);
    },

    /**
     * @description Function to fill button capabilities
     * @param {Object} model
     * @param {Object} module 
     */
    fillButtonCapabilitiesContent: function(model, module) {
      var moduleInfo = {
        'allowMultipleAccess': true,
        'moduleId':
          SDL.VehicleModuleCoverageController.getModuleKeyName(module),
        'serviceArea': SDL.deepCopy(module),
        'location': SDL.deepCopy(module),
      };
  
      moduleInfo.location['colspan'] = 1;
      moduleInfo.location['rowspan'] = 1;
      moduleInfo.location['levelspan'] = 1;
      
      var button_capabilities = model.getButtonCapabilities();
      button_capabilities.forEach(element => {
        element['moduleInfo'] = moduleInfo;
      });

      SDL.remoteControlCapabilities.remoteControlCapability['buttonCapabilities'] =
        SDL.remoteControlCapabilities.remoteControlCapability['buttonCapabilities']
          .concat(button_capabilities);
    },

    /**
     * @description Function to generate user friendly names for a specified
     * strings in array and fill combobox with seat locations
     * @param {Array} content_binding 
     */
    fillModuleSeatLocationContent: function(content_binding) {
      if (1 >= content_binding.length) {
        return;
      }

      var user_friendly_content = [];
      var mapping = {};
      content_binding.forEach(element => {
        var new_name = element.replace('L', 'Level ')
                              .replace('R', ', Row ')
                              .replace('C', ', Col ');
        user_friendly_content.push(new_name);
        mapping[new_name] = element;        
      });
      
      this.set('seatKeyLabelMapping', mapping);
      SDL.ControlButtons.RCInfo.RCModules.set('content', user_friendly_content);
    },

    /**
     * @description Function to generate seat locations capabilities
     * @param {Array} representation 
     */
    fillSeatLocationCapabilities: function(representation) {       
      var seat_capability = {};
      
      var max_col_index = 
        SDL.VehicleModuleCoverageController.getVehicleMaxIndex(representation, 'col');
      seat_capability['columns'] = 
        SDL.VehicleModuleCoverageController.getVehicleItemValue(
          representation[max_col_index], 'col') + 1;

      var max_row_index = 
        SDL.VehicleModuleCoverageController.getVehicleMaxIndex(representation, 'row');
      seat_capability['rows'] = 
        SDL.VehicleModuleCoverageController.getVehicleItemValue(
          representation[max_row_index], 'row') + 1;

      var max_level_index = 
        SDL.VehicleModuleCoverageController.getVehicleMaxIndex(representation, 'level');
      seat_capability['levels'] = 
        SDL.VehicleModuleCoverageController.getVehicleItemValue(
          representation[max_level_index], 'level') + 1;

      seat_capability['seats'] = [];
      representation.forEach(seat => {
        seat_capability.seats.push(
          {
            'grid': seat
          }
        );
      });

      SDL.remoteControlCapabilities.seatLocationCapability = seat_capability;
    },

    /**
     * @description Function invoked when user changes a seat zone
     * @param {String} module_key 
     */
    changeCurrentModule: function(user_friendly_key) {
      var module_key = this.seatKeyLabelMapping[user_friendly_key];
      this.updateCurrentModels(module_key);        
    },

    /**
     * @description Function to update current models according to a newly
     * selected module
     * @param {String} module_key 
     */
    updateCurrentModels: function(module_key) {
        this.set('currentClimateModel', this.getCoveringModuleModel('CLIMATE', module_key));
        this.set('currentAudioModel', this.getCoveringModuleModel('AUDIO', module_key));
        this.set('currentSeatModel', this.getCoveringModuleModel('SEAT', module_key));
        this.set('currentRadioModel', this.getCoveringModuleModel('RADIO', module_key));
        this.set('currentHMISettingsModel', this.getCoveringModuleModel('HMI_SETTINGS', module_key));
        this.set('currentLightModel', this.getCoveringModuleModel('LIGHT', module_key));

        this.currentSeatModel.update();
        this.currentRadioModel.update();
        this.currentAudioModel.update();
    },

    /**
     * @description Function used to do specified action in specified model
     * @param {Event} event 
     */
    action: function(event) {
        this[event.model][event.method](event);
    },   
})

