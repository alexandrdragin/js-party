/*
Создайте модуль js/views/review.js.
 Опишите в нем представление отзыва в списке.
 Добавьте обработчики кликов по ссылкам «Да» и «Нет» в блоке опроса, полезен ли отзыв.
 Обработчики событий должны вызывать соответствующие обновления модели.
*/

'use strict';

define(function() {

  /**
   * мап для раздвижки звезд по css
   * @type {Object.<string, string>}
   */
  var ratingClass = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  /**
   * шаблон для загрузки
   * @type {Element}
   */
  var reviewTemplate = document.getElementById('review-template');

  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var ReviewView = Backbone.View.extend({
    /**
     * @override
     */
    initialize: function() {
      //this._onImageLoad = this._onImageLoad.bind(this);
      //this._onImageFail = this._onImageFail.bind(this);
      this._onModelLike = this._onModelLike.bind(this);
      //this._onModelDislike = this._onModelDislike.bind(this);
      this._onClick = this._onClick.bind(this);

      this.model.on('change:liked' || 'change:disliked', this._onModelLike);
    },

    /**
     * Маппинг событий происходящих на элементе на названия методов обработчиков
     * событий. ????
     * @type {Object.<string, string>}
     */
    events: {
      'click': '_onClick'
    },

    /**
     * Тег, использующийся для элемента представления.
     * @type {string}
     * @override
     */
    tagName: 'article',

    /**
     * Класс элемента.
     * @type {string}
     * @override
     */
    className: 'review',

  /**
   * Создание DOM-элемента, отрисовка его в переданный контейнер и добавление обработчика события клика.
   * По большей части, не отличается от ранее написанного кода, кроме способа обращения к данным. Теперь
   * они берутся не из аргумента итератора, а хранятся в объекте Review в свойстве data_.
   * @param  {Element|DocumentFragment} container
   */
    render: function() {
      // Клонирование нового объекта для Review из шаблона и заполнение его реальными
      // данными, взятыми из свойства data_ созданного конструктором.
      this.$el.html(reviewTemplate.content.children[0].cloneNode(true));

      this.$el.find('.review-rating').addClass(ratingClass[this.model.get('rating')]);
      this.$el.find('.review-text').text(this.model.get('description'));

      if (this.model.get('author')['picture']) {
        var authorImages = this.$el.find('.review-author')[0];
        var tempImages = new Image();
        tempImages.onload = function() {
          authorImages.src = this.model.get('author')['picture'];
          authorImages.title = this.model.get('author')['name'];
          authorImages.width = 124;
          authorImages.height = 124;
        }.bind(this);

        tempImages.onerror = function() {
          authorImages.remove();
        };

        tempImages.src = this.model.get('author')['picture'];

         // Обработчик клика ???
         // this._element.addEventListener('click', this._onClick);
        return this;
      }
    },

  /**
     * Обработчик кликов по элементу.
     * @param {MouseEvent} evt
     * @private
     */
    _onClick: function(evt) {
      var clickedElement = evt.target;

      // Клик по да/нет, добавляет класс.
      if (evt.target.classList.contains('review-quiz-answer') && evt.target.contains('Да')) {
        this.model.like();
        evt.target.classList.add('clicked');
      }
      if (evt.target.classList.contains('review-quiz-answer') && evt.target.contains('Нет')) {
        this.model.dislike();
        evt.target.classList.add('clicked');
      }
    },

    /**
     * @private
     */
    _onModelLike: function() {
      this._updateLike();
    },

    /**
     * @private
     */
    _updateLike: function() {
      var quiz = this.el.querySelector('.review-quiz');
      var quizAnswer = this.el.querySelector('.review-quiz-answer');

      if (quizAnswer.classList.toggle('clicked')) {
        quiz.classList.add('invisible');
      }
    },

    /**
     * Удаление DOM-элемента отеля и удаление обработчика события клика.
     */
    unrender: function() {
      this._element.parentNode.removeChild(this._element);
      this._element.removeEventListener('click', this._onClick);
      this._element = null;
    },

    /**
     * Возвращает список фотографий текущего Review, получив его из объекта data_.
     * @return {Array.<string>}
     */
    getPhotos: function() {
      return this.model.get.pictures;
    }
  });

  // Экспорт конструктора объекта Review в глобальную область видимости.
  return ReviewView;

});
