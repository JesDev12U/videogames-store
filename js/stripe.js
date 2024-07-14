import stripe_keys from "./stripe_keys.js";

const API_PRODUCTS = "https://api.stripe.com/v1/products";
const API_PRICES = "https://api.stripe.com/v1/prices";
const $temSwiperContainer = document.querySelector(
  ".tem-swiper-container"
).content;
const $temSwiperSlide = document.querySelector(".tem-swiper-slide").content;
const $fragment = document.createDocumentFragment();
let products;
let prices;
let swipers;

const fetchOptions = {
  headers: {
    Authorization: `Bearer ${stripe_keys.secret}`,
  },
};

const categoryVideogames = (el, object, str) => {
  if (el) {
    let nameIndex = el.name.toLowerCase().indexOf(str);
    let consoleName = el.name.slice(nameIndex + 1, el.name.length - 1);
    let videogameName = el.name.slice(0, nameIndex - 1);
    if (!object[consoleName]) object[consoleName] = {};
    object[consoleName][videogameName] = el;
  }
};

const showPlatformVideogames = (consoleObject, consoleName) => {
  let swiperContainerOld = document.querySelectorAll(".swiper-container");
  if (swiperContainerOld.length !== 0) {
    swiperContainerOld.forEach((el) => (el.outerHTML = ""));
  }
  for (let platform in consoleObject) {
    let $cloneSlide;
    let $clonePlatform = document.importNode($temSwiperContainer, true);
    for (let videogame in consoleObject[platform]) {
      $cloneSlide = document.importNode($temSwiperSlide, true);
      let $videogame = $cloneSlide.querySelector(".videogame");
      $videogame.dataset.front = `./assets/img/${consoleName}/${platform.toLowerCase()}/${videogame
        .toLowerCase()
        .trim()}/front.jpg`;
      $videogame.dataset.back = `./assets/img/${consoleName}/${platform.toLowerCase()}/${videogame
        .toLowerCase()
        .trim()}/back.jpg`;
      $videogame.dataset.side = `./assets/img/${consoleName}/${platform.toLowerCase()}/${videogame
        .toLowerCase()
        .trim()}/side.jpg`;
      $videogame.dataset.id = consoleObject[platform][videogame].default_price;
      $clonePlatform.querySelector(".swiper-wrapper").appendChild($cloneSlide);
    }
    $fragment.appendChild($clonePlatform);
  }

  document.querySelector("main").appendChild($fragment);

  const videogames = document.querySelectorAll(".videogame");

  let interval;
  let deg = 0;

  function mouseOverVideogame(videogame) {
    if (!interval) {
      interval = setInterval(() => {
        deg = (deg + 1) % 360;
        videogame.style.transform = `rotateY(${deg}deg)`;
      }, 30);
    }
  }

  function mouseLeaveVideogame(videogame) {
    clearInterval(interval);
    interval = null;
    deg = 0;
    videogame.style.transform = "rotateY(0deg)";
  }

  videogames.forEach((videogame) => {
    let $front = videogame.querySelector(".front");
    let $back = videogame.querySelector(".back");
    let $side = videogame.querySelector(".side");
    $front.style.background = `url("${videogame.dataset.front}")`;
    $front.style.backgroundSize = "cover";
    $back.style.background = `url("${videogame.dataset.back}")`;
    $back.style.backgroundSize = "cover";
    $side.style.background = `url("${videogame.dataset.side}")`;
    $side.style.backgroundSize = "cover";

    // videogame.addEventListener("mouseover", function (e) {
    //   if (!interval) {
    //     interval = setInterval(() => {
    //       deg = (deg + 1) % 360;
    //       videogame.style.transform = `rotateY(${deg}deg)`;
    //     }, 30);
    //   }
    // });

    // videogame.addEventListener("mouseleave", (e) => {
    //   clearInterval(interval);
    //   interval = null;
    // });
  });

  swipers = new Swiper(".videogame-showcase", {
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
          $videogame.addEventListener(
            "mouseleave",
            $videogame.mouseLeaveHandler
          );
          document.querySelectorAll(".btn-buy")[i].dataset.videogame =
            $videogame.dataset.id;
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

  const btnsBuy = document.querySelectorAll(".btn-buy");

  btnsBuy.forEach((btnBuy) => {
    btnBuy.addEventListener("click", function () {
      //alert(this.dataset.videogame);
      Stripe(stripe_keys.public)
        .redirectToCheckout({
          lineItems: [{ price: this.dataset.videogame, quantity: 1 }],
          mode: "payment",
          successUrl: "http://127.0.0.1:5500/index.html",
          cancelUrl: "http://127.0.0.1:5500/index.html",
        })
        .then((res) => {
          if (res.error) {
            alert(res.error.message);
          }
        });
    });
  });
};

Promise.all([
  fetch(API_PRODUCTS, fetchOptions),
  fetch(API_PRICES, fetchOptions),
])
  .then((responses) =>
    Promise.all(
      responses.map((res) => (res.ok ? res.json() : Promise.reject(res)))
    )
  )
  .then((json) => {
    products = json[0].data;
    prices = json[1].data;
    let playstationObject = {};
    let xboxObject = {};
    prices.forEach((el) => {
      let response = products.filter((product) => product.id === el.product);
      let xbox = response.filter(
        (res) =>
          res.name.toLowerCase().search(/(\(xbox\s+[0-9a-z]+)|\(xbox/gi) !== -1
      );
      let playstation = response.filter(
        (res) => res.name.toLowerCase().search(/\(ps[0-9 || a-z]+/gi) !== -1
      );
      playstation.forEach((el) =>
        categoryVideogames(el, playstationObject, "(ps")
      );
      xbox.forEach((el) => categoryVideogames(el, xboxObject, "(xbox"));
    });
    //showPlatformVideogames(playstationObject);
    document
      .getElementById("playstation-option")
      .addEventListener("click", (e) => {
        e.preventDefault();
        showPlatformVideogames(playstationObject, "playstation");
      });
    document.getElementById("xbox-option").addEventListener("click", (e) => {
      e.preventDefault();
      showPlatformVideogames(xboxObject, "xbox");
    });

    showPlatformVideogames(playstationObject, "playstation");
  })
  .catch((err) => {
    console.error(err);
  });
