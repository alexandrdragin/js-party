
постраничное изображение списка отелей
arr.slice(0) копирует массив
array.slice(от число, до число)

удаление 3 из  массива
var arr =[1,2,3,4,5]
var first = arr.slice(0,2);
arr = arr.splice(3);
arr = first.concat(arr)



var pageSize = 9;
var currentPage = 0;

рендерхотелс(хотелсТоРендер, pageNumber)

//если ничего не передалось то 0
pageNumber = pageNumber || 0;


 47?
 события вдеталях
 и несколько обработчиков

 someShit.onclick
 someShit.addEventListener('click', function(evt) {
   что происходит
 })

 ////////////////////////////////

function isNextPageAvailble() {
    return currentPage < Math.ceil(reviews.length / pageSize);
}

function isAtTheBottom() {
  var gap = 100;
  // проверяем элемент относительно вью порта
  return reviewsContainer.getBoundingClientRect().bottom - gap <= window.innerHeight;
}

function initScroll(){
  window.addEventListener('scroll', function(){
    if(isAtTheBottom() && isNextPageAvailble()){
      loadingReviews(currentReviews , currentPage++, false)
    }
  });
}


 /////////


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
   var pageSize = 3;

 //  контейнер для вставки данных
   var reviewContainer = document.querySelector('.reviews-list');
   //  шаблон для загрузки
   var reviewTemplate = document.getElementById('review-template');
   //  фрагмент для ускорения загрузки
   var reviewsFragment = document.createDocumentFragment();

   var reviews;
   var currentPage = 0;
   var currentReviews;

   reviewForm.classList.remove('invisible');

   function loadingReviews(reviews, pageNumber, replace) {
     // проверям тип переменной + тернарный оператор(что делать если выполняться:нет;)
     replace = typeof replace !=='underfined' ? replace : true;
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
     reviews = reviews.slice(reviewsFrom, reviewsTo);

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
             // console.log(data);
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
           //  вообщем дата вот в таком формате 2013-12-03 не очень понимаю к чему ее привести нужно чтобы сравнивать
           if (a.date > b.date || (b.date && a.date === 'underfined')) {
             return -1;
           }

           if (a.date < b.date || (b.date && a.date === 'underfined')) {
             return 1;
           }

           if (a.date === b.date) {
             return 0;
           }
         });

         break;

       case 'reviews-good':

         filteredReviews = filteredReviews.filter(function(a) {
           return a.rating > 3;
         });
         filteredReviews = filteredReviews.sort(function(a, b) {
           if (a.rating > b.rating || (b.rating && a.rating === 'underfined')) {
             return -1;
           }

           if (a.rating < b.rating || (b.rating && a.rating === 'underfined')) {
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
           if (a.rating > b.rating || (b.rating && a.rating === 'underfined')) {
             return 1;
           }

           if (a.rating < b.rating || (b.rating && a.rating === 'underfined')) {
             return -1;
           }

           if (a.rating === b.rating) {
             return 0;
           }
         });

         break;

       case 'reviews-popular':

         filteredReviews = filteredReviews.sort(function(a, b) {
           if (a.review-rating > b.review-rating || (b.review-rating && a.review-rating === 'underfined')) {
             return 1;
           }

           if (a.review-rating < b.review-rating || (b.review-rating && a.review-rating === 'underfined')) {
             return -1;
           }

           if (a.review-rating === b.review-rating) {
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

 // функция включения фильтров(находит по классу)
   function startFilters() {
     var filtersElements = document.querySelectorAll('.reviews-filter-item');

     // добовлям обработчик события которая запускает сетАктивФильтер
     filtersElements.addEventListener('click', function(evt) {
       var clickedFilter = evt.target;
       setActiveFilter(clickedFilter.id);
     });
   }

   //  функция включающая сортировку берет список ревью фильтурет по правилам
   function setActiveFilter(filterID) {
     /*
     var filteredReviews = filterReviews(reviews, filterID);
     //  возвращаем и отрисовываем
     loadingReviews(filteredReviews, currentPage, true);
     */
     currentReviews = filterReviews(reviews, filterID);
     currentPage = 0;
     loadingReviews(currentReviews, currentPage, true);
   }

   startFilters();

   loadingReviews(function(loadedReviews) {
     reviews = loadedReviews;
     setActiveFilter('reviews-all');
   });

 // когда загрузилось эта функция принимает data, сохраняет и отрисовывает их
 // loadingReviews();
   loadXHR(function(loadedReviews) {
     reviews = loadedReviews;
   //  loadingReviews = (loadedReviews);
   });

 })();
