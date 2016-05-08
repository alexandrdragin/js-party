'use strict';

define(function() {
  var GalleryVideo = Backbone.View.extend({

    initialize: function() {
      this._onClickVideo = this._onClickVideo.bind(this);
    },

    events: {
      'click': '_onClickVideo'
    },

    render: function() {
      var videoElement = document.createElement('video');
      videoElement.src = this.model.get('url');
      videoElement.autoplay = true;
      videoElement.poster = this.model.get('preview');
      videoElement.loop = true;
      videoElement.controls = false;
      videoElement.addEventListener('click', this._onClickVideo);
      this.el = videoElement;
    },

    _onClickVideo: function(evt) {
      if (evt.target === this.el) {
        if (this.el.paused) {
          this.el.play();
        } else {
          this.el.pause();
        }
      }
    }
  });

  return GalleryVideo;
});
