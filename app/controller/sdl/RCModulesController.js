SDL.RCModulesController = Em.Object.create({
    audioModels: {},
    climateModels: {},
    radioModels: {},
    seatModels: {},
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
            this.set('seatModels.' + moduleKeyName, SDL.SeatModel.create({ID: moduleKeyName}));
            this.set('radioModels.' + moduleKeyName, SDL.RadioModel.create());
            this.generateClimateCapabilities(element);
            this.generateAudioCapabilities(element);            
        });
        this.set('currentClimateModel', this.climateModels[contentBinding[0]]);
        this.set('currentAudioModel', this.audioModels[contentBinding[0]]);
        this.set('currentSeatModel', this.seatModels[contentBinding[0]]);
        this.set('currentRadioModel', this.radioModels[contentBinding[0]]);
        SDL.ControlButtons.RCModules.set('content', contentBinding);
    },

    changeCurrentModule: function(moduleId) {
        this.set('currentClimateModel',this.climateModels[moduleId]);
        this.set('currentSeatModel', this.seatModels[moduleId]);
        this.set('currentAudioModel', this.audioModels[moduleId]);
        this.set('currentRadioModel', this.radioModels[moduleId]);
        this.currentSeatModel.update();
    },

    getModuleKeyName: function(item) {
        return "C" + item.col + "R" + item.row + "L" + item.level;
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
