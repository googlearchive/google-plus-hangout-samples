// Keep track of some UI elements
var overlayControls = document.getElementById('overlayControls');
var scaleTxt = document.getElementById('scaleTxt');
var offsetTxt = document.getElementById('offsetTxt');

// Track our overlays for re-use later
var overlays = [];

// Scale limits---tiny hats look silly, but tiny monocles are fun.
var minScale = [];
var maxScale = [];

/** Responds to buttons
 * @param {string} name Item to show.
 */
function showOverlay(name) {
  hideAllOverlays();
  currentItem = name;
  setControlVisibility(true);
  overlays[currentItem].setVisible(true);
  updateControls();
}

function showNothing() {
  currentTime = null;
  hideAllOverlays();
  setControlVisibility(false);
}

/** Responds to scale slider
 * @param {string} value The new scale.
 */
function onSetScale(value) {
  scaleTxt.innerHTML = parseFloat(value).toFixed(2);
  overlays[currentItem].setScale(parseFloat(value));
}

/** Responds to offset slider
 * @param {string} value The new offset.
 */
function onSetOffset(value) {
  console.log('Setting ' + value);

  offsetTxt.innerHTML = parseFloat(value).toFixed(2);
  overlays[currentItem].setOffset(0, parseFloat(value));
}

function setControlVisibility(val) {
  if (val) {
    overlayControls.style.visibility = 'visible';
  } else {
    overlayControls.style.visibility = 'hidden';
  }
}

/** Resets the controls for each type of wearable item */
function updateControls() {
  var overlay = overlays[currentItem];
  var min = minScale[currentItem];
  var max = maxScale[currentItem];

  document.getElementById('scaleSlider').value = overlay.getScale();
  document.getElementById('scaleSlider').min = min;
  document.getElementById('scaleSlider').max = max;
  document.getElementById('scaleTxt').innerHTML =
      overlay.getScale().toFixed(2);

  document.getElementById('offsetSlider').value = overlay.getOffset().y;
  document.getElementById('offsetTxt').innerHTML =
      overlay.getOffset().y.toFixed(2);
}

/** For removing every overlay */
function hideAllOverlays() {
  for (var index in overlays) {
    overlays[index].setVisible(false);
  }
}

/** Initialize our constants, build the overlays */
function createOverlays() {
  var topHat = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/topHat.png');
  overlays['topHat'] = topHat.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.NOSE_ROOT,
       'scaleWithFace': true,
       'rotateWithFace': true,
       'scale': 1.0});
  minScale['topHat'] = 0.25;
  maxScale['topHat'] = 1.5;

  var mono = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/monocle.png');
  overlays['mono'] = mono.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.RIGHT_EYE,
       'scaleWithFace': true,
       'scale': 1.0});
  minScale['mono'] = 0.5;
  maxScale['mono'] = 1.5;

  var stache = gapi.hangout.av.effects.createImageResource(
      'http://hangoutmediastarter.appspot.com/static/mustache.png');
  overlays['stache'] = stache.createFaceTrackingOverlay(
      {'trackingFeature':
       gapi.hangout.av.effects.FaceTrackingFeature.NOSE_TIP,
       'scaleWithFace': true,
       'rotateWithFace': true});
  minScale['stache'] = 0.65;
  maxScale['stache'] = 2.5;
}

createOverlays();

// SOUND

var gooddaySoundURL =
    'http://hangoutmediastarter.appspot.com/static/goodday.wav';

var gooddaySound = gapi.hangout.av.effects.createAudioResource(
    gooddaySoundURL).createSound();

function sayGoodDay() {
  // There can only be one active resource, Audio or Image.
  // By playing the sound, we activate this resource 
  // and will automatically hide all the other overlays.
  // Thus, we hide the scaling controls.
  setControlVisibility(false);
  gooddaySound.play({loop: false});
}

function emitGoodDayEvent() {
  // Make an arbitrary change to the shared state.
  // This will set off an event change, which in turn
  // will make a noise.  If two people are mashing the button
  // at the same time, you might miss a soundplay....and that
  // would be OK in that situation.
  var countStr = gapi.hangout.data.getState()['count'];

  if (countStr == null) {
    count = 0;
  }
  else {
    count = parseInt(countStr) + 1;
  }

  gapi.hangout.data.submitDelta({'count': '' + count});
}

function onStateChanged(event) {
  try {
    console.log('State changed...');
    // If the shared state changes with an addition
    // or modification, make a noise.
    if (event.addedKeys.length > 0) {
      console.log('I say good day to you!');
      sayGoodDay();
    }
  } catch (e) {
    console.log('Fail state changed');
    console.log(e);
  }
}

function init() {
  gapi.hangout.onApiReady.add(function(eventObj) {
      if (eventObj.isApiReady) {
        gapi.hangout.data.onStateChanged.add(onStateChanged);
      }
    });
}

gadgets.util.registerOnLoadHandler(init);
