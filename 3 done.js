'use strict';

//  вызов ананимной функции
(function() {

//  Прячет блок с фильтрами .reviews-filter, добавляя ему класс invisible.
  var reviewForm = document.querySelector('.reviews-filter');
  reviewForm.classList.add('invisible');

//  предустановка редистейтов для xml
  var ReadyState = {
    'UNSEND': 0,
    'OPEN': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

//  мап для раздвижки звезд по css
  var ratingClass = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  //  константа таймаута
  var requestFailureTimeout = 10000;

//  контейнер для вставки данных
  var reviewContainer = document.querySelector('.reviews-list');
  //  шаблон для загрузки
  var reviewTemplate = document.getElementById('review-template');
  //  фрагмент для ускорения загрузки
  var reviewsFragment = document.createDocumentFragment();

  var originalReviews;

  reviewForm.classList.remove('invisible');

  function loadingReviews(reviews) {

    reviewContainer.classList.remove('invisible');

//    массив для иттерации
    reviews.forEach(function(review) {

    //  клонирование шаблона на каждой иттерации
      var newReviewData = reviewTemplate.content.children[0].cloneNode(true);
      newReviewData.querySelector('.review-rating').classList.add(ratingClass[review['rating']]);
      newReviewData.querySelector('.review-text').textContent = review['description'];
      newReviewData.querySelector('.review-author').title = review['author']['name'];

      var authorImages = newReviewData.querySelector('.review-author');
      var tempImages = new Image();
      tempImages.onload = function() {
        authorImages.src = review['author']['picture'];
        authorImages.width = 124;
        authorImages.height = 124;
      };

      tempImages.onerror = function() {
        authorImages.remove();
      };

      tempImages.src = review['author']['picture'];

  //    загрузка во фрагмент
      reviewsFragment.appendChild(newReviewData);
    });

//  загрузка фрагметна
// чистим контейнер
    reviewContainer.innerHTML = '';
    reviewContainer.appendChild(reviewsFragment);
  }

//  в случаее таймаута
  function showLoadFailure() {
    reviewContainer.classList.add('review-load-failure');
  }

//  функция загрузки по xhr
  function loadXHR(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = requestFailureTimeout;
    xhr.open('get', 'data/reviews.json');
    xhr.send();

    //  обработчик изменений состояний
    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          reviewContainer.classList.add('reviews-list-loading');
          break;

        case ReadyState.DONE:
        default:
          if (loadedXhr.status === 200 || loadedXhr.status === 304) {
            var data = loadedXhr.response;
            reviewContainer.classList.remove('reviews-list-loading');
        //  хелпер переводящий в формат джейсона
            callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showLoadFailure();
          }
          break;
      }
    };
// обработчик таймаута и ошибки
    xhr.ontimeout = function() {
      showLoadFailure();
    };
    xhr.onerror = function() {
      showLoadFailure();
    };
//  закрытие функции загрузки по xhr
  }

  //  >>>Обработчик ошибки: добавьте блоку отзыва .review класс review-load-failure.
  reviewContainer.onerror = function() {
    reviewContainer.classList.add('review-load-failure');
  };

  // правила сортировки
  function filterReviews(reviews, filterID) {
    // копирование изначального списка отелей
    var filteredReviews = reviews.slice(0);
    switch (filterID) {
      case 'reviews-recent':
        filteredReviews = filteredReviews.sort(function(a, b) {
          var firstDate = (new Date(a.date)).valueOf();
          var secondDate = (new Date(b.date)).valueOf();
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
        filteredReviews = filteredReviews.filter(function(a) {
          return a.rating > 3;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
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
        filteredReviews = filteredReviews.filter(function(a) {
          return a.rating < 3;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
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
        filteredReviews = filteredReviews.sort(function(a, b) {
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

      default:
        filteredReviews = reviews.slice(0);
        break;
    }
    return filteredReviews;
  }

  //  функция включающая сортировку берет список ревью фильтурет по правилам
  function setActiveFilter(filterID) {
    var filteredReviews = filterReviews(originalReviews, filterID);
    //  возвращаем и отрисовываем
    loadingReviews(filteredReviews);
  }

// функция включения фильтров(находит по классу)
  function startFilters() {
    var filterElements = document.querySelectorAll('.reviews-filter-item');
    for (var i = 0, l = filterElements.length; i < l; i++) {

      // добовлям обработчик события которая запускает сетАктивФильтер
      filterElements[i].onclick = function(evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.getAttribute('for'));
        // и чекед переставляет местами
          // document.querySelector('.reviews-filter-item.checked').setAttribute('checked', false);
          // document.querySelector('input[name="reviews"]').setAttribute('checked', false);
          // move('.reviews-filter-item.checked');
        clickedFilter.setAttribute('checked', true);
      };
    }
  }

  startFilters();

// когда загрузилось эта функция принимает data, сохраняет и отрисовывает их
  loadXHR(function(loadedReviews) {
    originalReviews = loadedReviews;
    loadingReviews(loadedReviews);
  });

})();
