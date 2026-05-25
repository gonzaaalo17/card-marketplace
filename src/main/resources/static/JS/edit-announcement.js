// ========================
// INIT
// ========================

let currentCardId = null;

document.addEventListener("DOMContentLoaded", () => {

    loadCard();

    setupImagePreview();

    const form = document.getElementById("edit-form");

    form.addEventListener("submit", updateCard);
});

// ========================
// LOAD CARD
// ========================

async function loadCard() {

    try {

        const params =
            new URLSearchParams(window.location.search);

        // Get id from localStorage
        const cardId = localStorage.getItem("editing_card_id");
        currentCardId = cardId;

        // Remove id from localStorage
        localStorage.removeItem("editing_card_id");

        if (!cardId) {
            throw new Error("No card id provided");
        }

        const response = await fetch(
            `/api/cards/${cardId}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Failed loading card");
        }

        const card = await response.json();

        renderCard(card);

    } catch(error) {

        console.error(error);

        show_cancel("Failed loading card");
    }
}

// ========================
// RENDER CARD
// ========================

function renderCard(card) {

    document.getElementById("card_name_ip")
        .value = card.name;

    document.getElementById("vendor_ip")
        .value = card.vendor;

    document.getElementById("price_ip")
        .value = card.price;

    document.getElementById("rarity_ip")
        .value = card.rarity;

    document.getElementById("condition_ip")
        .value = card.condition;

    document.getElementById("collection_ip")
        .value = card.collection;

    document.getElementById("description_ip")
        .value = card.description || "";

    if (card.image) {

        const preview =
            document.getElementById("preview");

        const placeholder =
            document.getElementById("placeholder");

        preview.src = card.image;
        preview.style.display = "block";

        placeholder.style.display = "none";
    }
}

// ========================
// IMAGE PREVIEW
// ========================

function setupImagePreview() {

    const fileInput =
        document.getElementById("card_image");

    const preview =
        document.getElementById("preview");

    const placeholder =
        document.getElementById("placeholder");

    const frame =
        document.querySelector(".image_frame");

    frame.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {

            preview.src = e.target.result;

            preview.style.display = "block";

            placeholder.style.display = "none";
        };

        reader.readAsDataURL(file);
    });
}

// ========================
// VALIDATION
// ========================

function validateCardFields() {

    const name =
        document.getElementById("card_name_ip").value;

    const price =
        document.getElementById("price_ip").value;

    return (
        name.trim() !== "" &&
        price.trim() !== ""
    );
}

// ========================
// UPDATE CARD
// ========================

const error_label = document.getElementById("error_submission")

async function updateCard(event) {

    event.preventDefault();

    try {

        if (!validateCardFields()) {
            error_label.classList.remove("hidden");
            show_cancel("Please fill mandatory fields");
            return;
        }

        const formData = new FormData();

        formData.append(
            "name",
            document.getElementById("card_name_ip").value
        );

        formData.append(
            "price",
            document.getElementById("price_ip").value
        );

        formData.append(
            "rarity",
            document.getElementById("rarity_ip").value
        );

        formData.append(
            "condition",
            document.getElementById("condition_ip").value
        );

        formData.append(
            "collection",
            document.getElementById("collection_ip").value
        );

        formData.append(
            "description",
            document.getElementById("description_ip").value
        );

        const imageInput =
            document.getElementById("card_image");

        if (imageInput.files.length > 0) {

            formData.append(
                "image",
                imageInput.files[0]
            );
        }

        formData.append("id", currentCardId);

        const response = await fetch(
            "/api/cards/update",
            {
                method: "PUT",
                credentials: "include",
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error("Failed updating card");
        }
        error_label.classList.add("hidden");
        show_confirmation("Announcement updated");

    } catch(error) {
        console.error(error);
        error_label.classList.add("hidden");
        show_cancel("Announcement not updated");
    }
}