/*
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


// Initialize and start the application.
var detectedEffectIds = {};
function startApp() {
  resetGlobalEffects();

  var onNotify = function(notify) {
    if (notify != null && notify.effect_descriptions != null) {
      detectedEffectIds = notify.effect_descriptions;

      for (var i = 0; i < detectedEffectIds.length; i++) {
        var x = document.getElementById('effects');
        var option = document.createElement('option');
        option.text = detectedEffectIds[i].id;
        option.value = i;
        x.add(option);
      }

      g_metaEffect.onNotify.remove(onNotify);
    }
  };

  g_metaEffect.onNotify.add(onNotify);
  g_metaEffect.getEffectDescriptions();
}


function init() {
  // When API is ready...
  gapi.hangout.onApiReady.add(function() {
    try {
      startApp();
    } catch (e) {
      console.log('Error:');
      console.log(e.stack);
    }
  });
}
