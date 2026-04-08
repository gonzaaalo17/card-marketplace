// ========================
// MOCK DATABASE
// ========================
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

// ========================
// STATE
// ========================
const state = {
    results: [],
    page: 1,
    pageSize: 4,
    totalResults: 0,
    filters: {}
};

// ========================
// BUILD QUERY
// ========================
function buildQuery() {
    const params = new URLSearchParams();

    const name = document.getElementById("filter_name").value;
    const vendor = document.getElementById("filter_vendor").value;
    const date = document.querySelector(".date").value;
    const sort = document.querySelector(".sort").value;

    if (name) params.append("name", name);
    if (vendor) params.append("vendor", vendor);
    if (date) params.append("date", date);
    if (sort) params.append("sort", sort);

    // games (buttons active)
    const activeGameButtons = document.querySelectorAll(".filter-btn.active[data-type='game']");
    if (activeGameButtons.length > 0) {
        const games = Array.from(activeGameButtons).map(btn => btn.dataset.value);
        params.append("games", games.join(","));
    }

    // condition
    const activeConditionButtons = document.querySelectorAll(".filter-btn.active[data-type='condition']");
    if (activeConditionButtons.length > 0) {
        const conditions = Array.from(activeConditionButtons).map(btn => btn.dataset.value);
        params.append("conditions", conditions.join(","));
    }

    // rarity
    const rarity = document.querySelector("input[name='rarity']:checked");
    if (rarity) {
        params.append("rarity", rarity.value);
    }

    return params.toString();
}

// ========================
// FETCH + FILTER (MOCK)
// ========================

async function fetchCards() {
    // API READY:
    // const queryString = buildQuery();
    // const response = await fetch(`/api/cards?${queryString}`);
    // return await response.json();

    // MOCK fallback
    return mockData;
}

function fetchAndRender() {
    const queryString = buildQuery();
    const params = new URLSearchParams(queryString);

    let filtered = [...mockData];

    const name = params.get("name");
    if (name) {
        filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    const vendor = params.get("vendor");
    if (vendor) {
        filtered = filtered.filter(c =>
            c.vendor.toLowerCase().includes(vendor.toLowerCase())
        );
    }

    const games = params.get("games");
    if (games) {
        const arr = games.split(",");
        filtered = filtered.filter(c => arr.includes(c.game));
    }

    const conditions = params.get("conditions");
    if (conditions) {
        const arr = conditions.split(",");
        filtered = filtered.filter(c => arr.includes(c.condition));
    }

    const rarity = params.get("rarity");
    if (rarity) {
        filtered = filtered.filter(c => c.rarity === rarity);
    }

    const sort = params.get("sort");

    if (sort === "price") filtered.sort((a, b) => a.price - b.price);
    if (sort === "date") filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === "rarity") {
        const order = ["common", "uncommon", "rare", "ultra-rare"];
        filtered.sort((a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity));
    }

    state.totalResults = filtered.length;

    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;

    state.results = filtered.slice(start, end);

    renderResults();
    renderPagination();
    updateResultsHeader();
}

// =======================
// CARD MODAL
// =======================

// GET CARD FROM MOCK
async function fetchCardById(id) {
    // API READY:
    // const response = await fetch(`/api/cards/${id}`);
    // if (!response.ok) throw new Error("Card not found");
    // return await response.json();

    return mockData.find(card => card.id === id);
}

// RENDER MODAL
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


// ========================
// RENDER CARDS
// ========================

function getCategoryImage(category) {
    switch (category) {
        case "pokemon":
            return "images/design/pokemon_trading_card_game_logo.png";
        case "ygo":
            return "images/design/Yu-Gi-Oh-Logo.png";
        case "mgt":
            return "images/design/Magic-The-Gathering-Logo.png";
        case "sports":
            return "images/design/football.png";
        default:
            return
    }
}

// Optional: format date nicely
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

function getCorrectHTML(category) {
    if (category === "other") {
        return `<p>Other</p>`;
    }

    const categoryImg = getCategoryImage(category);

    return `<img class="game_logo" src="${categoryImg}" alt="${category} logo">`;
}

function renderResults() {
    const container = document.getElementById("cards_container");
    container.innerHTML = "";

    state.results.forEach(card => {
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");

        cardEl.innerHTML = `
            <div class="card_item">

                <img class="card_image" src="${card.image}" alt="${card.name}">

                <div class="card_info">

                    <h2>${card.name}</h2>
                    
                    ${getCorrectHTML(card.game)}

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

                    <p class="extra">${card.rarity} | ${card.condition}</p>

                </div>

                <div class="card_price">
                    <p>$ ${card.price}</p>
                    <button class="viewmore">View More</button>
                </div>

            </div>
        `;

        cardEl.querySelector(".viewmore").addEventListener("click", () => {
            openCardModal(card.id);
        });

        cardEl.querySelector(".card_image").addEventListener("click", (e) => {
            e.preventDefault();
            openCardModal(card.id);
        });

        container.appendChild(cardEl);
    });
}

// ========================
// PAGINATION
// ========================
function renderPagination() {
    const container = document.querySelector(".pagination");
    container.innerHTML = "";

    const totalPages = Math.ceil(state.totalResults / state.pageSize);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        if (i === state.page) btn.classList.add("active");

        btn.addEventListener("click", () => {
            state.page = i;
            fetchAndRender();
        });

        container.appendChild(btn);
    }
}

// ========================
// HEADER RESULTS COUNT
// ========================
function updateResultsHeader() {
    const p = document.querySelector(".results_header p");
    p.textContent = `${state.totalResults} results found`;
}

// ========================
// EVENTS
// ========================
document.addEventListener("DOMContentLoaded", () => {

    // Search button
    document.getElementById("search_button").addEventListener("click", () => {
        const searchValue = document.getElementById("search_bar").value;
        if (!searchValue) return;

        // 1. Copy to filter input
        document.getElementById("filter_name").value = searchValue;

        // 2. Reset page
        state.page = 1;

        // 3. Apply filters
        fetchAndRender();
    });

    document.getElementById("search_bar").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            document.getElementById("search_button").click();
        }
    });

    // Apply button
    document.querySelector(".apply").addEventListener("click", () => {
        state.page = 1;
        fetchAndRender();
    });

    // Sort
    document.querySelector(".sort").addEventListener("change", () => {
        fetchAndRender();
    });

    // Category buttons (hero)
    document.querySelectorAll(".category").forEach(btn => {
        btn.addEventListener("click", () => {

            const selectedCategory = btn.dataset.category;

            // 1. Reset ALL game filter buttons
            document.querySelectorAll(".filter-btn[data-type='game']")
                .forEach(b => b.classList.remove("active"));

            // 2. Activate the correct one
            const targetBtn = document.querySelector(
                `.filter-btn[data-type='game'][data-value='${selectedCategory}']`
            );

            if (targetBtn) {
                targetBtn.classList.add("active");
            }

            // 3. Reset page + fetch
            state.page = 1;
            fetchAndRender();
        });
    });

    // Toggle filter buttons
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("active");
        });
    });

    const params = new URLSearchParams(window.location.search);

    // NAME
    const name = params.get("name");
    if (name) {
        document.getElementById("filter_name").value = name;
    }

    // GAME
    const game = params.get("game");
    if (game) {
        const btn = document.querySelector(
            `.filter-btn[data-type='game'][data-value='${game}']`
        );

        if (btn) {
            btn.classList.add("active");
        }
    }

    // Initial load
    fetchAndRender();
});

