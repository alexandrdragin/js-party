/* global Review: true  */

'use strict';

//  вызов анонимной функции
(function() {

//  Прячет блок с фильтрами .reviews-filter, добавляя ему класс invisible.
  var reviewForm = document.querySelector('.reviews-filter');
  reviewForm.classList.add('invisible');

//  кнопка показать еще
  var reviewMore = document.querySelector('.reviews-controls-more');
  reviewMore.classList.remove('invisible');

//  предустановка редистейтов для xml
  var ReadyState = {
    'UNSEND': 0,
    'OPEN': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  //  константа таймаута
  var requestFailureTimeout = 10000;
  var pageSize = 3;

  //  контейнер для вставки данных
  var reviewContainer = document.querySelector('.reviews-list');
  //  шаблон для загрузки

  //  фрагмент для ускорения загрузки
  var reviewsFragment = document.createDocumentFragment();

  var originalReviews;
  var filteredReviews;
  var currentPage = 0;

  reviewForm.classList.remove('invisible');

  function loadingReviews(reviewsToRender, pageNumber, replace) {
    // проверям тип переменной + тернарный оператор(что делать если ? выполняться: нет;)
    replace = typeof replace !== 'undefined' ? replace : true;
    // нормализация документа(горантирует содержание)
    pageNumber = pageNumber || 0;

    if (replace) {
      reviewContainer.classList.remove('invisible');
      // чистим контейнер
      reviewContainer.innerHTML = '';
    }

    // выбираем размер страницы
    var reviewsFrom = pageNumber * pageSize;
    var reviewsTo = reviewsFrom + pageSize;

    // и перезаписываем ее с таким размером слайсом
    reviewsToRender = reviewsToRender.slice(reviewsFrom, reviewsTo);

  //    массив для иттерации
    reviewsToRender.forEach(function(reviewData) {
      var newReviewData = new Review(reviewData);
      newReviewData.render(reviewsFragment);
      //renderedReviews.push(newReviewData);
    });

//  загрузка фрагметна
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
    filteredReviews = reviews.slice(0);
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

    localStorage.setItem('filterID', filterID);
    return filteredReviews;
  }

// функция включения фильтров(находит по классу) + делегирование
  function startFilters() {
    var filterElements = document.querySelector('.reviews-filter');
      // добовлям обработчик события которая запускает сетАктивФильтер
    filterElements.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      if (clickedFilter.hasAttribute('for')) {
        setActiveFilter(clickedFilter.getAttribute('for'));
      }
    });
  }

// проверка есть ли след страница(те проверяет последняя отрисованная страница
// должна быть меньше количество ревью поделенная на размер страницы + округление вврех)
  function isNextPageAvailble() {
    return currentPage < Math.ceil(originalReviews.length / pageSize);
  }

// подгрузка страниц по кнопке работает но не добавляет а перезаписывает
  function moreReview() {
    reviewMore.addEventListener('click', function() {
      if (isNextPageAvailble()) {
        loadingReviews(filteredReviews, currentPage++, false);
      }
    });
  }

  //  функция включающая сортировку берет список ревью фильтурет по правилам
  function setActiveFilter(filterID) {
    filteredReviews = filterReviews(originalReviews, filterID);
    currentPage = 0;
    //  возвращаем и отрисовываем
    loadingReviews(filteredReviews, currentPage, true);
  }

  startFilters();
  moreReview();

// когда загрузилось эта функция принимает data, сохраняет и отрисовывает их
  loadXHR(function(loadedReviews) {
    originalReviews = loadedReviews;
    setActiveFilter(localStorage.getItem('filterID') || 'reviews-all');
    reviewForm.querySelector('input[name="reviews"][value="' + localStorage.getItem('filterID') || 'reviews-all' + '"]').checked = true;
  });

})();
