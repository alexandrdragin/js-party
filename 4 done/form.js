'use strict';

var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },

  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },

  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },

  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },

  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

//  вызов ананимной функции
(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var reviewForm = document.querySelector('.review-form');
  var reviewName = document.getElementById('review-name');
  var reviewText = document.getElementById('review-text');

  reviewName.required = true;
  reviewText.required = true;

  function checkValues() {
    var reviewNameLabel = reviewForm.getElementsByClassName('review-fields-name')[0];
    if (reviewName.value.length) {
      reviewNameLabel.classList.add('invisible');
    } else {
      reviewNameLabel.classList.remove('invisible');
    }
    var reviewFieldsText = reviewForm.getElementsByClassName('review-fields-text')[0];
    if (reviewText.value.length) {
      reviewFieldsText.classList.add('invisible');
    } else {
      reviewFieldsText.classList.remove('invisible');
    }
  }

  reviewName.onkeyup = function() {
    checkValues();
  };

  reviewText.onkeyup = function() {
    checkValues();
  };


  function setCookieFun(name, value, expires) {
    document.cookie = name + '=' + escape(value) + ((expires) ? '; expires=' + expires : '');
  }


  reviewName.value = docCookies.getItem('reviewNameCook');

  var savedScoreValue = docCookies.getItem('radioValCook');
  if (savedScoreValue) {
    var selectedRadio = reviewForm.querySelector('input[name="review-mark"][value="' + savedScoreValue + '"]');
    selectedRadio.setAttribute('checked', true);
  }


  reviewForm.onsubmit = function(e) {
    e.preventDefault();
    var now = new Date();
    var exDate = new Date(now.getTime() + (30 * 365 * 60 * 60 * 24000));

    var reviewScoreValue = reviewForm.querySelector('input[name="review-mark"]:checked').value;
    var currentName = reviewName.value;

    setCookieFun('radioValCook', reviewScoreValue, exDate.toUTCString());
    setCookieFun('reviewNameCook', currentName, exDate.toUTCString());


    reviewForm.submit();
  };


//  появление формы
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

// скрытие формы
  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };


})();
