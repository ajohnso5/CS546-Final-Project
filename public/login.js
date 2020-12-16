let isOnLoginScreen = true; 

function changeScreen() {
    let hidden = document.getElementById('hidden');

    let repass = document.createElement('input');
    const scr = document.getElementById('scripts');
    repass.setAttribute('name', 'repass');
    repass.setAttribute('id', 'repass');
    repass.setAttribute('type', 'password');
    repass.setAttribute('placeholder', 'Re-Type Password');

    if(isOnLoginScreen) {
        let form = document.getElementById('loginForm')
        scr.innerHTML = '<script type="text/javascript" src="/public/error_checking/error_checking_create_account.js"></script>';
        form.setAttribute('action','/createAccount')
        hidden.appendChild(repass);
        document.getElementById('subtitle').innerHTML = 'Sign Up';
        document.getElementById('change-screen').innerHTML = 'Already have an account? Click here!';
        isOnLoginScreen = false;
    } else {
        let form = document.getElementById('loginForm')
        scr.innerHTML = '<script type="text/javascript" src="/public/error_checking/error_checking_login.js"></script>';
        form.setAttribute('action','/login')
        hidden.removeChild(hidden.firstChild);
        document.getElementById('subtitle').innerHTML = 'Login';
        document.getElementById('change-screen').innerHTML = 'Don\'t have an account? Click here!';
        isOnLoginScreen = true;
    }
}