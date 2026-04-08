// =======================
// MOCK DATA (SOURCE OF TRUTH)
// =======================
const mockData = [
    { id: 1, name: "Blue Eyes Dragon", vendor: "Gonzalo Lopez", game: "ygo", condition: "mint", rarity: "rare", price: 120, date: "2023-01-10", image: "images/dragon.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 2, name: "Lucas Card", vendor: "Blender", game: "pokemon", condition: "near-mint", rarity: "common", price: 20, date: "2024-03-15", image: "images/lucas.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 3, name: "Steve Promo", vendor: "Hector", game: "mgt", condition: "played", rarity: "uncommon", price: 35, date: "2022-11-01", image: "images/steve.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 4, name: "Kobe Legend", vendor: "Erik Perry", game: "sports", condition: "mint", rarity: "rare", price: 200, date: "2023-07-22", image: "images/kobe.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 5, name: "Chorizo Special", vendor: "RRari", game: "other", condition: "damaged", rarity: "common", price: 5, date: "2021-05-18", image: "images/chorizo.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 6, name: "Camella Rare", vendor: "Xibi", game: "pokemon", condition: "near-mint", rarity: "rare", price: 75, date: "2023-09-09", image: "images/camella.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 7, name: "Ray Champion", vendor: "Gonzalo Lopez", game: "sports", condition: "mint", rarity: "ultra-rare", price: 300, date: "2024-01-01", image: "images/ray.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 8, name: "Pharaoh's Curse", vendor: "Hector", game: "ygo", condition: "played", rarity: "rare", price: 90, date: "2022-08-12", image: "images/faraon.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 9, name: "Gyarados EX", vendor: "Store B", game: "pokemon", condition: "mint", rarity: "ultra-rare", price: 250, date: "2024-02-20", image: "images/gyara2.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 10, name: "Hydra Beast", vendor: "RRari", game: "mgt", condition: "near-mint", rarity: "rare", price: 180, date: "2023-06-30", image: "images/hydra.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." },
    { id: 11, name: "Random Dragon", vendor: "Gonzalo Lopez", game: "ygo", condition: "damaged", rarity: "common", price: 10, date: "2021-12-25", image: "images/random_dragon.jpg", description: "Selling this N’s Zoroark ex card featuring Zoroark and N. Great looking full art with the gold background. Card is in very good condition and has been kept in a sleeve. Perfect for collectors or anyone building a deck around Zoroark. Feel free to message if you want more photos or details." }
];


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
        window.location.href = `search.html?game=${category}`;
    });
});


// =======================
// CARD MODAL
// =======================

// GET CARD FROM MOCK
async function fetchCardById(id) {
    // API READY:
    // const response = await fetch(`/api/cards/${id}`);
    // return await response.json();

    return mockData.find(card => card.id === id);
}

// RENDER MODAL
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

function getConditionHTML(condition) {
    switch (condition) {
        case "mint":
            return `<img src="images/design/mint.png" alt="Condition Icon">Mint`;
        case "near-mint":
            return `<img src="images/design/near_mint.png" alt="Condition Icon">Near Mint`;
        case "played":
            return `<img src="images/design/played.png" alt="Condition Icon">Played`;
        case "damaged":
            return `<img src="images/design/damaged.png" alt="Condition Icon">Damaged`;
    }
}

function renderCardModal(card) {
    const card_container = document.querySelector(".modal_card_view")

    card_container.innerHTML = `
        <div class="modal_card_image">
            <img src="${card.image}"  alt="Trading card">
            <button class="modal_buy" type="button">Buy</button>
        </div>
        <div class="modal_info">
            <h2>${card.name}</h2>
            <h2 class="modal_price">$ ${card.price}</h2>
            <div class="modal_vendor">
                <img src="images/design/user.png" alt="User Icon">
                ${card.vendor}
            </div>
            <div class="modal_date">
                <img src="images/design/calendar.png" alt="Calendar Icon">
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
    // const response = await fetch('/api/cards/latest?limit=3');
    // return await response.json();

    return mockData.slice(0, 3);
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

        div.innerHTML = `
            <img src="${card.image}" class="latest_img">
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

renderLatest();


// =======================
// CAROUSEL
// =======================

let carouselBuffer = [];
let currentStartIndex = 0;
const VISIBLE_COUNT = 6;

// INIT CAROUSEL DATA
async function fetchInitialCarousel() {
    // API READY:
    // const response = await fetch(`/api/cards/carousel?limit=${VISIBLE_COUNT}`);
    // return await response.json();

    return mockData.slice(0, VISIBLE_COUNT);
}

async function fetchNextCard(currentCount) {
    // API READY:
    // const response = await fetch(`/api/cards/carousel/next?offset=${currentCount}`);
    // return await response.json();

    return mockData[(currentCount) % mockData.length];
}

async function initCarousel() {
    carouselBuffer = await fetchInitialCarousel();
    currentStartIndex = 0;
    renderCarousel();
    updateArrows();
}

function renderCarousel() {
    const container = document.getElementById("carousel_list");
    container.innerHTML = "";

    const visibleCards = carouselBuffer.slice(currentStartIndex, currentStartIndex + VISIBLE_COUNT);

    visibleCards.forEach((card, index) => {
        const a = document.createElement("div");
        a.classList.add("carousel_item");

        a.innerHTML = `
            <img src="${card.image}">
            <button class="viewmore">View More</button>
        `;

        a.addEventListener("click", (e) => {
            e.preventDefault();
            openCardModal(card.id);
        });

        container.appendChild(a);

        // Animation
        setTimeout(() => {
            a.style.transition = "all 0.5s ease";
            a.style.opacity = 1;
            a.style.transform = "translateY(0)";
        }, index * 100);
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
    if (currentStartIndex > 0) {
        currentStartIndex--;
        renderCarousel();
        updateArrows();
        scrollContainer(-1);
    }
}

async function scrollRight() {
    const atEnd = currentStartIndex + VISIBLE_COUNT >= carouselBuffer.length;

    if (atEnd) {
        const newCard = await fetchNextCard(carouselBuffer.length);
        carouselBuffer.push(newCard);
    }

    currentStartIndex++;
    renderCarousel();
    updateArrows();
    scrollContainer(1);
}

document.getElementById("left").addEventListener("click", scrollLeft);
document.getElementById("right").addEventListener("click", scrollRight);

initCarousel();