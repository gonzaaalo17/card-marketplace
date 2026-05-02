
// ========================
// BUILD QUERY
// ========================

let currentPage = 1;
const pageSize = 4;

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
        const collections = Array.from(activeGameButtons).map(btn => btn.dataset.value);
        params.append("collections", collections.join(","));
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

async function fetchCards(page) {
    const queryString = buildQuery();

    const response = await fetch(
        `/api/cards/search?page=${page - 1}&size=${pageSize}&${queryString}`
    );

    return await response.json();
}

async function fetchAndRender(page = currentPage) {
    const data = await fetchCards(page);

    renderResults(data.content);
    renderPagination(data.totalElements, page);
    updateResultsHeader(data.totalElements);

    currentPage = page;
}

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


// ========================
// RENDER CARDS
// ========================

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

    return `<img class="game_logo" src="${categoryImg}" alt="${category} logo">`;
}

function renderResults(results) {
    const container = document.getElementById("cards_container");
    container.innerHTML = "";

    results.forEach(card => {
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");

        cardEl.innerHTML = `
            <div class="card_item">

                <img class="card_image" src="${card.image}" alt="${card.name}">

                <div class="card_info">

                    <h2>${card.name}</h2>
                    
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
function renderPagination(totalResults, page) {
    const container = document.querySelector(".pagination");
    container.innerHTML = "";

    const totalPages = Math.ceil(totalResults / pageSize);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        if (i === page) btn.classList.add("active");

        btn.addEventListener("click", () => {
            fetchAndRender(i);
        });

        container.appendChild(btn);
    }
}

// ========================
// HEADER RESULTS COUNT
// ========================
function updateResultsHeader(resultsCount) {
    const p = document.querySelector(".results_header p");
    p.textContent = `${resultsCount} results found`;
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

        // 3. Apply filters
        fetchAndRender(1);
    });

    document.getElementById("search_bar").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            document.getElementById("search_button").click();
        }
    });

    // Apply button
    document.querySelector(".apply").addEventListener("click", () => {
        fetchAndRender(1);
    });

    // Sort
    document.querySelector(".sort").addEventListener("change", () => {
        fetchAndRender(1);
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
            fetchAndRender(1);
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
    fetchAndRender(1);
});

