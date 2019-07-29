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

SDL.PolicyConfigListView = Em.ContainerView.create(
    {
      elementId: 'policies_settings_policyConfigList',
      classNames: 'in_settings_separate_view',
      classNameBindings: [
        'SDL.States.settings.policies.policyConfig.active:active_state:inactive_state'
      ],
      childViews: [
        'backButton',
        'label',
        'policyConfigCodeEditor',
        'policyConfigEditorButton',
        'policyTypeLabel',
        'propertyLabel',
        'policyTypeInput',
        'propertyInput',
        'sendRequestButton',
        'getPolicyConfigVersion'
      ],
      label: SDL.Label.extend(
        {
          classNames: 'label',
          content: 'Configure and send GetPolicyConfigurationData request'
        }
      ),
      backButton: SDL.Button.extend(
        {
          classNames: [
            'backButton'
          ],
          action: 'onState',
          target: 'SDL.SettingsController',
          goToState: 'policies',
          icon: 'images/media/ico_back.png',
          onDown: false
        }
      ),
      policyConfigCodeEditor: SDL.CodeEditor.extend(
        {
          elementId: 'policyConfigCodeEditor',
          codeEditorId: 'policyConfigEditorButton'
        }
      ),
      policyConfigEditorButton: SDL.Button.extend(
        {
          elementId: 'policyConfigEditorButton',
          classNames: ['policyConfigEditorButton button'],
          text: 'Local custom vehicle data version',
          action: 'policyConfigDataChange',
          target: 'SDL.SDLController',
          onDown: false
        }
      ),

      policyTypeLabel: SDL.Label.extend(
        {
          classNames: 'polciyTypeLabel',
          content: 'Policy type: '
        }
      ),
      propertyLabel: SDL.Label.extend(
        {
          classNames: 'propertyLabel',
          content: 'Property: '
        }
      ),

      policyTypeInput: Ember.TextField.extend(
        {
          elementId: 'policyTypeInput',
          classNames: 'policyTypeInput dataInput',
          valueBinding: 'SDL.SDLModel.data.policyType'
        }
      ),

      propertyInput: Ember.TextField.extend(
        {
          elementId: 'propertyInput',
          classNames: 'propertyInput dataInput',
          valueBinding: 'SDL.SDLModel.data.property'
        }
      ),

      sendRequestButton: SDL.Button.extend(
        {
          elementId: 'sendRequestButton',
          classNames: 'sendRequestButton button',
          text: 'Send request',
          action: 'sendGetPolicyConfigurationDataRequest',
          target: 'SDL.SettingsController',
          onDown: false
        }
      ),

      getPolicyConfigVersion: SDL.Button.extend(
        {
          elementId: 'getPolicyConfigVersion',
          classNames: 'getPolicyConfigVersion button',
          attributeBindings: ['title:title'],
          title: `Send GetPolicyConfigurationData with:
            { 
              policyType: module_config,
              property: endpoint_properties
            } ` ,
          text: 'Custom vehicle data mapping update flow',
          action: 'checkPolicyVersionButtonPress',
          target: 'SDL.SettingsController',
          onDown: false
        }
      ),
    }
  );
  