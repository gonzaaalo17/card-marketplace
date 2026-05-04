async function loadHeader() {

    /**
     * Replaces the current placeholder for 
     */

    const placeholder = document.getElementById("header-placeholder");

    const response = await fetch("/components/header.html");

    placeholder.innerHTML = await response.text();

    renderAccount();
}

function renderAccount() {

    /**
     * This function basically toggles between a code taken from bootstrap 
     * and previous one when user is logged. If there is a token in localStorage,
     * it will show a small dropdown menu with user info and "my announcements" button.
     * If not, it will show buttons to login and log out.
     */

    const account = document.getElementById("account");

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token) {

        // HTML code taken from bootstrap
        account.innerHTML = `
            <button id="my-announcements">
                View my announcements
            </button>

            <div class="profile-dropdown">

                <button class="profile-btn" id="profile-toggle">

                    <img
                        src="/images/design/default_avatar.jpeg"
                        alt="avatar"
                    >

                </button>

                <div class="dropdown-menu hidden" id="dropdown-menu">

                    <div class="dropdown-user">
                        ${username}
                    </div>

                    <a href="#">Profile</a>
                    <a href="#">Settings</a>

                    <hr>

                    <a href="#" id="logout-btn">
                        Sign out
                    </a>

                </div>

            </div>
        `;

        document
            .getElementById("logout-btn")
            .addEventListener("click", logout);

        const toggle = document.getElementById("profile-toggle");
        const menu = document.getElementById("dropdown-menu");

        toggle.addEventListener("click", (e) => {

            e.stopPropagation();

            menu.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
        const menu = document.getElementById("dropdown-menu");

        if (menu) {
            menu.classList.add("hidden");
        }
    });

    } else {

        // This was before
        account.innerHTML = `
            <button id="login" type="button">
                Log In
            </button>

            <button id="signup" type="button">
                Sign Up
            </button>
        `;

        initModalEvents(); // Adds events to open close login/signup modals (implemented in modal.js)
    }
}

function logout() {

    /**
     * Logout removes data from localStorage and 
     * reloads page so that it is re-rendered
     */

    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.location.reload();
}

document.addEventListener("DOMContentLoaded", loadHeader);