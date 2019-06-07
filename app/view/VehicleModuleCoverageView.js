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
 * @name SDL.VehicleModuleCoverageView
 * @desc Vehicle module coverage settings representation
 * @category View
 * @filesource app/view/VehicleModuleCoverageView.js
 * @version 1.0
 */

SDL.VehicleModuleCoverageView = Em.ContainerView.create({
    classNameBindings: [
      'hide:inactive_state'
    ],
    elementId: 'vehicle_module_coverage_view',
    childViews: [
      'coverageEditor',
      'applyCoverageSettings',
      'optionClimate',
      'optionRadio',
      'optionSeat',
      'optionAudio',
      'optionLight',
      'optionHmiSettings'
    ],

    hide: true,
    currentModule: 'CLIMATE',

    onModuleClick : function(event) {
        var module_name = event.target.value;
        if (this._parentView.currentModule == module_name) {
            return;
        }

        this._parentView.coverageEditor.save();
        SDL.VehicleModuleCoverageController.switchModule(module_name);
    },

    onModuleSave: function(event) {
        SDL.VehicleModuleCoverageController.saveModuleSettings(this.currentModule);
    },
    
    optionClimate: SDL.RadioButton.extend(
        {
          Id: 'optionClimate',
          classNames: ['optionClimate'],
          name: 'cov_option',
          value: 'CLIMATE',
          selectionBinding: 'this.parentView.currentModule',
          text: 'Climate',
          clickCallbackBinding: 'this.parentView.onModuleClick'
        }
    ),

    optionRadio: SDL.RadioButton.extend(
        {
          Id: 'optionRadio',
          classNames: ['optionRadio'],
          name: 'cov_option',
          value: 'RADIO',
          selectionBinding: 'this.parentView.currentModule',
          text: 'Radio',
          clickCallbackBinding: 'this.parentView.onModuleClick'
        }
    ),

    optionSeat: SDL.RadioButton.extend(
        {
          Id: 'optionSeat',
          classNames: ['optionSeat'],
          name: 'cov_option',
          value: 'SEAT',
          selectionBinding: 'this.parentView.currentModule',
          text: 'Seat',
          clickCallbackBinding: 'this.parentView.onModuleClick'
        }
    ),

    optionAudio: SDL.RadioButton.extend(
        {
          Id: 'optionAudio',
          classNames: ['optionAudio'],
          name: 'cov_option',
          value: 'AUDIO',
          selectionBinding: 'this.parentView.currentModule',
          text: 'Audio',
          clickCallbackBinding: 'this.parentView.onModuleClick'
        }
    ),

    optionLight: SDL.RadioButton.extend(
        {
          Id: 'optionLight',
          classNames: ['optionLight'],
          name: 'cov_option',
          value: 'LIGHT',
          selectionBinding: 'this.parentView.currentModule',
          text: 'Light',
          clickCallbackBinding: 'this.parentView.onModuleClick'
        }
    ),

    optionHmiSettings: SDL.RadioButton.extend(
        {
          Id: 'optionHmiSettings',
          classNames: ['optionHmiSettings'],
          name: 'cov_option',
          value: 'HMI_SETTINGS',
          selectionBinding: 'this.parentView.currentModule',
          text: 'HMI settings',
          clickCallbackBinding: 'this.parentView.onModuleClick'
        }
    ),

    coverageEditor: SDL.CodeEditor.create(
      {
        codeEditorId: 'coverage_code_editor',
        elementId: 'coverage_editor'
      }
    ),

    applyCoverageSettings: Em.View.create(
      {
        elementId: 'coverage_apply_settings',
        classNameBindings: [
          'visible_display', 'pressed:pressed'
        ],
        classNames: [
          'apply_settings',
          'ffw-button'
        ],
        template: Ember.Handlebars.compile('<span>Apply</span>'),
        actionDown: function(event) {
          this.set('pressed', true);
        },
        actionUp: function(event) {
          this.set('pressed', false);
          this._parentView.set('hide', true);
        }
      }
    )
});
