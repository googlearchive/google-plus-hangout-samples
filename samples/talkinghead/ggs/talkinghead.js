/*
 * Copyright (c) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * @fileoverview Logic for the Talking Head App.
 * @author Tim Blasi (Google)
 */

/**
 * Whether to display debug information in the app.
 * @type {boolean}
 * @const
 */
var DEBUG = false;

/**
 * A list of the participants.
 * @type {Array.<gapi.hangout.Participant>}
 * @private
 */
var participants_ = null;

/**
 * Maps Participant's temporary ids to their current avatars.
 * @type {Object.<!string, !Avatar>}
 * @private
 */
var avatarMap_ = null;

/**
 * A map of names to jQuery elements which compose the app.
 * @type {Object.<string, jQuery>}
 * @private
 */
var DOM_ = {
  body: null,
  canvas: null,
  avatarList: null
};

/**
 * Makes an RPC call to store the given value(s) in the shared state.
 * @param {!(string|Object.<!string, !string>)} keyOrState Either an object
 *     denoting the desired key value pair(s), or a single string key.
 * @param {!string=} opt_value If keyOrState is a string, the associated value.
 */
var saveValue = null;

/**
 * Makes an RPC call to remove the given value(s) from the shared state.
 * @param {!(string|Array.<!string>)} keyOrListToRemove A single key
 *     or an array of strings to remove from the shared state.
 */
var removeValue = null;

(function() {
  /**
   * Packages the parameters into a delta object for use with submitDelta.
   * @param {!(string|Object.<!string, !string>)}  Either an object denoting
   *     the desired key value pair(s), or a single string key.
   * @param {!string=} opt_value If keyOrState is a string, the associated
   *     string value.
   */
  var prepareForSave = function(keyOrState, opt_value) {
    var state = null;
    if (typeof keyOrState === 'string') {
      state = {};
      state[keyOrState] = opt_value;
    } else if (typeof keyOrState === 'object' && null !== keyOrState) {
      // Ensure that no prototype-level properties are hitching a ride.
      state = {};
      for (var key in keyOrState) {
        if (keyOrState.hasOwnProperty(key)) {
          state[key] = keyOrState[key];
        }
      }
    } else {
      throw 'Unexpected argument.';
    }
    return state;
  };

  /**
   * Packages one or more keys to remove for use with submitDelta.
   * @param {!(string|Array.<!string>)} keyOrListToRemove A single key
   *     or an array of strings to remove from the shared state.
   * @return {!Array.<!string>} A list of keys to remove from the shared state.
   */
  var prepareForRemove = function(keyOrListToRemove) {
    var delta = null;
    if (typeof keyOrListToRemove === 'string') {
      delta = [keyOrListToRemove];
    } else if ($.isArray(keyOrListToRemove)) {
      // Discard non-string elements.
      for (var i = 0, iLen = keyOrListToRemove.length; i < iLen; ++i) {
        if (typeof keyOrListToRemove[i] === 'string') {
          delta.push(keyOrListToRemove[i]);
        }
      }
    } else {
      throw 'Unexpected argument.';
    }
    return delta;
  };

  /**
   * Makes an RPC call to add and/or remove the given value(s) from the shared
   * state.
   * @param {?(string|Object.<!string, !string>)} addState  Either an object
   *     denoting the desired key value pair(s), or a single string key.
   * @param {?(string|Object.<!string, !string>)=} opt_removeState A list of
   *     keys to remove from the shared state.
   */
  var submitDeltaInternal = function(addState, opt_removeState) {
    gapi.hangout.data.submitDelta(addState, opt_removeState);
  };

  saveValue = function(keyOrState, opt_value) {
    var delta = prepareForSave(keyOrState, opt_value);
    if (delta) {
      submitDeltaInternal(delta);
    }
  };

  removeValue = function(keyOrListToRemove) {
    var delta = prepareForRemove(keyOrListToRemove);
    if (delta) {
      submitDeltaInternal({}, delta);
    }
  };
})();


