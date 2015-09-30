/* задание
напишите валидацию формы отзыва, которая показывается в оверлее.
Нужно сделать валидацию обязательных текстовых полей и показывать снизу
список полей, значения которых нужно заполнить. В случае, если форма валидна,
 убирать блок со списком полей. В cookies сохранить оценку и имя пользователя.

NB! Всем cookies со значениями полей нужно указать срок жизни: сегодняшняя дата
 + количество дней, прошедших с вашего дня рождения (можно посчитать
с помощью еще одного объекта Date).
*/

(function() {

  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');



var allForm = document.querySelector('form.overlay.review-form');

var reviewName = document.getElementById("review-name");
var sReview = document.getElementById("review-text");
var radioVal = document.querySelector('input[name="review-mark"]:checked').value;

//значения по умолчанию

reviewName = docCookies.getItem("reviewNameCook");
radioVal = docCookies.getItem("radioValCook");

console.log(radioVal);
console.log(reviewName);

// написал проверку отправки формы но незнаю как ее прикрутить

allForm.onsubmit = function(event) {
            e.preventDefault();
           console.log("happened")

  function check(allForm) {
    var reviewName = reviewName.value;
    var sReview = sReview.value;
    var go = false;
    if (reviewName.length < 3)
       bad = "Имя слишком короткое" + "\n";
    if (reviewName.length > 32)
      bad = "Имя слишком длинное" + "\n";
    if (sReview.length < 3)
      bad = "Напишите побольше пожалуйста" + "\n";
    if (sReview.length > 52)
      bad = "Напишите поменше пожалуйста" + "\n";

    if (sReview.length === 0 || sReview === " ")
      bad = "Вы забыли написать что хотели" + "\n";
    if (reviewName.length === 0 || reviewName === " ") {
      bad = "имя забыли" + "\n" + bad;

      alert(bad);
      go = false;
    }
    go = true;
  }



  var now = new Date();
  var exDate = new Date(now.getTime() + (30 * 365 * 60 * 60 * 24 * 1000));


function setCookieFun (name, value, expires) {
        document.cookie = name + "=" + escape(value) +
          ((expires) ? "; expires=" + expires : "");
  };

setCookieFun("radioValCook", "radioVal.value", "exDate.toUTCString()");
setCookieFun("reviewNameCook", "reviewName.value", "exDate.toUTCString()");

// записывает в куки содержание как radioValCook=radioVal.value а не как цифру(


return check();
allForm.submit();

}
//



//появление формы
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

// скрытие формы
  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };



})();


/////////////////////////////////////////////////////









    






///
