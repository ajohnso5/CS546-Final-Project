(function () {
  const findFishForm = document.getElementById("findFishForm");
  const error = document.getElementById("error");
  const temp = document.getElementById("temp");
  const windspeed = document.getElementById("windspeed");
  const tide = document.getElementById("tide");
  const waveHeight = document.getElementById("waveHeight");
  const target = document.getElementById("targetFish");

  if (findFishForm) {
    findFishForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (
        temp.value.trim().value == "" ||
        windspeed.value.trim().length == 0 ||
        tide.value.trim().value == "" ||
        waveHeight.value.trim().length == 0 ||
        target.value.trim() == ""
      ) {
        error.innerText = "Fields cannot be blank";
        return;
      }
      if(windspeed.value < 0) {
        error.innerText = "Wind speed cannot be less than 0";
        return;
      }
      if(tide.value.match(/[0-9]+/)) {
        error.innerText = "Tide cannot contain number";
        return;
      }
      if(waveHeight.value < 0) {
        error.innerText = "Wave height cannot be less than 0";
        return;
      }
      if(target.value.match(/[0-9]+/)) {
        error.innerText = "Target fish can only contain letters and commas";
        return;
      }
      findFishForm.submit();
    });
  }
})();
