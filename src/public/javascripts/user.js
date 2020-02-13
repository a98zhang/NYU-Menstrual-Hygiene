function logIn() {
    const modalLogin = document.querySelector('#modal-login');
    const username = modalLogin.querySelector('.username').value;
    const password = modalLogin.querySelector('.password').value;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'user/ajax');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.addEventListener('load', function(evt) {
        document.querySelector('.username').value = '';
        document.querySelector('.password').value = '';
        console.log('reach here');
    });
    xhr.addEventListener('error', function(evt) {
        console.log('HTTP Error:', xhr.status);
    });
    xhr.send(`username=${username}&password=${password}`);
}

function signUp() {

    function handleInvalidSignup(error) {
        const btn = document.querySelector('#signupBtn');
        const notf = document.createElement('p');
        notf.classList.add('alert');
        if (error.errors[0].param==='password') {
            notf.textContent = 'The password needs to be at least 8 characters';
        }
        else {
            notf.textContent = 'The username already exists';
        }
        btn.parentNode.insertBefore(notf, btn);
        document.querySelector('.password').value = '';
    }
    
    const elem = document.querySelector('.alert');
    if (elem) {elem.parentNode.removeChild(elem); }
 
    const modalSignup = document.querySelector('#modal-signup');
    const username = modalSignup.querySelector('.username').value;
    const password = modalSignup.querySelector('.password').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'me');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.addEventListener('load', function(evt) {
        if (xhr.status===422) {
            handleInvalidSignup(JSON.parse(xhr.responseText));
        }
        else {
            document.querySelector('#modal-signup').classList.remove('open');
            const modalLogin = document.querySelector('#modal-login');
            modalLogin.classList.add('open');
            modalLogin.querySelector('h4').classList.add('hidden');
            modalLogin.querySelector('.user').classList.add('hidden');
        }
    });
    xhr.addEventListener('error', function(evt) {
        console.log('HTTP Error:', xhr.status);
    });
    xhr.send(`username=${username}&password=${password}`);
}


function main() {
    const modalLogin = document.querySelector('#modal-login');
    modalLogin.classList.add('open');
    modalLogin.querySelector('#loginBtn').addEventListener('click', logIn);
    modalLogin.querySelector('.user').addEventListener('click', function(){
        document.querySelector('#modal-login').classList.remove('open');
        document.querySelector('#modal-signup').classList.add('open');
        document.querySelector('#signupBtn').addEventListener('click', signUp);
    });
}

document.addEventListener("DOMContentLoaded", main);
