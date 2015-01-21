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
 *  The purty effect makes you look pretty through a combination of blur
 *  and color vibrance.
 */
function purtyEffect() {
  g_metaEffect.clearEffects();

  const COPY_KEY = 'temp';

  // 1. Temporal blur
  var temporalBlurProps = {
    'learning_rate': 0.9
  };
  var temporalBlurEffect = g_metaEffect.createSubEffect(
      effectIds.TEMPORAL_BLUR, temporalBlurProps);

  // 2. Surface blur
  var surfaceBlurProps = {
    'window_size': 7,
    'edge_min_threshold': 10,
    'edge_max_threshold': 80
  };
  var blurEffect = g_metaEffect.createSubEffect(effectIds.SURFACE_BLUR,
      surfaceBlurProps);
  g_allEffects.push(blurEffect);

  // 3. Vignette #1 (alpha)
  var alphaVignetteProps = {
    'size': 0.6,
    'alpha_only': true
  };
  var alphaVignetteEffect = g_metaEffect.createSubEffect(effectIds.VIGNETTE,
      alphaVignetteProps);
  g_allEffects.push(alphaVignetteEffect);

  // 4. Copy
  var copyProps = {
    'resource_key': COPY_KEY
  };
  var copyEffect = g_metaEffect.createSubEffect(effectIds.COPY, copyProps);
  g_allEffects.push(copyEffect);

  // 5. AutoBCS
  var bcsProps = {
    'target_brightness': 90,
    'brightness': 0.6,
    'constrast': 0.6,
    'saturation': 0.1
  };
  var bcsEffect = g_metaEffect.createSubEffect(effectIds.AUTO_BCS, bcsProps);
  g_allEffects.push(bcsEffect);


  // 6. Overlay
  var overlayProps = {
    'foreground_resource': {
      'key': COPY_KEY
    }
  };
  var overlayEffect = g_metaEffect.createSubEffect(
      effectIds.OVERLAY_BACKGROUND, overlayProps);
  g_allEffects.push(overlayEffect);

  // 7. Vignette #2
  var vignetteProps = {
    'size' : 0.9
  };
  var vignetteEffect = g_metaEffect.createSubEffect(
      effectIds.VIGNETTE, vignetteProps);
  g_allEffects.push(vignetteEffect);


  startGlobalEffects();
}


/**
* Demonstrates a black and white effect.
*/
function bwEffect() {
  clearGlobalEffects();

  var bcsProps = {
    'brightness': 0.6,
    'constrast': 0.3,
    'saturation': -1.0};
}


/**
 * A silly effect that makes you want to squint at the person in frame.
 */
function squintEffect() {
  resetGlobalEffects();
  var tempMode = g_chain;
  g_chain = true;

  // A fish eye with maximum distortion.
  fishEye(.6);
  // Crop to the face!
  cropFace();
  // Temporal blur
  temporalBlurEffect();

  g_chain = tempMode;
}


/**
 * An alternate rotoscope / cartoon effect.
 */
function rotoEffect() {
  resetGlobalEffects();
  var tempMode = g_chain;
  g_chain = true;

  autoBcs();
  bilateralFilter();
  surfaceBlurEffect();
  simpleBcsEffect();
  quantizationEffect();

  g_chain = tempMode;
}
