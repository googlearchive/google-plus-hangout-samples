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
 * Demo of auto bcs
 * @param {number} targetBrightness The target brightness value.
 * @param {number} brightness The brightness value.
 * @param {number} contrast The target contrast value.
 * @param {number} saturation The target saturation value.
 */
function autoBcs(targetBrightness, brightness, contrast, saturation) {
  if (targetBrightness == undefined) {
    targetBrightness = 90;
  }

  if (brightness == undefined) {
    brightness = 0.6;
  }

  if (contrast == undefined) {
    contrast = 0.6;
  }

  if (saturation == undefined) {
    saturation = 0.1;
  }

  var bcsProps = {
    'target_brightness': targetBrightness, /* 0 .. 255 */
    'brightness': brightness, /* -1 .. 1 */
    'constrast': contrast, /* -1 .. 1 */
    'saturation': saturation /* -1 .. 1 */
  };

  simpleEffect(effectIds.AUTO_BCS, bcsProps);
}


/**
 * Demo of backlight
 * @param {number} brightness Target brightness
 */
function backlight(brightness) {
  if (brightness == undefined) {
    brightness = .5;
  }
  var backlightProps = {
    'scale': brightness /* -1 .. 1 */
  };
  simpleEffect(effectIds.BACKLIGHT, backlightProps);
}


/**
 * Demonstration of background replacement. This function copies the background
 * in order to create a buffer to use for background replacement
 */
function backgroundReplacement() {
  resetGlobalEffects();

  // Replace the background.
  var backgroundProps = {

  };
  addEffectToGlobalEffectChain(effectIds.BACKGROUND_REPLACEMENT,
      backgroundProps);

  // Copy from current frame into background buffer.
  var copyProps = {
    'resource_key': 'background'
  };
  addEffectToGlobalEffectChain(effectIds.COPY, copyProps);

  // Blur the buffer.
  var blurProps = {
  };
  addEffectToGlobalEffectChain(effectIds.BLUR, blurProps);

  // Overlay the background.
  var overlayProps = {
    'foreground_resource' : {'key': 'background'}
  };
  addEffectToGlobalEffectChain(effectIds.OVERLAY_BACKGROUND, overlayProps);

  startGlobalEffects();
}


/**
 * Demo of bilateral filter
 */
function bilateralFilter() {
  var bilateralFilterProps = {
  };
  simpleEffect(effectIds.BILATERAL, bilateralFilterProps);
}


/**
 * Blurs the user's face.
 *
 * @param {number} windowSize
 * @param {number} aspectRatio
 * @param {number} timeout
 * @param {number} scale
 * @param {number} affinity
 */
function blurFace(windowSize, aspectRatio, timeout, scale, affinity) {
  if (windowSize == undefined) {
    windowSize = 33;// odd number 0-640
  }
  if (aspectRatio == undefined) {
    aspectRatio = .7; // 0.0 ... 1.0
  }
  if (timeout == undefined) {
    timeout = 1000;
  }
  if (scale == undefined) {
    scale = 6.0;
  }
  if (affinity == undefined) {
    affinity = 1.0;
  }

  var bfProperties = {
    window_size: windowSize,
    aspect_ratio: aspectRatio,
    timeout: timeout,
    scale: scale,
    affinity: affinity
  };
  simpleEffect(effectIds.BLUR_FACE, bfProperties);
}


/**
 * A simple effect that blurs a square in the middle of the screen.
 *
 * @param {number} windowSize
 * @param {number} topleftX
 * @param {number} topleftY
 * @param {number} width
 * @param {number} height
 */
function blurSquare(windowSize, topleftX, topleftY, width, height) {
  if (windowSize == undefined) {
    windowSize = 15;
  }
  if (topleftX == undefined) {
    topLeftX = 0.25; /* 0 .. 1 */
  }
  if (topleftY == undefined) {
    topleftY = 0.25; /* 0 .. 1 */
  }
  if (width == undefined) {
    width = 0.5; /* 0 .. 1 */
  }
  if (height == undefined) {
    height = 0.5; /* 0 .. 1 */
  }

  var properties = {
    window_size: windowSize,
    top_left: {x: topleftX, y: topleftY},
    width: width,
    height: height
  };

  simpleEffect(effectIds.BLUR, properties);
}


/**
 * Cartoon effect
 *
 * @param {number} width
 * @param {number} height
 * @param {number} window_size
 * @param {number} similarity_range
 * @param {number} iterations
 * @param {number} black
 * @param {number} white
 */
