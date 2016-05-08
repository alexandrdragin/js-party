'use strict';

(function() {

  /**
   * @type {Object.<string, string>}
   */
   //  мап для раздвижки звезд по css
  var ratingClass = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  /**
   * @type {Element}
   */
   //  шаблон для загрузки
  var reviewTemplate = document.getElementById('review-template');

  /**
   * Конструктор объектов типа Review. Кроме создания объекта, добавляет каждому объекту
   * свойство data_ и фиксирует контекст у обработчика события клика.
   * @constructor
   * @param {Object} data
   */
  var Review = function(data) {
    this._data = data;
    this._element = null;

    //this._onClick = this._onClick.bind(this);
  };

  /**
   * Создание DOM-элемента, отрисовка его в переданный контейнер и добавление обработчика события клика.
   * По большей части, не отличается от ранее написанного кода, кроме способа обращения к данным. Теперь
   * они берутся не из аргумента итератора, а хранятся в объекте Review в свойстве data_.
   * @param  {Element|DocumentFragment} container
   */
  Review.prototype.render = function(container) {
    // Клонирование нового объекта для Review из шаблона и заполнение его реальными
    // данными, взятыми из свойства data_ созданного конструктором.
    var newReviewData = reviewTemplate.content.children[0].cloneNode(true);

    newReviewData.querySelector('.review-rating').classList.add(ratingClass[this._data['rating']]);
    newReviewData.querySelector('.review-text').textContent = this._data['description'];

    // Добавление в контейнер.
    container.appendChild(newReviewData);

    if (this._data['author']['picture']) {
      var authorImages = newReviewData.querySelector('.review-author');
      var tempImages = new Image();
      tempImages.onload = function() {
        authorImages.src = this._data['author']['picture'];
        authorImages.title = this._data['author']['name'];
        authorImages.width = 124;
        authorImages.height = 124;
      }.bind(this);

      tempImages.onerror = function() {
        authorImages.remove();
      };

      tempImages.src = this._data['author']['picture'];

      this._element = newReviewData;
      // Обработчик клика
      this._element.addEventListener('click', this._onClick);
    }
  };

  /**
   * Удаление DOM-элемента отеля и удаление обработчика события клика.
   */
  Review.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  /**
   * Возвращает список фотографий текущего Review, получив его из объекта data_.
   * @return {Array.<string>}
   */
  Review.prototype.getPhotos = function() {
    return this._data.pictures;
  };

// обратотчик клику по фото(перенес это блок внутьрь gallery)
//  Review.prototype._onClick = function() {
//    var galleryEvent = new CustomEvent('showgallery', { detail: { reviewElement: this }} );
//    console.log(this);
//    window.dispatchEvent(galleryEvent);
//  }

  // Экспорт конструктора объекта Review в глобальную область видимости.
  window.Review = Review;

})();