/**
 * Syncs local copies of shared state with those on the server and renders the
 *     app to reflect the changes.
 * @param {!Array.<Object.<!string, *>>} add Entries added to the shared state.
 * @param {!Array.<!string>} remove Entries removed from the shared state.
 */
function updateLocalStateData(add, remove) {
  // Update avatarMap_
  avatarMap_ = avatarMap_ || {};
  for (var i = 0, iLen = add.length; i < iLen; ++i) {
    var hangoutId = getHangoutIdFromUserKey_(add[i].key);
    if (hangoutId) {
      var avatar = Avatar.deserialize(add[i].value);
      var currAvatar = avatarMap_[hangoutId];
      if (avatar && (!currAvatar || avatar.getId() !== currAvatar.getId())) {
        avatarMap_[hangoutId] = avatar;
      }
    }
  }

  for (var i = 0, iLen = remove.length; i < iLen; ++i) {
    var hangoutId = getHangoutIdFromUserKey_(remove[i]);
    if (hangoutId && avatarMap_[hangoutId]) {
      delete avatarMap_[hangoutId];
    }
  }

  setAvatars();
}

/**
 * Syncs local copy of the participants list with that on the server and renders
 *     the app to reflect the changes.
 * @param {!Array.<gapi.hangout.Participant>} participants The new list of
 *     participants.
 */
function updateLocalParticipants(participants) {
  participants_ = participants;
  setAvatars();
}

/**
 * Class representing a speaking avatar.
 * @param {!Object.<!string, *>} spec Values for the Avatar. This must contain
 *     an id key.
 * @constructor
 */
function Avatar(spec) {
  spec = spec || {};

  if (!spec.id) {
    throw 'Avatars must define a unique id.';
  }

  var createGetter = function(initialVal) {
    var value = initialVal;
    return function() {
      return value;
    }
  };

  this.getId = createGetter(spec.id);
  this.getName = createGetter(spec.name || '');
  this.getRestUrl = createGetter(spec.restUrl || '');
  this.getTalkUrl = createGetter(spec.talkUrl || this.getRestUrl());

  var serialObject = {
    'id': this.getId(),
    'name': this.getName(),
    'restUrl': this.getRestUrl(),
    'talkUrl': this.getTalkUrl()
  };

  this.serialize = createGetter(JSON.stringify(serialObject));
}

/**
 * @return {string} The identifier for this Avatar.
 */
Avatar.prototype.getId = null;

/**
 * @return {string} The title displayed for the Avatar.
 */
Avatar.prototype.getName = null;

/**
 * @return {string} The url of the image displayed when the user is not
 *     speaking.
 */
Avatar.prototype.getRestUrl = null;

/**
 * @return {string} The url of the image displayed when the user is speaking.
 */
Avatar.prototype.getTalkUrl = null;

/**
 * Serializes the Avatar to a string for sending to the shared state.
 * @return {string} The serialized representation of the Avatar.
 */
Avatar.prototype.serialize = null;

/**
 * @return {string} A string representation of the avatar useful for debugging.
 */
Avatar.prototype.toString = function() {
  return '[Object Avatar <' + this.serialize() + '>]';
};

/**
 * Create an Avatar from a serialized avatar representation.
 * @param {string} serializedForm A string representing an Avatar object.
 * @return {?Avatar} A new Avatar populated using the data in the given
 *     serializedForm.
 */
Avatar.deserialize = function(serializedForm) {
  if (typeof serializedForm !== 'string') {
    return null;
  }
  var avatarSpec = $.parseJSON(serializedForm);
  return new Avatar(avatarSpec);
};

/**
 * @return {Array.<!Avatar>} A list of possible Avatar choices.
 */
