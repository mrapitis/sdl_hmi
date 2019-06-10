SDL.RCModulesController = Em.Object.create({
    audioModels: {},
    climateModels: {},
    radioModels: {},
    seatModels: {},

    ModuleModelsMapping: {},

    currentSeatModel: null,
    currentAudioModel: null,
    currentClimateModel: null,
    currentRadioModel: null,

    init: function() {
        // TODO: init only driver seats and set current models
        this.set('currentAudioModel', SDL.AudioModel.create());
        this.set('currentClimateModel', SDL.ClimateControlModel.create());
        this.set('currentSeatModel', SDL.SeatModel.create());
        this.set('currentRadioModel', SDL.RadioModel.create());
    },

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

      this.ModuleModelsMapping[module_type] = mapping;
    }, 
    
    getCoveringModuleKey: function(module_type, module_key) {
      var mapping = this.ModuleModelsMapping[module_type];
      return mapping[module_key];
    },

    getCoveringModuleModel: function(module_type, module_key) {
      var covering_module_key = this.getCoveringModuleKey(module_type, module_key);
      switch (module_type) {
        case 'CLIMATE': return this.climateModels[covering_module_key];
        case 'RADIO': return this.radioModels[covering_module_key];
        case 'SEAT': return this.seatModels[covering_module_key];
        case 'AUDIO': return this.audioModels[covering_module_key];
        case 'LIGHT': return null; // WTF??
        case 'HMI_SETTINGS': return null; // WTF??
      }
      return null;   
    },

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
                self.generateClimateCapabilities(module);        
              });              
              break;
            }
            case 'RADIO': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('radioModels.' + key_name, SDL.RadioModel.create());        
              });
              break;
            }
            case 'SEAT': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('seatModels.' + key_name, SDL.SeatModel.create({ID: key_name}));        
              });
              break;    
            }
            case 'AUDIO': {
              module_coverage.forEach(module => {
                var key_name = SDL.VehicleModuleCoverageController.getModuleKeyName(module);
                self.set('audioModels.' + key_name, SDL.AudioModel.create());       
                this.generateAudioCapabilities(module); 
              });              
              break;   
            }
            case 'LIGHT': {
                // WTF??
              break;    
            }
            case 'HMI_SETTINGS': {
                 // WTF??
                break;
            }
          }
          self.fillModuleModelsMapping(module_type, module_coverage);
        });

        SDL.ControlButtons.RCModules.set('content', contentBinding);
        this.changeCurrentModule(contentBinding[0]);
    },

    changeCurrentModule: function(module_key) {
        this.set('currentClimateModel', this.getCoveringModuleModel('CLIMATE', module_key));
        this.set('currentAudioModel', this.getCoveringModuleModel('AUDIO', module_key));
        this.set('currentSeatModel', this.getCoveringModuleModel('SEAT', module_key));
        this.set('currentRadioModel', this.getCoveringModuleModel('RADIO', module_key));

        this.currentSeatModel.update();
    },

    action: function(event) {
        this[event.model][event.method](event);
    },

    generateClimateCapabilities: function(element) {
        var capabilities = {};
        SDL.SDLModelData.climateControlCapabilitiesValues.forEach(capability => {
            if('moduleName' === capability) {
                capabilities[capability] = 'Climate';
                return;
            }
            if('ventilationMode' === capability) {
                capabilities[capability] = ['UPPER', 'LOWER', 'BOTH', 'NONE'];
                return;
            }
            if('defrostZone' === capability) {
                capabilities[capability] = ['FRONT', 'REAR', 'ALL', 'NONE'];
                return;
            }
            if('moduleInfo' === capability) {
                var moduleInfo = {location: element};
                moduleInfo['moduleId'] = 
                  SDL.VehicleModuleCoverageController.getModuleKeyName(element);
                capabilities[capability] = moduleInfo;
                return;
            }
            capabilities[capability] = true;
        });
        SDL.remoteControlCapability['climateControlCapabilities'].push(capabilities);
    },

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

