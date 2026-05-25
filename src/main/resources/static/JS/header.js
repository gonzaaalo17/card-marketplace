async function loadHeader() {

    /**
     * Replaces the current placeholder for 
     */

    const placeholder = document.getElementById("header-placeholder");

    const response = await fetch("/components/header.html");

    placeholder.innerHTML = await response.text();

    renderAccount();
}

async function renderAccount() {

    /**
     * This function basically toggles between a code taken from bootstrap 
     * and previous one when user is logged. If there is a token in localStorage,
     * it will show a small dropdown menu with user info and "my announcements" button.
     * If not, it will show buttons to login and log out.
     */

    const account = document.getElementById("header-container");
    const username = localStorage.getItem("username");
    
    // Fetch /me endpoint
    const response = await fetch("/api/auth/me", {
        credentials: "include"
    });

    if (response.ok) {

        // HTML code taken from bootstrap
        account.innerHTML = `
            <!--  Links to other pages -->
            <nav>
                <ul id="nav_pages">
                    <li class="page"><a href="/">Home</a></li>
                    <li class="page"><a href="/search">Search</a></li>
                    <li class="page"><a href="/card/new">Sell</a></li>
                    <li class="page"><a href="/about">About</a></li>
                    <li class="page"><a href="/contact">Contact</a></li>
                </ul>
            </nav>
            <div id="account">
                <button id="my-announcements">
                    View my announcements
                </button>

                <div class="profile-dropdown">

                    <button class="profile-btn" id="profile-toggle">

                        <img
                            src="/user_uploads/${username}.jpg"
                            alt="avatar"
                        >

                    </button>

                    <div class="dropdown-menu hidden" id="dropdown-menu">

                        <div class="dropdown-user">
                            ${username}
                        </div>

                        <a href="/profile">Profile</a>
                        <a href="/my-announcements">My Cards</a>

                        <hr>

                        <a href="#" id="logout-btn">
                            Sign out
                        </a>

                    </div>

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

        document.getElementById('my-announcements').addEventListener('click', function() {
            window.location.href = '/my-announcements';
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
            <!--  Links to other pages -->
            <nav>
                <ul id="nav_pages">
                    <li class="page"><a href="/">Home</a></li>
                    <li class="page"><a href="/search">Search</a></li>
                    <li class="page"><a href="/about">About</a></li>
                    <li class="page"><a href="/contact">Contact</a></li>
                </ul>
            </nav>
            <div id="account">
                <button id="login" type="button">
                    Log In
                </button>

                <button id="signup" type="button">
                    Sign Up
                </button>
            </div>
        `;

        initModalEvents(); // Adds events to open close login/signup modals (implemented in modal.js)
    }
}

async function logout() {
    /**
     * Now logout doesnt just remove items from localstorage, but
     * makes a request on logout endpoint in Spring Security  
     * and activates Session and cookie based logout workflow
     */

    await fetch("/logout", {
        method: "POST",
        credentials: "include"
    });

    localStorage.removeItem("username");
    window.location.reload();
}

document.addEventListener("DOMContentLoaded", loadHeader);