'use strict';

//  вызов анонимной функции
(function() {

  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var photogalleryContainer = document.querySelector('.photogallery');
  var gallery = document.querySelector('.overlay-gallery');
  var closeButtton = gallery.querySelector('.overlay-gallery-close');


  function doesHaveParent(element, className) {
    do {
      if (element.classList.contains(className)) {
        return !element.classList.contains('gallery-nophoto');
      }
      element = element.parentElement;
    } while (element);

    return false;
  }

  function hideGallery() {
    gallery.classList.add('invisible');
    closeButtton.removeEventListener('click', closeHandler);
    document.body.removeEventListener('keydown', keyHandler);
  }

  function closeHandler(event) {
    event.preventDefault();
    hideGallery();
  }

  function showGallery() {
    gallery.classList.remove('invisible');
    closeButtton.addEventListener('click', closeHandler);
    document.body.addEventListener('keydown', keyHandler);
  }

  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        console.log('Left');
        break;
      case Key.RIGHT:
        console.log('Right');
        break;
      case Key.ESC:
        hideGallery();
        break;
      default: break;
    }
  }

  photogalleryContainer.addEventListener('click', function(evt) {
    if (doesHaveParent(evt.target, 'photogallery' )) {
      showGallery();
    }
  });


})();

/*  Создайте модуль js/gallery.js и реализуйте в нем базовый функционал для фотогалереи.

+Добавьте с помощью делегирования обработчик кликов по фотографиям в галерее,
+который убирает класс invisible у блока .overlay-gallery.
+Когда блок .overlay-gallery появляется, должен добавляться обработчик клавиатурных событий:
+Нажатие на Esc должно закрывать блок.
+Нажатия на стрелки влево и вправо должны вызывать функции переключения слайдов галереи.
Сами функции пока что реализовывать не нужно, достаточно чтобы эти функции выводили в консоль направление переключения.
+Добавьте обработчик клика по крестику в блоке .overlay-gallery-close, который будет скрывать этот блок.
+Когда блок .gallery-overlay скрывается, обработчики событий должны удаляться.
*/
