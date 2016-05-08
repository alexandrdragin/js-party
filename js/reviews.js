'use strict';

//  вызов анонимной функции
define([
  'models/reviews',
  'views/review'
], function(ReviewsCollection, ReviewView) {

//  Прячет блок с фильтрами .reviews-filter, добавляя ему класс invisible.
  var reviewForm = document.querySelector('.reviews-filter');
  reviewForm.classList.add('invisible');

//  кнопка показать еще
  var reviewMore = document.querySelector('.reviews-controls-more');
  reviewMore.classList.remove('invisible');

  //  константа таймаута
  var requestFailureTimeout = 10000;
  var pageSize = 3;

  //  контейнер для вставки данных
  var reviewContainer = document.querySelector('.reviews-list');
  //  шаблон для загрузки

  var filteredReviews;
  var currentPage = 0;

  reviewForm.classList.remove('invisible');

  /**
   * новая сущность?
   * @type {ReviewsCollection}
   */
  var reviewsCollection = new ReviewsCollection();

   /**
    * хранит изначальное состояние данных ссервера
    * @type {Array.<Object>}
    */
  var initiallyLoaded = [];

   /**
    * Список отрисованных ревью. Используется для обращения к каждому
    * из ревью для удаления его со страницы.
    * @type {Array.<->}
    */
  var renderedReviews = [];

  /**
   * Выводит список ревью
   * @param {Array.<Object>} reviewsToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function loadingReviews(pageNumber, replace) {
    //  фрагмент для ускорения загрузки
    var reviewsFragment = document.createDocumentFragment();

    // проверям тип переменной + тернарный оператор(что делать если ? выполняться: нет;)
    replace = typeof replace !== 'undefined' ? replace : true;
    // нормализация документа(горантирует содержание)
    pageNumber = pageNumber || 0;

    // выбираем размер страницы
    var reviewsFrom = pageNumber * pageSize;
    var reviewsTo = reviewsFrom + pageSize;

    if (replace) {
      while (renderedReviews.length) {
        var reviewToRemove = renderedReviews.shift();
          // Важная особенность представлений бэкбона: remove занимается только удалением
          // обработчиков событий, по факту это метод, который нужен для того, чтобы
          // подчистить память после удаления элемента из дома. Добавление/удаление
          // элемента в DOM должно производиться вручную.
        reviewContainer.removeChild(reviewToRemove.el);
        reviewToRemove.remove();
      }
    }

    reviewsCollection.slice(reviewsFrom, reviewsTo).forEach(function(model) {
      var view = new ReviewView({ model: model });
      // render только создает элемент в памяти, после этого его нужно
      // добавить в документ вручную.
      view.render();
      reviewsFragment.appendChild(view.el);
      renderedReviews.push(view);
    });

//  загрузка фрагметна
    reviewContainer.appendChild(reviewsFragment);
  }

  /**
   * Добавляет класс ошибки контейнеру с отелями. Используется в случае
   * если произошла ошибка загрузки отелей или загрузка прервалась
   * по таймауту.
   */
  function showLoadFailure() {
    reviewContainer.classList.add('review-load-failure');
  }

  /**
   * Фильтрация списка ревью. Принимает на вход список ревью
   * и ID фильтра. В зависимости от переданного ID применяет
   * разные алгоритмы фильтрации. Возвращает отфильтрованный
   * список и записывает примененный фильтр в localStorage.
   * Не изменяет исходный массив.
   * @param {string} filterID
   * @return {Array.<Object>}
   */
  function filterReviews(filterID) {
    // копирование изначального списка отелей
    var list = initiallyLoaded.slice(0);
    switch (filterID) {
      // При сортировке по дате сравниваем валюОф а не сами даты
      // если данных нет то все идет вниз
      case 'reviews-recent':
        //filteredReviews = filteredReviews.sort(function(a, b) {
        list.sort(function(a, b) {
          var firstDate = (new Date(a.view)).valueOf();
          var secondDate = (new Date(b.view)).valueOf();
          if (firstDate > secondDate) {
            return -1;
          }

          if (firstDate < secondDate || (secondDate && firstDate === 'undefined')) {
            return 1;
          }

          if (firstDate === firstDate) {
            return 0;
          }
        });

        break;

      case 'reviews-good':
        list.filter(function(a) {
          return a.rating > 3;
        });
        list.sort(function(a, b) {
          if (a.rating > b.rating) {
            return -1;
          }

          if (a.rating < b.rating || (b.rating && a.rating === 'undefined')) {
            return 1;
          }

          if (a.rating === b.rating) {
            return 0;
          }
        });

        break;

      case 'reviews-bad':
      //  filteredReviews = filteredReviews.filter(function(a) {
        list.filter(function(a) {
          return a.rating < 3;
        });
        list.sort(function(a, b) {
          if (a.rating > b.rating) {
            return 1;
          }

          if (a.rating < b.rating || (b.rating && a.rating === 'undefined')) {
            return -1;
          }

          if (a.rating === b.rating) {
            return 0;
          }
        });

        break;

      case 'reviews-popular':
        list.sort(function(a, b) {
          if (a['review-rating'] > b['review-rating'] || (b['review-rating'] && a['review-rating'] === 'undefined')) {
            return 1;
          }

          if (a['review-rating'] < b['review-rating']) {
            return -1;
          }

          if (a['review-rating'] === b['review-rating']) {
            return 0;
          }
        });

        break;

    }

    /**
     * запись с помощью метода ресет(из бэкбона) в коллекцию
     */
    reviewsCollection.reset(list);
  }

  /**
   * Инициализация подписки на клики по кнопкам фильтра.
   * Используется делегирование событий: события обрабатываются на объекте,
   * содержащем все фильтры, и в момент наступления события, проверяется,
   * произошел ли клик по фильтру или нет и если да, то вызывается функция
   * установки фильтра.
   */

  function startFilters() {
    var filterElements = document.querySelector('.reviews-filter');
    filterElements['reviews'].value = parseURL();
    filterElements.addEventListener('click', function(evt) {
      if (evt.target.name === 'reviews') {
        location.hash = 'filters/' + evt.target.value;
      }
    });
  }

  function parseURL() {
    var filterHash = location.hash.match(/^#filters\/(\S+)$/);
    if (filterHash) {
      setActiveFilter(filterHash[1]);
      return filterHash[1];
    } else {
      setActiveFilter('sort-by-default');
      return 'sort-by-default';
    }
  }
  /**
   * Проверяет можно ли отрисовать следующую страницу списка отелей.
   * (те проверяет последняя отрисованная страница
   * должна быть меньше количество ревью поделенная на размер страницы + округление вврех)
   * @return {boolean}
   */
  function isNextPageAvailable() {
    var canShow = currentPage < Math.ceil(ReviewsCollection.length / pageSize);

    if (canShow) {
      reviewMore.classList.remove('invisible');
    } else {
      reviewMore.classList.add('invisible');
    }
  }

// подгрузка страниц по кнопке работает но не добавляет а перезаписывает
  function moreReview() {
    reviewMore.addEventListener('click', function() {
      if (isNextPageAvailable()) {
        loadingReviews(filteredReviews, currentPage++, false);
      }
    });
  }

  /**
   * Вызывает функцию сортировки, берет список ревью фильтурет по правилам с переданным fitlerID
   * @param {string} filterID
   */
  function setActiveFilter(filterID) {
    filterReviews(filterID);
    currentPage = 0;
    //  возвращаем и отрисовываем
    loadingReviews(currentPage, true);
    reviewMore.classList.remove('invisible');
  }

  moreReview();

// вызываю феч, в котором сохраняю бекап, вызываю подпиcки
  reviewsCollection.fetch({ timeout: requestFailureTimeout }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;
    window.addEventListener('hashchange', parseURL);
    startFilters();

  }).fail(function() {
    showLoadFailure();
  });

  return ReviewsCollection;

});
