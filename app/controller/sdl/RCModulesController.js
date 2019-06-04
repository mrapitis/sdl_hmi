SDL.RCModulesController = Em.Object.create({
    audioModels: {},
    climateModels: {},

    currentAudioModel: null,
    currentClimateModel: null,

    init: function() {
        // TODO: init only driver seats and set current models
        this.set('currentAudioModel', SDL.AudioModel.create());
        
        // this.audioModels['1'] = this.currentAudioModel;        
        // this.climateModels['1'] = SDL.ClimateControlModel.create(); 
        this.set('currentClimateModel', SDL.ClimateControlModel.create());
    },

    populateModels: function() {
        // TODO: consider serviceArea parameter!
        var vehicleRepresentation = 
            SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
        var contentBinding = [];
        vehicleRepresentation.forEach(element => {
            var moduleKeyName = this.getModuleKeyName(element);
            contentBinding.push(moduleKeyName);
            this.set('audioModels.' + moduleKeyName, SDL.AudioModel.create());
            this.set('climateModels.' + moduleKeyName, SDL.ClimateControlModel.create());
            this.generateClimateCapabilities(element);
            this.generateAudioCapabilities(element);            
        });
        this.set('currentClimateModel', this.climateModels[contentBinding[0]]);
        this.set('currentAudioModel', this.audioModels[contentBinding[0]]);
        SDL.ControlButtons.RCModules.set('content', contentBinding);
    },

    changeCurrentModule: function(moduleId) {
        this.set('currentClimateModel',this.climateModels[moduleId]);
        this.set('currentAudioModel',this.audioModels[moduleId]);
    },

    getModuleKeyName: function(item) {
        return "C" + item.col + "R" + item.row + "L" + item.level;
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
                moduleInfo['moduleId'] = this.getModuleKeyName(element);
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
                moduleInfo['moduleId'] = this.getModuleKeyName(element);
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

// ventilationMode: ['UPPER', 'LOWER', 'BOTH', 'NONE'],
// defrostZone: ['FRONT', 'REAR', 'ALL', 'NONE'],