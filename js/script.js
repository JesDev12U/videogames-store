const btnsBuy = document.querySelectorAll(".btn-buy");

btnsBuy.forEach((btnBuy) => {
  btnBuy.addEventListener("click", function () {
    alert(this.dataset.videogame);
  });
});
