
//Signup
const signup_submit = document.getElementById("submit-signup");
const register_form = document.getElementById("register-form");
const register_labels = [
    document.getElementById("error_label_name"),
    document.getElementById("error_label_lastname"),
    document.getElementById("error_label_username"),
    document.getElementById("error_label_email"),
    document.getElementById("error_label_pass"),
    document.getElementById("error_label_repass")
];

//Login
const login_label = document.getElementById("error_login");
const login_form = document.getElementById("login-form");
const login_submit = document.getElementById("submit-login");

// Google
let google_buttons = document.getElementsByClassName("modal_google")

//Apple
let apple_buttons = document.getElementsByClassName("modal_apple")

//For Signup
function show_error(label) {
    label.classList.remove("hidden");
}

function hide_error(label) {
    label.classList.add("hidden");
}

function validate_names(label, name) {
    if (!(/^[a-zA-Z]+$/.test(name))) {
        show_error(label);
        return false;
    }
    hide_error(label);
    return true;
}

function validate_user(label, user) {
    if (!(user.length >= 8 && user.length <= 15)) {
        show_error(label);
        return false;
    }

    if (!(/^[a-zA-Z0-9_]*$/.test(user))) {
        show_error(label);
        return false;
    }
    hide_error(label);
    return true;
}

function validate_email(label, email) {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!(emailRegex.test(email))){
        show_error(label);
        return false;
    }
    hide_error(label);
    return true;
}

function validate_password(label, password){
    if (!(password.length >= 8 && password.length <= 15)) {
        show_error(label);
        return false;
    }

    if (/^[a-zA-Z0-9]*$/.test(password)) {
        show_error(label);
        return false;
    }
    hide_error(label);
    return true;
}

function validate_password_repeat(label, password, re_password) {
    if (password != re_password){
        show_error(label);
        return false;
    }
    hide_error(label);
    return true;
}

function validate_register_fields(labels) {
    let valid = true;

    valid = validate_names(labels[0], document.getElementById('name_ip').value) && valid;
    valid = validate_names(labels[1], document.getElementById('lastname_ip').value) && valid;
    valid = validate_user(labels[2], document.getElementById('user_ip').value) && valid;
    valid = validate_email(labels[3], document.getElementById('email_ip').value) && valid;

    let password = document.getElementById('pass_ip').value;
    valid = validate_password(labels[4], password) && valid;
    valid = validate_password_repeat(labels[5], password, document.getElementById('repeat_pass_ip').value) && valid;

    return valid
}

async function send_signup_form(event, labels) {
    event.preventDefault(); // Previene que no se envie por defecto
    if (validate_register_fields(labels)) {
        console.log("Signup form sent successfully. ✅");
        const data = {
            name: document.getElementById('name_ip').value,
            lastname: document.getElementById('lastname_ip').value,
            username: document.getElementById('user_ip').value,
            email: document.getElementById('email_ip').value,
            password: document.getElementById('pass_ip').value
        };

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        console.log(await res.json());
    } else {
        console.log("Signup form was not sent. ❌");
        return
    }
}

//For login
function validate_login_fields(label) {
    show_error(label);
    return false;
}

async function send_login_form(event, label) {
    event.preventDefault(); // Previene que no se envie por defecto
    const data = {
        username: document.getElementById('log_user_ip').value,
        password: document.getElementById('log_pass_ip').value
    };

    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.token) {
        localStorage.setItem("token", result.token);
        console.log("Logged in ✅");
    } else {
        show_error(label);
    }
}

signup_submit.addEventListener("click", (event) => send_signup_form(event, register_labels));
login_submit.addEventListener("click", (event) => send_login_form(event, login_label))

// Event for google and apple
google_buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = "/oauth2/authorization/google";
    });
});

apple_buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = "/oauth2/authorization/google";
    });
});