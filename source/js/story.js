"use strict";

(() => {
  const el = document.querySelector(".compare");

  if (el) {
    el.classList.add("compare--js");
    const after = el.querySelector(".compare__item--after");
    const afterImage = after.querySelector("compare__img");
    const input = el.querySelector(".compare__input");
    const pin = el.querySelector(".compare__pin");
    const beforeLabel = el.querySelector(".compare__label--before");
    const afterLabel = el.querySelector(".compare__label--after");

    const setStyles = (val) => {
      pin.style.left = val;
      after.style.width = val;
    };

    const setAfterImagePos = () => {
      if (window.innerWidth < 768) {
        beforeLabel.click();
      } else {
        const imgWidth = afterImage.clientWidth;
        const elWidth = el.clientWidth;
        afterImage.style.right = "${(elWidth - imgWidth) / 2}px";
      }
    };

    const inputHandler = () => setStyles("${input.value}%");

    input.addEventListener("input", inputHandler);
    input.addEventListener("change", inputHandler);
    beforeLabel.addEventListener("click", () => setStyles("0"));
    afterLabel.addEventListener("click", () => setStyles("100%"));
    window.addEventListener("resize", setAfterImagePos);

    setAfterImagePos();
    if (window.innerWidth >= 768) {
      setStyles("50%");
    }
  }
})();
