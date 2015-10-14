
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

 Это добавка страницы по скролу!

// проверка есть ли след страница(те проверяет последняя отрисованная страница
// должна быть меньше количество ревью поделенная на размер страницы + округление вврех)
function isNextPageAvailble() {
    return currentPage < Math.ceil(reviews.length / pageSize);
}

// должен вернуть тру или фалс если внизу
// innerHeight - размер вьюпорта, gap чтоб не на самом низу включалось
// getBoundingClientRect - проверят расположение обьекта относительно вьюпорта
function isAtTheBottom() {
  var gap = 100;
  // проверяем элемент относительно вью порта
  return reviewsContainer.getBoundingClientRect().bottom - gap <= window.innerHeight;
}

function checkNextPage() {
  if (isAtTheBottom() && isNextPageAvailble()) {
    window.dispatchEvent(new CustomEvent('loadneeded'));
  }
}

функция
function initScroll(){
  var someTimeout;
  window.addEventListener('scroll', function(){
    clearTimeout(someTimeout);
    someTimeout = someTimeout(checkNextPage, 100)
  });


  window.addEventListener('loadneeded', function(){
    loadingReviews(filteredReviews, currentPage++, false);
  });
}

--------------

простой вариант
function initScroll(){
    window.addEventListener('scroll', function(){
      if(isAtTheBottom() && isNextPageAvailble()){
      loadingReviews(filteredReviews , currentPage++, false);
     }
  });
}

function initScroll();
 /////////
