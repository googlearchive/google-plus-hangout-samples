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


/**
 * Updates the slider values based on the selected effect.
 */
function selectedCustomEffect() {
  var effectIndex = document.getElementById('effects').selectedIndex;
  var effectParams = detectedEffectIds[effectIndex - 1].params;
  var effectParamNames = getEffectParamNames();

  var sliderArea = document.getElementById('sliders');
  sliderArea.innerHTML = '';
  g_sliders = [];
  g_sliderLabels = [];

  for (var i = 0; i < effectParamNames.length; i++) {
    var sliderLabel = document.createElement('span');
    g_sliderLabels[i] = sliderLabel;

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = effectParams[effectParamNames[i]].min;
    slider.max = effectParams[effectParamNames[i]].max;
    slider.step = effectParams[effectParamNames[i]].interval;
    slider.value = effectParams[effectParamNames[i]].default;
    slider.onchange = function(){sliderChange(this.id);};
    g_sliders[i] = slider;
    g_sliders[i].id = i;

    sliderArea.appendChild(sliderLabel);
    sliderArea.appendChild(document.createElement('br'));
    sliderArea.appendChild(slider);
    sliderArea.appendChild(document.createElement('br'));
    sliderArea.appendChild(document.createElement('br'));
    sliderChange(i);
  }
}


/**
 * Functions for adjuster sliders used in effect configuration.
 */
function sliderChange(i) {
  var effectParamNames = getEffectParamNames();
  var percent = g_sliders[i].value;

  if (g_sliderLabels[i]) {
    g_sliderLabels[i].innerText = effectParamNames[i] +
      ' : ' + percent;
  }else{
    g_sliderLabels[i].innerText = effectParamNames[i] +
      '-- : ' + percent;
  }
}


/**
 * Apply the configured custom effect.
 */
function applyCustomEffect(){
  var effectId = document.getElementById('effects').
      options[document.getElementById('effects').selectedIndex].text;
  var effectParamNames = getEffectParamNames();
  var effectIndex = document.getElementById('effects').selectedIndex;
  var effectParams = detectedEffectIds[effectIndex].params;

  for (var i=0; i<effectParamNames.length; i++){
    effectParams[effectParamNames[i]] = g_sliders[i].value;
  }

  console.log('Running custom effect: ' + effectId + ' with: ' + JSON.stringify(effectParams));
  simpleEffect(effectId, effectParams);
}


/**
 * Get the currently selecte effect parameter names from the parameter data
 * cached from the metaeffects API.
 *
 * @return {string[]} rray of effect parameter names.
 */
function getEffectParamNames() {
  var effectID = document.getElementById('effects').
      options[document.getElementById('effects').selectedIndex].text;
  var effectIndex = document.getElementById('effects').selectedIndex;
  var effectParams = detectedEffectIds[effectIndex - 1].params;
  return Object.keys(effectParams);
}
