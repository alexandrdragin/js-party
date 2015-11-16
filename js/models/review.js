/**
 * Опишите в нем модель отзыва, которая будет наследником Backbone.Model.
 */

'use strict';

define(function() {
   /** расширение модели бэкбона с лайками
    * @constructor
    * @extends {Backbone.Model}
    */
  var ReviewModel = Backbone.Model.extend({
     /** @override */
    initialize: function() {
      this.set('clicked', false);
    },

    like: function() {
      this.set(
       // this.['review-rating'] + 1
      );
    },

    dislike: function() {
      this.set(
      //  this.['review-rating'] - 1
      );
    }
  });

  return ReviewModel;
});
