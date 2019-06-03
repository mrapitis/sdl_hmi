SDL.RCModulesController = Em.Object.create({
    audioModels: {},
    climateModels: {},

    currentAudioModel: null,
    currentClimate: null,

    init: function() {
        this.set('currentAudioModel', SDL.AudioModel.create());
        
        this.audioModels['1'] = this.currentAudioModel;
        this.audioModels['2'] = SDL.AudioModel.create();
        
        this.climateModels['1'] = SDL.ClimateControlModel.create(); 
        this.set('currentClimate', this.climateModels[1]);
        this.climateModels['2'] = SDL.ClimateControlModel.create();
    },

    changeClimate: function(index) {
        this.set('currentClimate',this.climateModels[index]);
    }
})