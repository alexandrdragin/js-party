'use strict';

//вызов ананимной функции
 (function() {

//>>Прячет блок с фильтрами .reviews-filter, добавляя ему класс invisible.
var reviewForm = document.querySelector('.reviews-filter');
reviewForm.classList.add("invisible");
//reviewForm.style.display = "none";


//мап для раздвижки звезд по css
var ratingClass = {
'1': 'review-rating-one',
'2': 'review-rating-two',
'3': 'review-rating-three',
'4': 'review-rating-four',
'5': 'review-rating-five',
};

//контейнер и шаблон для вставки данных
var reviewContainer = document.querySelector('.reviews-list')
var reviewTemplate = document.getElementById('review-template')

var reviewList = document.querySelector('.reviews-list');

//фрагмент для ускорения загрузки
var reviewsFragment = document.createDocumentFragment();

//массив для иттерации
reviews.forEach(function(review, i){

  //кланирование шаблона на каждой иттерации
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


//загрузка во фрагмент
reviewsFragment.appendChild(newReviewData);
});

//reviewList.appendChild(newReviewData);


//>>>Обработчик ошибки: добавьте блоку отзыва .review класс review-load-failure.
reviewContainer.onerror = function(evt) {
reviewContainer.classList.add('review-load-failure');}

//загрузка фрагметна
reviewContainer.appendChild(reviewsFragment);


reviewForm.classList.remove('invisible');

})();


------------------------------
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

  var reviews;

//  фукция вывода(отрисовки) списка отелей
  function loadingReviews(reviews) {
    reviewForm.classList.remove('invisible');

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
  reviewContainer.appendChild(reviewsFragment);

  //  >>>Обработчик ошибки: добавьте блоку отзыва .review класс review-load-failure.
  reviewContainer.onerror = function(event) {
    reviewContainer.classList.add('review-load-failure');
  };

//  в случаее таймаута
  function showLoadFailure() {
    reviewContainer.classList.add('review-load-failure');
  }

//  функция загрузки по xhr
  function LoadXHL(callback) {
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

  //  закртие функции загрузки по xhr
  }

  // правила сортировки
  function filterReviews(reviews, filterID)
    var filteredReviews = reviews.slice(0);
    switch (filterID) {
      case 'reviews-recent':
        filteredReviews = filteredReviews.sort(function(a, b){
          if (a.date )
        })

      case 'reviews-good': rating
      case 'reviews-bad':  rating
      case 'reviews-popular': review-rating
        break;
      default:
        filteredReviews = reviews.slice(0);
    }

//  функция включающая сортировку
              function setActifveFilter(filterID)
              {
                var filteredReviews = filterReviews(reviews, filterID)
                //возвращаем и отрисовываем
                loadingReviews(filteredReviews);
              }
              startFilters();
  //  loadingReviews();
  loadingReviews(function(loadedReviews){
      reviews = loadedReviews;
      setActifveFilter('reviews-all');
  });


  reviewForm.classList.remove('invisible');

})();
