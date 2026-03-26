function open_reg_modal(){
    document.getElementById("overlay").classList.remove("hidden");
    document.getElementById("modal-register").classList.remove("hidden");
    document.getElementById("modal-register").classList.add("show");
}

function close_reg_modal() {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("modal-register").classList.add("hidden");
    document.getElementById("modal-register").classList.remove("show");
}

function open_log_modal(){
    document.getElementById("overlay").classList.remove("hidden");
    document.getElementById("modal-login").classList.remove("hidden");
    document.getElementById("modal-login").classList.add("show");
}

function close_log_modal() {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("modal-login").classList.add("hidden");
    document.getElementById("modal-login").classList.remove("show");
}

function ny_an_account() {
    close_log_modal()
    open_reg_modal()
}

const ny_account = document.getElementById("modal_ny_an_account")
const register = document.getElementById("signup")
const login = document.getElementById("login")
const close_register = document.getElementById("close-register")
const close_login = document.getElementById("close-login")

register.addEventListener("click", open_reg_modal);
close_register.addEventListener("click", close_reg_modal);
login.addEventListener("click", open_log_modal);
close_login.addEventListener("click", close_log_modal);
ny_account.addEventListener("click", ny_an_account);