function cartoonEffect(width, height, window_size, similarity_range,
    iterations, black, white) {
  if (width == undefined) {
    width = 320; // 1 .. 4096
  }
  if (height == undefined) {
    height = 180; // 1 .. 4096
  }
  if (window_size == undefined) {
    window_size = 25;  // 3 .. 255
  }
  if (similarity_range == undefined) {
    similarity_range = 20; // 1-255
  }
  if (iterations == undefined) {
    iterations = 2; // more than 1
  }
  if (black == undefined) {
    black = .9;
  }
  if (white == undefined) {
    white = .8;
  }

  var cartoonProps = {
    width: width,
    height: height,
    window_size: window_size,
    similarity_range: similarity_range,
    iterations: iterations,
    black: black,
    white: white
  };

  simpleEffect(effectIds.CARTOON, cartoonProps);
}


/**
 * Demonstration of center crop
 *
 * @param {number} topLeftX
 * @param {number} topLeftY
 * @param {number} width
 * @param {number} height
 */
function centerCrop(topLeftX, topLeftY, width, height) {
  if (topLeftX == undefined) {
    topLeftX = 0.25;
  }
  if (topLeftY == undefined) {
    topLeftY = 0.25;
  }
  if (width == undefined) {
    width = .5;
  }
  if (height == undefined) {
    height = .5;
  }


  cropProps = {
    topLeft: {
      x: topLeftX,
      y: topLeftY
    },
    width: width,
    height: height
  };

  simpleEffect(effectIds.CENTER_CROP, cropProps);
}


/**
 * Demonstrates face crop plugin.
 *
 * @param timeout {number}
 * @param scale {number}
 * @param affinity {number}
 * @param width {number}
 * @param height {number}
 */
function cropFace(timeout, scale, affinity, width, height) {
  if (timeout == undefined) {
    timeout = 1000;
  }
  if (scale == undefined) {
    scale = 4.0;
  }
  if (affinity == undefined) {
    affinity = 0.4;
  }
  if (width == undefined) {
    width = 160;
  }
  if (height == undefined) {
    height = 90;
  }

  var cropProps = {
    timeout: timeout,
    scale: scale,
    affinity: affinity,
    width: width,
    height: height
  };

  simpleEffect(effectIds.CROP_FACE, cropProps);
}


/**
 * Demo of color correction
 * @param {boolean} applyTemporalFilter
 */
function colorCorrect(applyTemporalFilter) {
  if (applyTemporalFilter == undefined) {
    applyTemporalFilter = false;
  }
  var props = {
    'apply_temporal_filtering' : applyTemporalFilter
  };

  simpleEffect(effectIds.COLOR_CORRECT, props);
}


/**
 * Color matrix demo
 * @param {number} matrix
 */
function colorMatrix(matrix) {
  if (matrix == undefined) {
    matrix =
        [805 / 2048, 1575 / 2048, 387 / 2048, 0.0,
         715 / 2048, 1405 / 2048, 344 / 2048, 0.0,
         557 / 2048, 1094 / 2048, 268 / 2048, 0.0];
  }
  var properties = {
    matrix: matrix
  };
  simpleEffect(effectIds.COLOR_MATRIX, properties);
}


/**
 * Demonstration of color temperature
 * @param {number} value
 */
function colorTemp(value) {
  if (value == undefined) {
    value = .3; // -.5 .. .5
  }
  var colorTempProps = {
    'scale' : value
  };
  simpleEffect(effectIds.COLOR_TEMPERATURE, colorTempProps);
}


/**
 * Demonstration of copy
 */
function copyEffect() {
  // See background blur for example
}


/**
 * Duotone effect - highlights specific colors.
 * @param {number} r1
 * @param {number} g1
 * @param {number} b1
 * @param {number} r2
 * @param {number} g2
 * @param {number} b2
 */
function duotoneEffect(r1, g1, b1, r2, g2, b2) {
  if (r1 == undefined) {
    r1 = 0;
  }
  if (g1 == undefined) {
    g1 = 0;
  }
  if (b1 == undefined) {
    b1 = 255;
  }

  if (r2 == undefined) {
    r2 = 255;
  }
  if (g2 == undefined) {
    g2 = 255;
  }
  if (b2 == undefined) {
    b2 = 0;
  }


  var duoProps = {
    color1: {
      r: r1,
      g: g1,
      b: b1
    },

    color2: {
      r: r2,
      g: g2,
      b: b2
    }
  };

  simpleEffect(effectIds.DUOTONE, duoProps);
}


/**
 * Demonstration of face data
 *
 * Note:
 * Face data is of the form:
 * {
 *   hasFace: boolean,
 *   leftEyeCenter: {x: number, y: number},
 *   leftEyebrowLeft: {x: number, y: number},
 *   leftEyebrowRight: {x: number, y: number},
 *   lowerLip: {x: number, y: number},
 *   mouthCenter: {x: number, y: number},
 *   mouthLeft: {x: number, y: number},
 *   mouthRight:{x: number, y: number},
 *   noseRoot: {x: number, y: number},
 *   noseTip: {x: number, y: number},
 *   pan: number,
 *   rightEyeCenter: {x: number, y: number},
 *   rightEyebrowLeft: {x: number, y: number},
 *   rightEyebrowRight: {x: number, y: number},
 *   roll: number,
 *   tilt: number,
 *   upperLip: {x: number, y: number}
 * }
 */
