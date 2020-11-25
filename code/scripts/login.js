let isOnLoginScreen = true; 

function changeScreen() {
    let hidden = document.getElementById('hidden');

    let repass = document.createElement('input');
    repass.setAttribute('name', 're-pass');
    repass.setAttribute('id', 're-pass');
    repass.setAttribute('type', 'password');
    repass.setAttribute('placeholder', 'Re-Type Password');

    if(isOnLoginScreen) {
        hidden.appendChild(repass);
        document.getElementById('subtitle').innerHTML = 'Sign Up';
        document.getElementById('change-screen').innerHTML = 'Already have an account? Click here!';
        isOnLoginScreen = false;
    } else {
        hidden.removeChild(hidden.firstChild);
        document.getElementById('subtitle').innerHTML = 'Login';
        document.getElementById('change-screen').innerHTML = 'Don\'t have an account? Click here!';
        isOnLoginScreen = true;
    }
}