/*
* Copyright (c) 2011 Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
* in compliance with the License. You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software distributed under the License
* is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
* or implied. See the License for the specific language governing permissions and limitations under
* the License.
*/
var serverPath = "//YOUR_APP_ID.appspot.com/";

// The functions triggered by the buttons on the Hangout App
function countButtonClick() {
  // Note that if you click the button several times in succession,
  // if the state update hasn't gone through, it will submit the same
  // delta again.  The hangout data state only remembers the most-recent
  // update.  
  console.log("Button clicked.");
  var value = 0;
  if (gapi.hangout.data.getState()['count']) {
    value = parseInt(gapi.hangout.data.getState()['count']);
  }

  console.log("New count is " + value);
  // Send update to shared space.
  // NOTE:  Only ever send strings as values in the key-value pairs
  gapi.hangout.data.submitDelta({'count': '' + (value + 1)});
}

function resetButtonClick() {
  console.log("Resetting count to 0");
  gapi.hangout.data.submitDelta({'count': '0'});
}

function getMessageClick() {
  console.log("Requesting message from main.py");
  var http = new XMLHttpRequest();
  http.open("GET", serverPath);
  http.onreadystatechange=function() {
    if(this.readyState == 4 && this.status == 200) {
      var jsonResponse = JSON.parse(http.responseText);
      console.log(jsonResponse);

      var messageElement = document.getElementById('message');
      messageElement.innerHTML = jsonResponse['message'];
    }
  }
  http.send();
}

// Callback functions for events created by the hangout
function apiReady() {
  console.log("API is ready");

}

function stateUpdated(delta, metadata) {
  var countElement = document.getElementById('count');
  if (!gapi.hangout.data.getState()['count']) {
    countElement.innerHTML = "Probably 0";
  } else {
    countElement.innerHTML = gapi.hangout.data.getState()['count'];
  }
}

function participantsUpdated(participantsArray) {
  console.log("Participants count: " + participantsArray.length);
  var participantsListElement = document.getElementById('participants');
  participantsListElement.innerHTML = participantsArray.length;
}


// A function to be run at app initialization time which registers our callbacks
function init() {
  console.log("Init app.");
  gapi.hangout.data.addStateChangeListener(stateUpdated);
  gapi.hangout.addParticipantsListener(participantsUpdated);

  // This application is pretty simple, but use this special api ready state
  // event if you would like to any more complex app setup.
  gapi.hangout.addApiReadyListener(apiReady);
}

gadgets.util.registerOnLoadHandler(init);

