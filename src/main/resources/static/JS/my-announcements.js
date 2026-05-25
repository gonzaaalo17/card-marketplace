let currentDeleteId = null;

// ======================================
// QUERY
// ======================================

function buildQuery() {

    const params = new URLSearchParams();

    const search = document.getElementById("search_bar").value;
    const sort = document.querySelector(".sort").value;

    if (search) {
        params.append("name", search);
    }

    if (sort) {
        params.append("sort", sort);
    }

    // collections
    const activeButtons =
        document.querySelectorAll(".category.active");

    activeButtons.forEach(btn => {
        params.append("collections", btn.dataset.category);
    });

    return params.toString();
}

// ======================================
// FETCH
// ======================================

async function getCurrentUserInfo() {
    /**
     * Here we are calling /me method to see if there is user logged
     * if so, will return username and role.
     */

    const response = await fetch("/api/auth/me", {
        credentials: "include"
    });

    if (!response.ok) {
        return null;
    }

    return await response.json();
}

async function fetchCards() {

    const queryString = buildQuery();
    const currentUser = localStorage.getItem("username");
    const userInfo = await getCurrentUserInfo();

    /**
     * If user role is admin will get access to all cards of DB
     * Admin should have privilege of editing, removing cards from all users
     */
    if (userInfo?.role === "ROLE_ADMIN") {
        const response = await fetch("/api/cards/all", {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to fetch cards for admin");
        }

        const cards = await response.json();
        return { content: cards, totalElements: cards.length };
    }

    /**
     * If is regular user, will just get cards associated to its username
     */
    const response = await fetch(
        `/api/cards/search?page=0&size=999&vendor=${currentUser}&${queryString}`
    );

    return await response.json();
}

async function fetchAndRender() {

    const data = await fetchCards();

    renderCards(data.content);

    updateResultsHeader(data.totalElements);
}

// ======================================
// CARD MODAL
// ======================================

function formatDate(dateStr) {

    if (!dateStr) {
        return "Recently added";
    }

    const date = new Date(dateStr);

    return date.toLocaleDateString();
}

async function fetchCardById(id) {

    const response =
        await fetch(`/api/cards/${id}`);

    return await response.json();
}

function getConditionHTML(condition) {

    const c = condition.toLowerCase();

    switch (c) {

        case "mint":
            return `<img src="/images/design/mint.png">Mint`;

        case "near-mint":
            return `<img src="/images/design/near_mint.png">Near Mint`;

        case "played":
            return `<img src="/images/design/played.png">Played`;

        case "damaged":
            return `<img src="/images/design/damaged.png">Damaged`;
    }
}

function renderCardModal(card) {

    const container =
        document.querySelector(".modal_card_view");

    const imageSrc =
        card.image || "/images/design/placeholder.jpg";

    container.innerHTML = `
        <div class="modal_card_image">

            <img src="${imageSrc}" alt="card">

            <div class="modal_actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>

        </div>

        <div class="modal_info">

            <h2>${card.name}</h2>

            <h2 class="modal_price">$ ${card.price}</h2>

            <div class="modal_vendor">
                <img src="/images/design/user.png">
                ${card.vendor}
            </div>

            <div class="modal_date">
                <img src="/images/design/calendar.png">
                ${formatDate(card.date)}
            </div>

            <h3>Condition</h3>

            <div class="modal_condition">
                ${getConditionHTML(card.condition)}
            </div>

            <div class="modal_description">
                <h3>Description</h3>
                <p>${card.description}</p>
            </div>

        </div>
    `;

    // EDIT
    container.querySelector(".edit-btn")
        .addEventListener("click", () => {
            // Put id in local storage to avoid having it in url exposed
            localStorage.setItem(
                "editing_card_id",
                card.id
            );

            window.location.href =
                "/edit-announcement";
        });

    // DELETE
    container.querySelector(".delete-btn")
        .addEventListener("click", () => {

            currentDeleteId = card.id;

            document.getElementById("delete-modal")
                .classList.remove("hidden");
        });
}

async function openCardModal(id) {

    const overlay =
        document.getElementById("overlay");

    const modal =
        document.querySelector(".modal_card");

    overlay.classList.remove("hidden");

    modal.classList.remove("hidden");

    modal.classList.add("show");

    const card = await fetchCardById(id);

    renderCardModal(card);
}

// CLOSE CARD MODAL
document.getElementById("close-card")
    .addEventListener("click", () => {

        document.querySelector(".modal_card")
            .classList.add("hidden");

        document.getElementById("overlay")
            .classList.add("hidden");
    });

// ======================================
// DELETE
// ======================================

async function deleteCard(id) {

    const response =
        await fetch(`/api/cards/${id}`, {
            method: "DELETE"
        });

    if (response.ok) {
        show_confirmation("Announcement deleted")

        fetchAndRender();

    } else {
        show_cancel("Could not delete announcement")
    }
}

// YES
document.getElementById("confirm-delete")
    .addEventListener("click", async () => {

        if (currentDeleteId !== null) {

            await deleteCard(currentDeleteId);

            document.getElementById("delete-modal")
                .classList.add("hidden");

            document.querySelector(".modal_card")
                .classList.add("hidden");

            document.getElementById("overlay")
                .classList.add("hidden");
            
        }
    });

// NO
document.getElementById("cancel-delete")
    .addEventListener("click", () => {

        document.getElementById("delete-modal")
            .classList.add("hidden");
    });

// CLOSE MODAL
document.getElementById("close-card-delete").addEventListener("click", () => {
    document.getElementById("delete-modal").classList.add("hidden");
});

// ======================================
// RENDER
// ======================================

function getCategoryImage(category) {
    switch (category) {
        case "Pokémon":
            return "images/design/pokemon_trading_card_game_logo.png";
        case "Yu-Gi-Oh!":
            return "images/design/Yu-Gi-Oh-Logo.png";
        case "Magic The Gathering":
            return "images/design/Magic-The-Gathering-Logo.png";
        case "Sports":
            return "images/design/football.png";
        default:
            return
    }
}

function getCorrectHTML(category) {
    if (category === "other") {
        return `<p>Other</p>`;
    }

    const categoryImg = getCategoryImage(category);

    if (category === "Sports") {
        return `<div class="sports_category"> <img class="game_logo" src="${categoryImg}" alt="${category} logo"> Sports </div>`;
    }

    return `<img class="game_logo" src="${categoryImg}" alt="${category} logo">`;
}


function renderCards(cards) {

    const container =
        document.getElementById("cards_container");

    container.innerHTML = "";

    cards.forEach(card => {

        const cardEl =
            document.createElement("div");

        cardEl.classList.add("card");

        cardEl.innerHTML = `
            <div class="card_item">

                <img
                    class="card_image"
                    src="${card.image}"
                    alt="${card.name}"
                >

                ${getCorrectHTML(card.collection)}

                <div class="meta">

                    <div class="vendor">
                        <img src="images/design/user.png" alt="User Icon">
                        <span>${card.vendor}</span>
                    </div>

                    <div class="date">
                        <img src="images/design/calendar.png" alt="Calendar Icon">
                        <span>${formatDate(card.date)}</span>
                    </div>

                </div>

                <button class="viewmore">
                    View More
                </button>

            </div>
        `;

        cardEl.querySelector(".viewmore")
            .addEventListener("click", () => {
                openCardModal(card.id);
            });

        cardEl.querySelector(".card_image")
            .addEventListener("click", () => {
                openCardModal(card.id);
            });

        container.appendChild(cardEl);
    });
}

function updateResultsHeader(count) {
    const p = document.querySelector(".results_header p");
    p.textContent = `${count} results found`;
}

// ======================================
// EVENTS
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // SEARCH
    document.getElementById("search_button")
        .addEventListener("click", () => {

            fetchAndRender();
        });

    // ENTER
    document.getElementById("search_bar")
        .addEventListener("keypress", (e) => {

            if (e.key === "Enter") {
                fetchAndRender();
            }
        });

    // SORT
    document.querySelector(".sort")
        .addEventListener("change", () => {

            fetchAndRender();
        });

    // HERO CATEGORIES
    document.querySelectorAll(".category")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                // Record previously clicked button
                const wasActive =
                    btn.classList.contains("active");

                // Remove active from all buttons (only one category is fetched)
                document.querySelectorAll(".category")
                    .forEach(b => b.classList.remove("active"));

                // if clicked button was previous, remove active(toggle to show all cards)
                if (!wasActive) {
                    btn.classList.add("active");
                }

                fetchAndRender();
            });
        });

    // INITIAL LOAD
    fetchAndRender();
});