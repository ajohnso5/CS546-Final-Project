(function () {
    const loginForm = document.getElementById("loginForm");
    const error = document.getElementById("error");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const repass = document.getElementById("repass");
  
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (username.value == "" || password.value == "" || repass.value == "") {
          error.innerText = "Fields cannot be blank";
          return;
      } else {
          loginForm.submit();
      }
      });
    }
  })();
  