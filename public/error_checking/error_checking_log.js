(function () {
  const logForm = document.getElementById("logForm");
  const error = document.getElementById("error");
  const loc = document.getElementById("loc");
  const duration = document.getElementById("duration");
  const target = document.getElementById("fishCaught");
  const waveHeight = document.getElementById("waveHeight");
  const lures = document.getElementById("lures");
  const quantity = document.getElementById("quantity");
  const avgLength = document.getElementById("avgLength");
  const maxLength = document.getElementById("maxLength");
  const avgWeight = document.getElementById("avgWeight");
  const maxWeight = document.getElementById("maxWeight");

  if (logForm) {
    logForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (
        loc.value.trim() == "" ||
        waveHeight.value.trim().length == 0 ||
        duration.value.trim().length == 0 ||
        quantity.value.trim().length == 0 ||
        target.value.trim() == "" ||
        avgLength.value.trim().length == 0 ||
        maxLength.value.trim().length == 0 ||
        avgWeight.value.trim().length == 0 ||
        maxWeight.value.trim().length == 0 ||
        lures.value.trim() == ""
      ) {
        error.innerText = "Fields cannot be blank";
        return;
      }
      if (quantity.value < 0) {
        error.innerText = "Quantity cannot be less than 0";
        return;
      }
      if (avgLength.value < 0) {
        error.innerText = "Length cannot be less than 0";
        return;
      }
      if (maxLength.value < 0) {
        error.innerText = "Length cannot be less than 0";
        return;
      }
      if (avgWeight.value < 0) {
        error.innerText = "Weight cannot be less than 0";
        return;
      }
      if (maxWeight.value < 0) {
        error.innerText = "Weight cannot be less than 0";
        return;
      }
      if (waveHeight.value < 0) {
        error.innerText = "Wave height cannot be less than 0";
        return;
      }
      if (target.value.match(/[0-9]+/)) {
        error.innerText = "Target fish can only contain letters and commas";
        return;
      }
      logForm.submit();
    });
  }
})();
