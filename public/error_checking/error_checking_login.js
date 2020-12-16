(function () {
  const loginForm = document.getElementById("loginForm");
  const error = document.getElementById("error");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const state = document.getElementById("subtitle");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (state.innerHTML == "Login") {
        if (username.value == "" || password.value == "") {
          error.innerText = "Username or Password cannot be blank";
          return;
        } else {
          loginForm.submit();
        }
      } else {
        if (
          username.trim().value == "" ||
          password.trim().value == "" ||
          repass.trim().value == ""
        ) {
          error.innerText = "Username or Password cannot be blank";
          return;
        }
        if(!password.value.match(/[a-z]+/)) {
            error.innerHTML = 'Password must contain a letter';
            return;
        }
        if(!password.value.match(/[A-Z]+/)) {
            error.innerHTML = 'Password must contain an uppercase character';
            return;
        }
        if(!password.value.match(/[0-9]+/)) {
            error.innerHTML = 'Password must contain a number';
            return;
        }
        if(password.value.trim().length < 8) {
            error.innerText = 'Password must be atleast 8 characters';
            return;
        }
        if(password.value != repass.value) {
            error.innerText = 'Password and Re-Password must match';
            return;
        }
        if(username.value.trim().length < 8) {
            error.innerText = 'Username must be atleast 8 characters';
            return;
        }
        loginForm.submit();
      }
    });
  }
})();
