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
