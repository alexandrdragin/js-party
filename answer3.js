/*
Доработайте модуль js/reviews.js:
+Отключите загрузку данных из файла data/reviews.js убрав подключение этого скрипта из index.html.
+Загрузите данные из файла data/reviews.json по XMLHttpRequest.
+Пока длится загрузка файла, покажите прелоадер, добавив класс .reviews-list-loading блоку .reviews.
+Когда загрузка закончится, уберите прелоадер и покажите список отзывов, как в предыдущем задании.
+Если загрузка закончится неудачно (ошибкой сервера или таймаутом), покажите предупреждение об ошибке, добавив блоку .reviews класс reviews-load-failure.

Напишите обработчики событий для фильтров, так, чтобы они фильтровали загруженный список отзывов следующим образом:
  Все — показывает список отзывов в таком виде, в котором он был загружен.
  Недавние — показывает список отзывов, оставленных за последние полгода, отсортированных по убыванию даты (поле date).
  Хорошие — с рейтингом не ниже 3, отсортированные по убыванию рейтинга (поле rating).
  Плохие — с рейтингом не выше 2, отсортированные по возрастанию рейтинга.
  Популярные — отсортированные по убыванию оценки отзыва (поле reviewRating).
*/

'use strict';

//вызов ананимной функции
(function() {

//предустановка редистейтов для xml
var ReadyState = {
  'UNSEND' : 0,
  'OPEN' : 1,
  'HEADERS_RECEIVED' : 2,
  'LOADING' : 3,
  'DONE' : 4
};

//мап для раздвижки звезд по css
var ratingClass = {
'1': 'review-rating-one',
'2': 'review-rating-two',
'3': 'review-rating-three',
'4': 'review-rating-four',
'5': 'review-rating-five',
};

var RequestFailureTimeout = 10000;

//>>Прячет блок с фильтрами .reviews-filter, добавляя ему класс invisible.
var reviewForm = document.querySelector('.reviews-filter');
reviewForm.classList.add("invisible");

//контейнер
var reviewContainer = document.querySelector('.reviews-list')

var reviewList = document.querySelector('.reviews-list');

//"author": {↵ "name": "Иванов Иван",↵ "picture": "img/user-1.jpg"↵ },↵
// "date": "2015-08-12",↵
//"review-rating": 10,↵ "rating": 2,↵ "description": "Плохая игра: слишком сильно затягивает и нев

//попзже обьясню
var reviews;

function loadingReviews(reviews){
  reviewForm.classList.remove('invisible');

  //шаблон для загрузки
  var reviewTemplate = document.getElementById('review-template')
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

          tempImages.onerror = function(){
            authorImages.remove();
          };

          tempImages.src = review['author']['picture'];


          //загрузка во фрагмент
          reviewsFragment.appendChild(newReviewData);
          });

      //загрузка фрагметна
      reviewContainer.appendChild(reviewsFragment);
};


//>>>Обработчик ошибки: добавьте блоку отзыва .review класс review-load-failure.
reviewContainer.onerror = function(evt) {
reviewContainer.classList.add('review-load-failure');}

//в случаее таймаута
function showLoadFailure() {
reviewContainer.classList.add('review-load-failure');}

//функция загрузки по xhr
  function LoadXHL(callbackhell) {
      var xhr = new XMLHttpRequest();
      //xhr.ontimeout = (function () {}, 10);
      xhr.timeout = RequestFailureTimeout;
      xhr.open('get', 'data/reviews.json');
      xhr.send();


          //обработчик изменений состояний
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
                    if (loadedXhr.status == 200 || loadedXhr.status == 304) {
                      var data = loadedXhr.response;
                      reviewContainer.classList.remove('reviews-list-loading');
                      //хелпер переводящий в формат джейсона
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
              }
              xhr.onerror = function() {
                showLoadFailure();
              }

        //закртие функции загрузки по xhr
            };

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


            //функция включающая сортировку
            function setActifveFilter(filterID)
            {
              var filteredReviews = filterReviews(reviews, filterID)
              //возвращаем и отрисовываем
              loadingReviews(filteredReviews);
            }

            startFilters();
//loadingReviews();
loadingReviews(function(loadedReviews){
    reviews = loadedReviews;
    setActifveFilter('reviews-all');

});


})();
