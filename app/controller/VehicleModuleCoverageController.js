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
 * @name SDL.VehicleModuleCoverageController
 * @desc Vehicle module coverage settings representation
 * @category View
 * @filesource app/controller/VehicleModuleCoverageController.js
 * @version 1.0
 */

SDL.VehicleModuleCoverageController = Em.Object.create({
  targetView: null,

  coverageSettings: {
    "CLIMATE": [],
    "RADIO": [],
    "SEAT": [],
    "AUDIO": [],
    "LIGHT": [],
    "HMI_SETTINGS": []
  },

  init: function() {
    this.set('targetView', SDL.VehicleModuleCoverageView);    
  },

  fillDefaultCoverageSettings: function() {
    var currentSeatsData = SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
    var self = this;

    Object.keys(self.coverageSettings).forEach(key => {
        self.set('coverageSettings.' + key, SDL.deepCopy(currentSeatsData));
    });    
  },
  
  showModuleCoverage: function() {
    this.targetView.coverageEditor.activate();
    this.switchModule(this.targetView.currentModule);    
  },

  switchModule: function(module_name) {
    var settings = this.coverageSettings[module_name];
    this.targetView.coverageEditor.set('content', JSON.stringify(settings, null, 2));
    this.targetView.coverageEditor.reset();

    var self = this;
    this.targetView.coverageEditor.activate(function(data) {
        self.saveModuleSettings(self.targetView.currentModule, data);
    });
  },

  saveModuleSettings: function(module_name, data) {
    var parsed_settings;
    parsed_settings = JSON.parse(data);
 
    this.set('coverageSettings.' + module_name, parsed_settings);
  } 

});
