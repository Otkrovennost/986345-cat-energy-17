// Параметры Яндекс.карты
var centers = {
  mobile: [59.938631, 30.323055],
  tablet: [59.938715, 30.323078],
  desktop: [59.938590, 30.319770]
};
var zooms = {
  mobile: 17,
  tablet: 18,
  desktop: 17
};
var mapBlock = document.querySelector(".map");
var mapPoster = mapBlock.querySelector(".map__picture");
var mapPreviewPlacemark = mapBlock.querySelector(".map__placemark--preview");
var template = "<div class=\"map__placemark\"></div>";

window.ymaps.ready(function () {
  var map = new window.ymaps.Map(mapBlock.id, {
    center: centers.mobile,
    controls: [],
    zoom: zooms.mobile
  });
  var setCoords = function (width) {
    var center = centers.mobile;
    var zoom = zooms.mobile;
    if (width >= 768) {
      center = centers.tablet;
      zoom = zooms.tablet;
    }
    if (width >= 1300) {
      center = centers.desktop;
      zoom = zooms.desktop;
    }
    console.log(center, zoom);
    map.setCenter(center, zoom);
  };

  setCoords();
  map.geoObjects.add(new window.ymaps.Placemark([59.93886, 30.32273], null, {
    iconLayout: window.ymaps.templateLayoutFactory.createClass(template)
  }));
  map.behaviors.disable("scrollZoom");

  window.addEventListener("resize", function () {
    setCoords(window.innerWidth);
  });

  // Скрытие замещающего изображения
  mapPoster.classList.add("hidden");
  mapPreviewPlacemark.add("hidden");
});
