/* global Backbone: true  */

'use strict';

define([
  'models/review'
], function(ReviewModel) {
  /**
   * @constructor
   * @param {Object} attributess
   * @param {Object} options
   */
  var ReviewsCollection = Backbone.Collection.extend({
    model: ReviewModel,
    url: 'data/reviews.json'
  });

  return ReviewsCollection;
});
