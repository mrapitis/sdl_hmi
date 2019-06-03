SDL.RCModulesController = Em.Object.create({
    audioModels: {},
    climateModels: {},

    currentAudioModel: null,
    currentClimate: null,

    init: function() {
        // TODO: init only driver seats and set current models
        this.set('currentAudioModel', SDL.AudioModel.create());
        
        this.audioModels['1'] = this.currentAudioModel;        
        this.climateModels['1'] = SDL.ClimateControlModel.create(); 
        this.set('currentClimate', this.climateModels[1]);
    },

    populateModels: function() {
        // TODO: consider serviceArea parameter!
        var vehicleRepresentation = 
            SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];

        vehicleRepresentation.forEach(element => {
            this.set('audioModels.' + this.getModuleKeyName(element), SDL.AudioModel.create());
            this.set('climateModels.' + this.getModuleKeyName(element), SDL.ClimateControlModel.create());
        });
    },

    changeClimate: function(index) {
        this.set('currentClimate',this.climateModels[index]);
    },

    getModuleKeyName: function(item) {
        return "C" + item.col + "R" + item.row + "L" + item.level;
    }
})