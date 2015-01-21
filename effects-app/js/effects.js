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
 * Removes the last added effect.
 */
function removeLastEffect() {
  g_allEffects.pop();
  g_chainStack.pop();
  startGlobalEffects();
}


/**
 * Prepares and runs the currently configured global effects.
 */
function startGlobalEffects() {
  g_metaEffect.initEffects(g_allEffects);
  g_metaEffect.pipelineEffects(g_allEffects);
}


/**
 * Initializes the curent meta-effect pipeline and resets the current
 * pipeline of global effects if chaining is disabled.
 */
function resetGlobalEffects() {
  if (g_metaEffect == undefined) {
    g_metaEffect = gapi.hangout.av.effects.createMetaEffect();
  }
  if (!g_chain) {
    g_metaEffect.clearEffects();
    g_chainStack = [];
    g_allEffects = [];
  }
}


/**
 * Forces the effects to be cleared from the current effect chain.
 */
function clearGlobalEffects() {
  tempVal = g_chain;
  g_chain = false;
  resetGlobalEffects();
  g_chain = tempVal;
}


/**
 * Starts a single sub-effect on the meta effects API.
 *
 * @param {string} effectId A string indicating the sub effect to run.
 * @param {object} properties The properties for the sub effect.
 */
function simpleEffect(effectId, properties) {
  resetGlobalEffects();
  var simpleEffect = g_metaEffect.createSubEffect(effectId, properties);
  g_allEffects.push(simpleEffect);
  g_chainStack.push(effectId);
  startGlobalEffects();
}


/**
 * Add an effect to the global effect chain for rendering. Note that this
 * will push an effect to the effect chain regardless of whether the chain
 * effects selector is enabled.
 *
 * @param {String} effectId The identifier for the effect to add.
 * @param {Object} properties The properties for the effect to add.
 */
function addEffectToGlobalEffectChain(effectId, properties) {
  var additionalEffect = g_metaEffect.createSubEffect(effectId, properties);
  g_chainStack.push(effectId);
  g_allEffects.push(additionalEffect);
}


/**
 * Lists the current effects in their order for the effect chain.
 */
function showEffectChain() {
  if (g_chainStack == undefined || g_chainStack.length < 1) {
    alert('empty effect chain');
    return;
  }

  var chainString = '[Start]\n';
  for (var i = 0; i < g_chainStack.length; i++) {
    chainString += g_chainStack[i];
    if (i < g_chainStack.length - 1) {
      chainString += ' > ';
    }
  }
  chainString += '\n[END]';
  alert(chainString);
}
