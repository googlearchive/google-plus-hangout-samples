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



const effectIds = {
  AUTO_BCS: 'auto_bcs', // Auto BCS
  BACKLIGHT: 'backlight', // Backlight effect
  BACKGROUND_REPLACEMENT: 'replace_background', // BG replacement effect
  BILATERAL: 'bilateral', // Bilateral filter
  BLUR: 'blur', // Blur everything
  BLUR_FACE: 'blur_face', // blurs user face
  CARTOON: 'cartoon', // Makes scene look like a cartoon
  CENTER_CROP: 'crop', // Crops the csreen
  CROP_FACE: 'crop_face', // Crops the detected face
  COLOR_CORRECT: 'color_correct', // Color correction
  COLOR_MATRIX: 'color_matrix', // color matrix distortion
  COLOR_TEMPERATURE: 'color_temp', // changes color temperature
  COPY: 'copy', // Copy metaeffect
  DUOTONE: 'duotone', // forces two tones
  FACE_DATA: 'face_data', // Captures face data
  FACE_OVERLAY: 'face_overlay', // Renders an overlay on a participant face
  FISHEYE: 'fisheye', // distorts image like a fisheye lens
  FLIP: 'flip', // flips image horizontally or vertically
  FREEZE_FRAME: 'freeze_frame', // Freezes the frame (debugging)
  GRAIN: 'grain', // film grain effect
  GRAYSCALE: 'grayscale', // Forces grayscale
  HAND_DATA: 'hand_data', // used for getting hand data
  HAND_OVERLAY: 'hand_overlay', // Overlay on hands
  LOW_BANDWIDTH_SOBEL: 'low_bandwidth_sobel', // Low bandwidth edge effect
  LUMINANCE_ENHANCER: 'luminance_enhancer', // enhances luminance
  META_EFFECT: 'meta_effect', // Holder for metaeffect
  NEGATIVE: 'negative', // Invers colors
  OVERLAY: 'overlay', // Draws an overlay
  OVERLAY_BACKGROUND: 'overlay_background', // Overlays on background
  PLAY_AUDIO: 'play_audio', // Plays audio in hangout
  QUANTIZATION: 'quantize', // Quantizes colors
  RESIZE: 'resize', // Resizes video
  SATURATE: 'saturate', // Saturates colors
  SEPIA: 'sepia', // Sepia effect
  SIMPLE_BCS: 'simple_bcs', // Draws BCS
  SNAPSHOT: 'snapshot', // Takes snapshot for debugging
  SOBEL: 'sobel', // Sobel effect
  STATIC_OVERLAY: 'static_overlay', // Draws an overlay on the screen
  SURFACE_BLUR: 'surface_blur', // Smooths out surfaces
  SWAP: 'swap', // Swaps metaeffects
  TEMPORAL_BLUR: 'temporal_blur', // blurs movement
  TINT: 'tint', // tints the image colors
  VIGNETTE: 'vignetting', // Adds vignetting on image edges
  WARMIFY: 'warmify', // makes image appear warmer
  WHITEBLACK: 'whiteblack' // changes white and black levels
};
