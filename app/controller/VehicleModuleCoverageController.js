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

  availableModules: [
    "CLIMATE",
    "RADIO",
    "SEAT",
    "AUDIO",
    "LIGHT",
    "HMI_SETTINGS"
  ],

  coverageSettings: {},

  savedCoverageSettings: {},

  init: function() {
    this.set('targetView', SDL.VehicleModuleCoverageView);    
  },

  loadSavedCoverageSettings: function() {
    var emulation_type = FLAGS.VehicleEmulationType;
    if (this.savedCoverageSettings.hasOwnProperty(emulation_type)) {
      this.set('coverageSettings', 
        SDL.deepCopy(this.savedCoverageSettings[emulation_type])
      ); 
      return;
    }

    var currentSeatsData = SDL.SDLModelData.vehicleSeatRepresentation[emulation_type];
    var self = this;
    var default_settings = {};

    this.availableModules.forEach(module => {
      if('HMI_SETTINGS' == module ||
          'LIGHT' == module) {
        default_settings[module] = self.createFullCoverage(currentSeatsData);
        return;
      }
      default_settings[module] = SDL.deepCopy(currentSeatsData);
    });

    this.set('coverageSettings', SDL.deepCopy(default_settings));
  },

  createFullCoverage: function(data) {
    var max_col_index = this.getVehicleMaxIndex(data, 'col');
    var max_col_value = this.getVehicleItemValue(data[max_col_index], 'col');
    var max_row_index = this.getVehicleMaxIndex(data, 'row');
    var max_row_value = this.getVehicleItemValue(data[max_row_index], 'row');
    var max_level_index = this.getVehicleMaxIndex(data, 'level');
    var max_level_value = this.getVehicleItemValue(data[max_level_index], 'level');

    var full_coverage_data = [{
      col: 0, 
      row: 0, 
      level: 0,
      colspan: ++max_col_value,
      rowspan: ++max_row_value,
      levelspan: ++max_level_value
    }];
    return full_coverage_data;
  },

  saveCoverageSettings: function() {
    var emulation_type = FLAGS.VehicleEmulationType;
    this.savedCoverageSettings[emulation_type] = SDL.deepCopy(this.coverageSettings);
  },

  getCoverageSettings: function() {
    this.loadSavedCoverageSettings();    
    return this.coverageSettings;
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
  },
  
  validateSettings: function() {
    this.targetView.coverageEditor.save();

    var validation_message = this.checkModulesConsistency();
    if (validation_message !== "") {
      SDL.PopUp.create().appendTo('#' + this.targetView.elementId).popupActivate(
        'Invalid JSON settings:\n' + validation_message
      );
      return false;
    }
    
    validation_message = this.checkModulesBoundaries();
    if (validation_message !== "") {
      SDL.PopUp.create().appendTo('#' + this.targetView.elementId).popupActivate(
        'Invalid JSON settings:\n' + validation_message
      );
      return false;
    }

    validation_message = this.checkModuleCoverage();
    if (validation_message !== "") {
      SDL.PopUp.create().appendTo('#' + this.targetView.elementId).popupActivate(
        'Invalid JSON settings:\n' + validation_message
      );
      return false;
    }

    return true;
  },

  getModuleKeyName: function(item) {
    return "L" + item.level + "R" + item.row + "C" + item.col;
  },

  getVehicleMaxIndex: function(data, field) {
    var max_index = 0;
    var max_value = 0;

    data.forEach(
      function(item, index) {
        var value = 
          SDL.VehicleModuleCoverageController.getVehicleItemValue(item, field);

        if (value > max_value) {
          max_index = index;
          max_value = value;
        }
    });

    return max_index;
  },

  getVehicleItemValue: function(item, field) {
    var value = 0;
    if (item.hasOwnProperty(field)) {
      value = item[field];
    }

    var span_field = field + 'span';
    if (item.hasOwnProperty(span_field)) {
      value += item[span_field] - 1;
    }

    return value;
  },

  checkModulesConsistency: function() {
    var self = this;
    var validation_message = "";

    Object.keys(self.coverageSettings).forEach(module_type => {
      var module_coverage = self.coverageSettings[module_type];
      
      module_coverage.forEach(
        function(element, index) {
          if (!element.hasOwnProperty('col') || !element.hasOwnProperty('row')) {
            validation_message += module_type + ": Element #" + index + " does not contain col/row field!\n";
          }
      });
    });

    return validation_message;
  },

  checkModulesBoundaries: function() {
    var representation = SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
    var max_col_index = this.getVehicleMaxIndex(representation, 'col');
    var max_col_value = this.getVehicleItemValue(representation[max_col_index], 'col');

    var max_row_index = this.getVehicleMaxIndex(representation, 'row');
    var max_row_value = this.getVehicleItemValue(representation[max_row_index], 'row');
    
    var max_level_index = this.getVehicleMaxIndex(representation, 'level');
    var max_level_value = this.getVehicleItemValue(representation[max_level_index], 'level');

    var self = this;
    var validation_message = "";

    Object.keys(self.coverageSettings).forEach(module_type => {
      var module_coverage = self.coverageSettings[module_type];
      var module_max_col_index = self.getVehicleMaxIndex(module_coverage, 'col');
      var module_max_col_value = self.getVehicleItemValue(module_coverage[module_max_col_index], 'col');

      var module_max_row_index = self.getVehicleMaxIndex(module_coverage, 'row');
      var module_max_row_value = self.getVehicleItemValue(module_coverage[module_max_row_index], 'row');

      var module_max_level_index = self.getVehicleMaxIndex(module_coverage, 'level');
      var module_max_level_value = self.getVehicleItemValue(module_coverage[module_max_level_index], 'level');  

      if (module_max_col_value > max_col_value) {
        validation_message += module_type + ": out-of-bound column in " + 
          self.getModuleKeyName(module_coverage[module_max_col_index]) + "\n";
      }
      if (module_max_row_value > max_row_value) {
        validation_message += module_type + ": out-of-bound row in " +
          self.getModuleKeyName(module_coverage[module_max_row_index]) + "\n";
      }
      if (module_max_level_value > max_level_value) {
        validation_message += module_type + ": out-of-bound level in " +
          self.getModuleKeyName(module_coverage[module_max_level_index]) + "\n";
      }
    });

    return validation_message;
  },

  checkModuleCoverage: function() {
    var representation = SDL.SDLModelData.vehicleSeatRepresentation[FLAGS.VehicleEmulationType];
    var self = this;
    var validation_message = "";

    Object.keys(self.coverageSettings).forEach(module_type => {
      var coverage = {};
    
      representation.forEach(item => {
        coverage[self.getModuleKeyName(item)] = 0;
      });
      
      var module_coverage = self.coverageSettings[module_type];
      module_coverage.forEach(module => {
        // These fields are not mandatory according to API so should be checked
        var module_level = module.hasOwnProperty('level') ? module.level : 0;

        var level_span = module.hasOwnProperty('levelspan') ? module.levelspan : 1;
        var row_span = module.hasOwnProperty('rowspan') ? module.rowspan : 1;
        var col_span = module.hasOwnProperty('colspan') ? module.colspan : 1;
        
        for (var level = module_level; level < module_level + level_span; ++level) {
          for (var row = module.row; row < module.row + row_span; ++row) {
            for (var col = module.col; col < module.col + col_span; ++col) {
              var covered_item = {
                "col" : col,
                "row" : row,
                "level" : level
              }
              var covered_module_name = self.getModuleKeyName(covered_item);
              if (coverage.hasOwnProperty(covered_module_name)) {
                coverage[covered_module_name]++;
              }
            }
          }
        }
      });

      Object.keys(coverage).forEach(module => {
        if (0 == coverage[module]) {
          validation_message += module_type + ": Location " + module + " is not covered\n";
          return;
        }
        if (1 < coverage[module]) {
          validation_message += module_type + ": Location " + module + " is covered by " + 
            coverage[module] + " modules\n"
        }
      });
    });    

    return validation_message;
  }

});
