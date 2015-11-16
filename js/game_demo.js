'use strict';

define([
  'game'
],
  function(Game) {
    var headerClouds = document.querySelector('.header-clouds');
    var isWeSeeClouds = true;
    var checkTime = null;

    function isWeSeeClouds300() {
      return window.pageYOffset < 300;
    }

    function moveClouds() {
      if (isWeSeeClouds) {
        var num = window.pageYOffset;
        headerClouds.style.top = num / 4 + 0 + 'px';
        headerClouds.style.backgroundPosition = num / 3 + 0 + 'px';
      }
    }

    function checkVisbility() {
      if (isWeSeeClouds300()) {
        isWeSeeClouds = true;
        game.setGameStatus(Game.Verdict.CONTINUE);
      } else {
        window.dispatchEvent(new CustomEvent('disappear'));
      }
    }

    function initScroll() {
      window.addEventListener('scroll', function() {
        moveClouds();

        if (checkTime) {
          return false;
        }
        checkTime = setTimeout(function() {
          checkVisbility();
          checkTime = null;
        }, 50);
      });

      window.addEventListener('disappear', function() {
        isWeSeeClouds = false;
        game.setGameStatus(Game.Verdict.PAUSE);
      });
    }

    initScroll();

    var game = new Game(document.querySelector('.demo'));
    game.initializeLevelAndStart();
    game.setGameStatus(Game.Verdict.INTRO);

  });
