// Параметры Яндекс.карты
var mapSettings = {
  center: [59.93912, 30.3215],
  controls: [],
  zoom: 17
};
var mapBlock = document.querySelector(".map");
var mapPoster = mapBlock.querySelector(".map__img");
var template = "<div class=\"map__placemark\"></div>";

window.ymaps.ready(function () {
  var map = new window.ymaps.Map(mapBlock.id, mapSettings);

  map.geoObjects.add(new window.ymaps.Placemark([59.93937, 30.32117], null, {
    iconLayout: window.ymaps.templateLayoutFactory.createClass(template)
  }));
  map.behaviors.disable("scrollZoom");

  // Скрытие замещающего изображения
  mapPoster.classList.add("hidden");
});