function getAvatarChoices() {
  var imageHost = '//hangoutsapi.appspot.com/static/talkinghead';
  var android = new Avatar({
    'id': 'android',
    'name': 'Android',
    'restUrl': imageHost + '/android_logo_closed.png',
    'talkUrl': imageHost + '/android_logo_open.png'
  });
  var androidBlue = new Avatar({
    'id': 'androidBlue',
    'name': 'Android Blue',
    'restUrl': imageHost + '/android_blue_closed.png',
    'talkUrl': imageHost + '/android_blue_open.png'
  });

  return [android, androidBlue];
}

/**
 * @return {string} The user's ephemeral id.
 */
function getUserHangoutId() {
  return gapi.hangout.getParticipantId();
}

/**
 * @return {boolean} Whether the local Participant's mic is muted.
 */
function isUserMicMuted() {
  return gapi.hangout.av.getMicrophoneMute();
}

/**
 * Gets a userKey from the hangoutId. This is the opposite operation of
 * getHangoutIdFromUserKey_.
 * @param {string} hangoutId The user's hangout id.
 * @return {string} A userKey for use in the app state.
 * @see #getHangoutIdFromUserKey_
 * @private
 */
function makeUserKey_(hangoutId) {
  return hangoutId + ':avatar';
}

/**
 * Gets the user's hangoutId from the userKey. This is the oppposite operation
 * of makeUserKey_.
 * @return {?string} The user's hangoutId, or null if the userKey isn't
 *     correctly formatted.
 * @see #makeUserKey_
 * @private
 */
function getHangoutIdFromUserKey_(userKey) {
  if (typeof userKey === 'string') {
    var idx = userKey.lastIndexOf(':');

    if (idx >= 0) {
      if ('avatar' === userKey.substr(idx + 1)) {
        return userKey.substr(0, idx);
      }
    }
  }
  return null;
}

/**
 * Populates the list of Avatar choices.
 * @param {!Array.<!Avatar>} avatarChoices A list of possible Avatar choices.
 */
function populateAvatarChoices(avatarChoices) {

  var createAvatarClickHandler = function(avatar) {
    var hangoutId = getUserHangoutId();
    var newAv = avatar.serialize();
    var key = makeUserKey_(hangoutId);
    return function() {
      var currAv = avatarMap_[hangoutId];
      var isRemove = currAv && currAv.getId() === avatar.getId();

      if (isRemove) {
        removeValue(key);
      } else {
        saveValue(key, newAv);
      }
    };
  };

  for (var i = 0, iLen = avatarChoices.length; i < iLen; ++i) {
    var curr = avatarChoices[i];
    var avatarThumb = $('<img />')
        .attr({
          'title': curr.getName() + ' thumbnail',
          'src': curr.getRestUrl()
        });
    var avatarText = $('<div />')
        .text(curr.getName());
    var avatarItem = $('<li />')
        .attr('id', curr.getId())
        .append(avatarText)
        .append(avatarThumb)
        .click(createAvatarClickHandler(curr));

    DOM_.avatarList.append(avatarItem);
  }
}

/**
 * Apply selected avatars to their respective participants.
 */
function setAvatars() {
  if (!avatarMap_ || !participants_) {
    return;
  }

  if (DEBUG) {
    var table = DOM_.debugTable;
    table.empty();
  }

  var createSetAvatarHandler = function(hangoutId, isTalking, imgUrl) {
    return function() {
      if (isTalking !== this.isTalking) {
        this.isTalking = isTalking;
        gapi.hangout.av.setAvatar(hangoutId, imgUrl);
      }
    }
  };

  for (var i = 0, iLen = participants_.length; i < iLen; ++i) {
    var p = participants_[i];
    var isCurrentUser = p.id === getUserHangoutId();
    var clearSelected = false, setSelected = false;
    if (avatarMap_[p.id]) {
      var avatar = avatarMap_[p.id];
      if (!avatar.isSet) {
        clearSelected = setSelected = isCurrentUser;

        avatar.talkHandler =
            createSetAvatarHandler(p.id, true, avatar.getTalkUrl());
        avatar.quietHandler =
            createSetAvatarHandler(p.id, false, avatar.getRestUrl());
        avatar.isSet = true;
        avatar.quietHandler();

        if (DEBUG) {
          var tdKey = $('<td />')
              .text(p.id);
          var tdVal = $('<td />').text(avatar.toString());
          var tr = $('<tr />')
              .attr('id', p.id)
              .append(tdKey, tdVal);
          table.append(tr);
        }
      }
    } else {
      // If the avatar is currently set, remove it.
      gapi.hangout.av.clearAvatar(p.id);
      clearSelected = isCurrentUser;
    }
    if (clearSelected) {
      DOM_.avatarList.find('li').removeClass('selected');
    }
    if (setSelected) {
      $('#' + avatar.getId()).addClass('selected');
    }
  }
}