function faceData() {
  resetGlobalEffects();

  gapi.hangout.av.effects.onFaceTrackingDataChanged.add(function(faceData) {
    const windowSize = 15;
    var x = 0; //faceData.leftEye.x;
    var width = faceData.rightEye.x - faceData.leftEye.x;
    var y = 0; //faceData.leftEye.y;
    var height = faceData.rightEye.y - faceData.leftEye.y;
    width = .1;
    height = .1;

    var properties = {
      window_size: windowSize,
      top_left: {x: x, y: y},
      width: width,
      height: height
    };

    g_metaEffect.removeEffects([g_faceEffect]);
    g_faceEffect = g_metaEffect.createSubEffect(effectIds.BLUR, properties);
    g_faceEffect.properties = properties;
  });

  g_allEffects.push(g_faceEffect);
  startGlobalEffects();

}


/**
 * Demonstration of face overlay
 */
function faceOverlay() {
}


/**
 * A simple example of the fish eye effect.
 * @param {number} distortion
 */
function fishEye(distortion) {
  if (distortion == undefined) {
    distortion = .5;
  }

  var fisheyeProps = {
    'scale': distortion
  };
  simpleEffect(effectIds.FISHEYE, fisheyeProps);
}


/**
 * Flip effect
 * @param {boolean} horizontal
 * @param {boolean} vertical
 */
function flipEffect(horizontal, vertical) {
  if (horizontal == undefined) {
    horizontal = true;
  }
  if (vertical == undefined) {
    vertical = true;
  }
  var properties = {
    horizontal: horizontal,
    vertical: vertical
  };
  simpleEffect(effectIds.FLIP, properties);
}


/**
 * Demonstrates the grain effect
 * @param {number} value
 */
function grainEffect(value) {
  if (value == undefined) {
    value = .75;
  }
  var grainProps = {
    'scale' : value
  };
  simpleEffect(effectIds.GRAIN, grainProps);
}


/**
 * Demo of the grayscale effect
 */
function grayscaleEffect() {
  var grayProps = {
  };
  simpleEffect(effectIds.GRAYSCALE, grayProps);
}


/**
 * Demo of hand data
 */
function handDataEffect() {
  var handDataProps = {
  };
  simpleEffect(effectIds.HAND_DATA, handDataProps);
}


/**
 * Demo of hand overlay
 */
function handOverlayEffect() {
  var handOverlayProps = {
  };
  simpleEffect(effectIds.HAND_OVERLAY, handOverlayProps);
}


/**
 * Demo of low bandwidth sobel
 */
function lowbandwidthSobelEffect() {
  var lowbwSobelProps = {
  };
  simpleEffect(effectIds.LOW_BANDWIDTH_SOBEL, lowbwSobelProps);
}


/**
 * Luminance enhancer
 * @param {boolean} useUniformHistogram
 * @param {boolean} useFilteredMaps
 */
function luminanceEnhancer(useUniformHistogram, useFilteredMaps) {
  if (useUniformHistogram == undefined) {
    useUniformHistogram = false;
  }
  if (useFilteredMaps == undefined) {
    useFilteredMaps = false;
  }
  var luminanceProps = {
    use_uniform_histogram: useUniformHistogram,
    use_filtered_maps: useFilteredMaps
  };

  simpleEffect(effectIds.LUMINANCE_ENHANCER, luminanceProps);
}


/**
 * Demo of negative effect
 */
function negativeEffect() {
  var negativeProps = {
  };
  simpleEffect(effectIds.NEGATIVE, negativeProps);
}


/**
 * Demo of overlay effect
 */
function overlayEffect() {
  var overlayProps = {
  };
  simpleEffect(effectIds.OVERLAY, overlayProps);
}


/**
 * Demo of background overlay effect
 */
function backgroundOverlayEffect() {
  const RESOURCE_KEY = 'tempfg';

  var bgOverlayProps = {
    'foreground_resource': {
      'key' : RESOURCE_KEY
    }
  };
  simpleEffect(effectIds.OVERLAY_BACKGROUND, bgOverlayProps);
}


/**
 * Demo of play audio effect.
 */
function audioEffect() {
  var audioProps = {
  };

  simpleEffect(effectIds.PLAY_AUDIO, audioProps);
}


/**
 * Demo of quantization
 * @param {number} interval_size
 */
