var el = document.querySelector(".compare");

if (el) {
  el.classList.add("compare--js");
  var after = el.querySelector(".compare__item--after");
  var afterImage = after.querySelector("compare__img");
  var input = el.querySelector(".compare__input");
  var pin = el.querySelector(".compare__pin");
  var beforeLabel = el.querySelector(".compare__label--before");
  var afterLabel = el.querySelector(".compare__label--after");

  var setStyles = function (val) {
    pin.style.left = val;
    after.style.width = val;
  };

  var setAfterImagePos = function () {
    if (window.innerWidth < 768) {
      beforeLabel.click();
    } else {
      var imgWidth = afterImage.clientWidth;
      var elWidth = el.clientWidth;
      afterImage.style.right = "${(elWidth - imgWidth) / 2}px";
    }
  };

  var inputHandler = function () {
    etStyles("${input.value}%");
  };

  input.addEventListener("input", inputHandler);
  input.addEventListener("change", inputHandler);
  beforeLabel.addEventListener("click", function () { setStyles("0") });
  afterLabel.addEventListener("click", function () { setStyles("100%") });
  window.addEventListener("resize", setAfterImagePos);

  setAfterImagePos();
  if (window.innerWidth >= 768) {
    setStyles("50%");
  }
});
