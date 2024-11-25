function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

document.addEventListener('DOMContentLoaded', () => {
    const isRegistered = getCookie('authToken');

    const registrationPage = document.getElementById('registration');
    const homePage = document.getElementById('home');

    if (!isRegistered) {
        registrationPage.classList.add('hidden');
        homePage.classList.remove('hidden');
    } else {
        registrationPage.classList.remove('hidden');
        homePage.classList.add('hidden');
    }
});

const signinBtn = document.getElementById('toSignin');
const signupBtn = document.getElementById('toSignup');

signinBtn.addEventListener('click', () => {
    const registrationPage = document.getElementById('registration');
    const loginPage = document.getElementById('login');

    registrationPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
});

signupBtn.addEventListener('click', () => {
    const registrationPage = document.getElementById('registration');
    const loginPage = document.getElementById('login');

    registrationPage.classList.remove('hidden');
    loginPage.classList.add('hidden');
});