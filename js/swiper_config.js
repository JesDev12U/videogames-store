const swipers = new Swiper(".videogame-showcase", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    depth: 500,
    modifer: 1,
    slidesShadows: true,
    rotate: 0,
    stretch: 0,
  },
});

console.log(swipers);

//Creamos un manejador para hacer una misma referencia al listener
function createMouseOverHandler(videogame) {
  return function () {
    mouseOverVideogame(videogame);
  };
}

function createMouseLeaveHandler(videogame) {
  return function () {
    mouseLeaveVideogame(videogame);
  };
}

function videogamesSlide() {
  swipers.forEach((swiper, i) => {
    swiper.slides.forEach((slide, index) => {
      let $videogame = slide.querySelector(".videogame");

      // Remueve los eventos antes de añadirlos para evitar duplicados
      if ($videogame.mouseOverHandler) {
        $videogame.removeEventListener(
          "mouseover",
          $videogame.mouseOverHandler
        );
      }
      if ($videogame.mouseLeaveHandler) {
        $videogame.removeEventListener(
          "mouseleave",
          $videogame.mouseLeaveHandler
        );
      }

      if (index === swiper.realIndex) {
        // Solo el slide activo debería tener habilitado el efecto de girar
        $videogame.mouseOverHandler = createMouseOverHandler($videogame);
        $videogame.mouseLeaveHandler = createMouseLeaveHandler($videogame);
        $videogame.addEventListener("mouseover", $videogame.mouseOverHandler);
        $videogame.addEventListener("mouseleave", $videogame.mouseLeaveHandler);
        document.querySelectorAll(".btn-buy")[i].dataset.videogame =
          swiper.realIndex;
      } else {
        mouseLeaveVideogame($videogame);
      }
    });
    swiper.on("slideChange", () => {
      videogamesSlide();
    });
  });
}

videogamesSlide();