function quantizationEffect(interval_size) {
  if (interval_size == undefined) {
    interval_size = 150;
  }

  var qProps = {
    'interval_size': interval_size /* 1 - 255 */
  };

  simpleEffect(effectIds.QUANTIZATION, qProps);
}


/**
 * Demo of resize
 */
function resizeEffect() {
  var resizeProps = {

  };
  simpleEffect(effectIds.RESIZE, resizeProps);
}


/**
 * Demo of saturate effect
 * @param {number} value
 */
function saturateEffect(value) {
  if (value == undefined) {
    value = .5;
  }
  var saturateProps = {
    'scale' : value /* -1 .. 1 */
  };
  simpleEffect(effectIds.SATURATE, saturateProps);
}


/**
 * Demo of sepia effect
 */
function sepiaEffect() {
  var sepiaProps = {
    /* no properties */
  };
  simpleEffect(effectIds.SEPIA, sepiaProps);
}


/**
 * Demo of simple BCS
 * @param {number} brightness
 * @param {number} contrast
 * @param {number} saturation
 */
function simpleBcsEffect(brightness, contrast, saturation) {
  if (brightness == undefined) {
    brightness = 0.9;
  }
  if (contrast == undefined) {
    contrast = .7;
  }

  if (saturation == undefined) {
    saturation = 0;
  }
  var simpleBcsProps = {
    'brightness' : brightness, /* -1 .. 1 */
    'contrast' : contrast, /* -1 .. 1 */
    'saturation' : saturation
  };
  simpleEffect(effectIds.SIMPLE_BCS, simpleBcsProps);
}


/**
 * Demo of snapshot effect
 */
function snapshotEffect() {
  var snapshotProps = {
  };
  simpleEffect(effectIds.SNAPSHOT, snapshotProps);
}


/**
 * Demo of sobel effect
 */
function sobelEffect() {
  var sobelEffectProps = {
  };
  simpleEffect(effectIds.SOBEL, sobelEffectProps);
}


/**
 * Demo of static overlay effect
 */
function staticOverlayEffect() {
  var staticOverlayProps = {
  };
  simpleEffect(effectIds.STATIC_OVERLAY, staticOverlayProps);
}


/**
 * Demo of surface blur
 */
function surfaceBlurEffect() {
  var surfaceBlurProps = {
    'window_size': 11,
    'edge_min_threshold': 5,
    'edge_max_threshold': 90
  };
  simpleEffect(effectIds.SURFACE_BLUR, surfaceBlurProps);
}


/**
 * Demo of swap effect - swaps an image for the video stream.
 */
function swapEffect() {
  if (g_swap == undefined) {
    resetGlobalEffects();

    const COPY_RESOURCE_KEY = 'temp';
    var copyProps = {
      'resource_key': COPY_RESOURCE_KEY
    };
    addEffectToGlobalEffectChain(effectIds.COPY, copyProps);
    startGlobalEffects();
    g_swap = '';
  } else {
    var swapProps = {
      'resource_key': COPY_RESOURCE_KEY
    };
    addEffectToGlobalEffectChain(effectIds.SWAP, swapProps);
    startGlobalEffects();
  }
}


/**
 * Demo of temporal blur effect.
 */
function temporalBlurEffect() {
  var temporalBlurProps = {
  };
  simpleEffect(effectIds.TEMPORAL_BLUR, temporalBlurProps);
}


/**
 * Demo of a tint effect
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
function tintEffect(r, g, b) {
  if (r == undefined) {
    r = 255;
  }
  if (g == undefined) {
    g = 0;
  }
  if (b == undefined) {
    b = 255;
  }

  var tintProps = {
    r: r,
    g: g,
    b: b
  };

  simpleEffect(effectIds.TINT, tintProps);
}


/**
 * Demo of vignette effect
 */
function vignetteEffect() {
  var vignetteProps = {
    color: { 'r': 0, 'g': 0, 'b': 0},
    focus: { 'x': .5, 'y' : .5 },
    size: .7
  };
  simpleEffect(effectIds.VIGNETTE, vignetteProps);
}


/**
 * Demo of warmify effect
 */
function warmifyEffect() {
  var warmifyProps = {
  };
  simpleEffect(effectIds.WARMIFY, warmifyProps);
}


/**
 * Demo of whiteblack effect
 *
 * @param {number} white
 * @param {number} black
 */
function whiteblackEffect(white, black) {
  if (white == undefined) {
    white = 0.5; // 0 .. 2.0
  }
  if (black == undefined) {
    black = 0.55; // 0 .. 2.0
  }
  var whiteblackProps = {
    white: white,
    black: black
  };
  simpleEffect(effectIds.WHITEBLACK, whiteblackProps);
}