/**
 * Create required DOM elements and listeners.
 */
function prepareAppDOM() {
  DOM_.avatarList = $('<ul />')
      .attr('id', 'avatarList');
  DOM_.canvas = $('<div />')
      .attr('id', 'canvas')
      .append(DOM_.avatarList);

  DOM_.body = $('body')
      .append(DOM_.canvas);

  if (DEBUG) {
    DOM_.debugTable = $('<table />');
    DOM_.body.append(DOM_.debugTable);
  }
}

/**
 * Displays Avatar "talking" when a Participant's volume level changes.
 * @param {!Object.<!string, !number>} volumes A map of hangoutId > mic volume,
 *     where volume is in the range [0, 5].
 */
function onVolumeLevelsChanged(volumes) {
  if (!participants_ || !avatarMap_) {
    return;
  }
  for (var i = 0, iLen = participants_.length; i < iLen; ++i) {
    var hangoutId = participants_[i].id;
    var level = volumes[hangoutId] || 0;
    var avatar = avatarMap_[hangoutId];
    if (avatar && avatar.talkHandler && avatar.quietHandler) {
      var isLocalAndMuted = hangoutId === getUserHangoutId() &&
          isUserMicMuted();
      var myLevel = avatar.level || 0;
      if (isLocalAndMuted || level < myLevel) {
        avatar.quietHandler();
      } else if (level > myLevel) {
        avatar.talkHandler();
      }
      avatar.level = level;
    }
  }
}

/**
 * Initialize the DOM and app data.
 */
(function() {
  if (gapi && gapi.hangout) {

    var initHangout = function(apiReadyEvent) {
      if (apiReadyEvent.isApiReady) {
        prepareAppDOM();

        gapi.hangout.data.onStateChanged.add(function(stateChangeEvent) {
          updateLocalStateData(stateChangeEvent.addedKeys,
                               stateChangeEvent.removedKeys);
        });
        gapi.hangout.onParticipantsChanged.add(function(partChangeEvent) {
          updateLocalParticipants(partChangeEvent.participants);
        });

        populateAvatarChoices(getAvatarChoices());

        if (!participants_) {
          var initParticipants = gapi.hangout.getParticipants();
          if (initParticipants) {
            updateLocalParticipants(initParticipants);
          }
        }
        if (!avatarMap_) {
          var initMetadata = gapi.hangout.data.getStateMetadata();
          if (initMetadata) {
            // Since this is the first push, added has all the values in
            // metadata in Array form.
            var added = [];
            for (var key in initMetadata) {
              if (initMetadata.hasOwnProperty(key)) {
                added.push(initMetadata[key]);
              }
            }
            var removed = [];
            updateLocalStateData(added, removed);
          }
        }

        gapi.hangout.av.onVolumesChanged.add(function(volChangeEvent) {
          onVolumeLevelsChanged(volChangeEvent.volumes);
        });

        gapi.hangout.onApiReady.remove(initHangout);
      }
    };

    gapi.hangout.onApiReady.add(initHangout);
  }
})();
