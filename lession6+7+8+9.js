6
События
Модель обработки событий DOM Level 2:
обработчики событий, фазы события, объект Event.
 Делегирование событий


 arr.slice(0, 5) = []/выбока от 0 до 4
arr.slice(0, -5) = []/ограничивает спраправа количество элементов

DOM Level 2

множественные удаляеммые
фазы
собственные события

obj.addEventListener('click', function(evt)) {

};

window.addEventListener('click', function(evt) {
//evt.preventDefault();
     console.log(evt.target);
   });

obj.removeEventListener('click', function(evt)) { //удалить только если функция именная

}

троттл


делегирование
всплытие
или на фазе захвата
те захват испускание и всплытие(третий параметр - фалс на всплытие/ тру на захвате)



кастомные события
CustomEvent
var newEvent = new CustomEvent ('nameEvent');
window.dispatchEvent(newEvent);
window.addEventListener('nameEvent', function(){

});

// для сафари
var newEvent = document.createEvent('CustomEvent');
newEvent.initCustomEvent('evettype', false);

window.addEventListener('evettype', function () {

});

window.dispatchEvent(evt);

//
createEvent('Event');
initEvent('click');



7 ооп инкапсуляция

рефакторинг - расшенение фунционала без боли
function Photo(data) {
  this._data = data;
}

Photo.prototype.rednerthatshit


[].forEach.call(КОНТЕКСТ, ФункцияФорича {});

привязывай аддЕвенты!


8 ооп полиморфизм наследование

.shift уменьшает массив на элемент
var el;
while ((el = массив.shift())){

}

9

защита
mvc
localstorage

window.location;  в адрестную строку
history.pushState(null, null, 'www.com'); //дописывается в адресс





location.hash = location.hash.indexOf('map') !== -1 ? '' : 'map'; // дописывает в хеш
//слово мап или ничего если мап уже есть
// это вместо show

window.addEventListener('hashchange', this._onHashChange.bind(this)); // новый обработчик
this.restoreFromHash()

.prototype._onHashChange = function() {
  this.restoreFromHash(); //  вызываем при изменении страницы и после загрузки
}

.prototype.restoreFromHash = function() {
   this.show(location.hash.indexOf('map') === -1); // метод проверки есть ли в адресе слово MAP после # 
   //оправляет false или тrue
}





window.addEventListener('hashchange', function() {
  restoreFromHash();
});

function restoreFromHash() {
  console.log(nowCreatedObjectPhoto);
  //проверка
}




JSON.stringify(ОБЬЕКТ) любой обьект в ждейсон
