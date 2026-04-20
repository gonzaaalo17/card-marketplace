
// =======================
// SEARCH + CATEGORY
// =======================
const searchInput = document.getElementById("search_bar");
const searchButton = document.getElementById("search_button");

function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    window.location.href = `search.html?name=${encodeURIComponent(query)}`;
}

searchButton.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
});

document.querySelectorAll(".category, #category-football")
.forEach(btn => {
    btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        window.location.href = `/search?game=${category}`;
    });
});


// =======================
// CARD MODAL
// =======================


function formatDate(dateStr) {
    if (!dateStr) return "Recently added";

    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

async function fetchCardById(id) {
    // API READY:
    const response = await fetch(`/api/cards/${id}`);
    return await response.json();

    // return mockData.find(card => card.id === id);
}

// RENDER MODAL

// To format date correctly for GUI as backend will give LocalDate "2026-04-20T18:45:12.123" like str
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

function getConditionHTML(condition) {
    const c = condition.toLowerCase(); // Normalize condition

    switch (c) {
        case "mint":
            return `<img src="/images/design/mint.png" alt="Condition Icon">Mint`;
        case "near-mint":
            return `<img src="/images/design/near_mint.png" alt="Condition Icon">Near Mint`;
        case "played":
            return `<img src="/images/design/played.png" alt="Condition Icon">Played`;
        case "damaged":
            return `<img src="/images/design/damaged.png" alt="Condition Icon">Damaged`;
    }
}

function renderCardModal(card) {
    if (!card) return; // Protection in case backend returns null

    const card_container = document.querySelector(".modal_card_view")
    const imageSrc = card.image || "/images/design/placeholder.jpg"; // Temporal until uploads impl is done

    card_container.innerHTML = `
        <div class="modal_card_image">
            <img src="${imageSrc}"  alt="Trading card">
            <button class="modal_buy" type="button">Buy</button>
        </div>
        <div class="modal_info">
            <h2>${card.name}</h2>
            <h2 class="modal_price">$ ${card.price}</h2>
            <div class="modal_vendor">
                <img src="/images/design/user.png" alt="User Icon">
                ${card.vendor}
            </div>
            <div class="modal_date">
                <img src="/images/design/calendar.png" alt="Calendar Icon">
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
}

// OPEN MODAL
async function openCardModal(cardId) {
    const modal = document.querySelector(".modal_card");
    const overlay = document.getElementById("overlay");

    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
    modal.classList.add("show");

    const data = await fetchCardById(cardId);
    renderCardModal(data);
}

// CLOSE MODAL
document.getElementById("close-card").addEventListener("click", () => {
    document.querySelector(".modal_card").classList.remove("show");
    document.querySelector(".modal_card").classList.add("hidden");
    document.getElementById("overlay").classList.add("hidden");
});


// =======================
// LATEST ARRIVALS
// =======================

async function fetchLatestCards() {
    // API READY:
    const response = await fetch('/api/cards/latest');

    // Error handling
    if (!response.ok) {
        throw new Error("Failed to fetch latest cards");
    }

    return await response.json();
}

async function renderLatest() {
    const container = document.querySelector(".latest_list");
    const cards = await fetchLatestCards();

    container.innerHTML = "";

    cards.forEach((card, index) => {
        const div = document.createElement("div");
        div.classList.add("latest_item");

        div.style.opacity = 0;
        div.style.transform = "translateY(20px)";

        const imageSrc = card.image || "/images/design/placeholder.jpg"; // Temporal until uploads impl is done
        div.innerHTML = `
            <img src="${imageSrc}" class="latest_img">
            <button class="viewmore">View More</button>
        `;

        div.querySelector(".viewmore").addEventListener("click", () => {
            openCardModal(card.id);
        });

        div.querySelector(".latest_img").addEventListener("click", () => {
            openCardModal(card.id);
        });

        container.appendChild(div);
        
        // Animation
        setTimeout(() => {
            div.style.transition = "all 0.5s ease";
            div.style.opacity = 1;
            div.style.transform = "translateY(0)";
        }, index * 150);
    });
}


// =======================
// CAROUSEL
// =======================


let offset = 0;
const LIMIT = 6;
let carouselBuffer = [];

// INIT CAROUSEL DATA
async function fetchCarousel(offset, limit) {
    const response = await fetch(`/api/cards/carousel?offset=${offset}&limit=${limit}`);
    return await response.json();
}

async function initCarousel() {
    carouselBuffer = await fetchCarousel(offset, LIMIT);
    renderCarousel();
}

function renderCarousel() {
    const container = document.getElementById("carousel_list");
    container.innerHTML = "";

    carouselBuffer.forEach((card, index) => {
        const div = document.createElement("div");
        div.classList.add("carousel_item");

        const imageSrc = card.image || "/images/design/placeholder.jpg"; // Temporal until uploads impl is done
        div.innerHTML = `
            <img src="${imageSrc}">
            <button class="viewmore">View More</button>
        `;

        div.addEventListener("click", () => openCardModal(card.id));

        container.appendChild(div);

        setTimeout(() => {
            div.style.transition = "all 0.5s ease";
            div.style.opacity = 1;
            div.style.transform = "translateY(0)";
        }, index * 80);
    });
}

function updateArrows() {
    const leftBtn = document.getElementById("left");
    const rightBtn = document.getElementById("right");

    leftBtn.style.display = currentStartIndex > 0 ? "block" : "none";

    rightBtn.style.display =
        currentStartIndex + VISIBLE_COUNT < carouselBuffer.length ? "block" : "block";
}

function scrollContainer(direction) {
    const container = document.getElementById("carousel_list");

    container.scrollBy({
        left: direction * 200,
        behavior: "smooth"
    });
}

async function scrollLeft() {
    if (offset === 0) return;

    offset -= LIMIT;

    carouselBuffer = await fetchCarousel(offset, LIMIT);

    renderCarousel();
}

async function scrollRight() {
    offset += LIMIT;

    const newCards = await fetchCarousel(offset, LIMIT);

    if (newCards.length === 0) return;

    carouselBuffer = newCards;
    renderCarousel();
}

document.getElementById("left").addEventListener("click", scrollLeft);
document.getElementById("right").addEventListener("click", scrollRight);

// Exec when DOM is Loaded
document.addEventListener("DOMContentLoaded", () => {
    renderLatest();
    initCarousel();
});