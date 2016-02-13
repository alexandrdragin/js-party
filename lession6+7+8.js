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



7

рефакторинг - расшенение фунционала без боли
function Photo(data) {
  this._data = data;
}

Photo.prototype.rednerthatshit






8
графика и медиа
-svg
-canvas
-HTMLMediaElement
