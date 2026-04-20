


// ========================
// FIELDS
// ========================

const vendorInput = document.getElementById("vendor_ip");
const currentUser = localStorage.getItem("username");

function autoFillVendor() {
    if (currentUser) {
        vendorInput.value = currentUser;
        vendorInput.disabled = true;
    } else {
        vendorInput.placeholder = "Peter Parker";
        vendorInput.disabled = false;
    }
}

// Exec function when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    autoFillVendor();

    // ========================
    // EVENTS
    // ========================

    // Image preview
    const fileInput = document.querySelector(".choose");
    const preview = document.getElementById("preview");
    const placeholder = document.getElementById("placeholder");
    const frame = document.querySelector(".image_frame");

    frame.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = "block";
                preview.style.width = "100%";
                preview.style.height = "100%";
                preview.style.objectFit = "cover";
                preview.style.borderRadius = "30px";

                placeholder.style.display = "none";
            };

            reader.readAsDataURL(file);
        }
    });

    // Submit form
    const submitBtn = document.querySelector(".submit");
    const error_label = document.getElementById("error_submission");

    function validate_sell_fields(data){
        for (let [key, value] of Object.entries(data)) {
            if (value === null || value === undefined) {
                return false;
            }

            if (String(value).trim() === "") {
                return false;
            }
        }
        return true;
    }

    function getFormData(data, fileInput) {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("vendor", data.vendor);
        formData.append("price", data.price);
        formData.append("rarity", data.rarity);
        formData.append("condition", data.condition);
        formData.append("collection", data.collection);
        formData.append("description", data.description);

        if (fileInput.files.length > 0) {
            formData.append("image", fileInput.files[0]);
        }
        return formData;
    }

    // AI Gen: Clear Up form if submit is SUCCESS
    function clearUpForm() {
        const form = document.querySelector("form");
        const preview = document.getElementById("preview");
        const placeholder = document.getElementById("placeholder");
        const fileInput = document.querySelector(".choose");

        // Fade out
        form.style.transition = "opacity 0.4s ease";
        form.style.opacity = "0";

        setTimeout(() => {
            // Reset form fields
            form.reset();

            // Reset vendor autofill
            autoFillVendor();

            // Reset image preview
            preview.src = "";
            preview.style.display = "none";

            placeholder.style.display = "block";

            fileInput.value = ""; // importante para permitir re-subir misma imagen

            // Fade in
            form.style.opacity = "1";

        }, 400);
    }

    submitBtn.addEventListener("click", async () => {
        submitBtn.disabled = true; // Disable button to avoid spam-click

        try {
            const data = {
                name: document.getElementById("card_name_ip").value,
                vendor: document.getElementById("vendor_ip").value,
                price: parseFloat(document.getElementById("price_ip").value),
                rarity: document.getElementById("rarity_ip").value,
                condition: document.getElementById("condition_ip").value,
                collection: document.getElementById("collection_ip").value,
                description: document.getElementById("description_ip").value,
            };

            if (!validate_sell_fields(data)) {
                error_label.classList.remove("hidden");
                show_cancel("Form not submitted");
                return;
            }

            const token = localStorage.getItem("token");

            // if (!token) {
            //     error_label.classList.add("hidden");
            //     open_log_modal();
            //     return;
            // }

            const formData = getFormData(data, fileInput);

            const response = await fetch("/api/cards/new", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                show_cancel("Failed to submit card");
                throw new Error("Failed to submit card");
            }

            const result = await response.json(); // For debug in console log
            error_label.classList.add("hidden");
            clearUpForm();

            console.log("SUCCESS:", result);
            show_confirmation("Form submitted correctly.");

        } finally {
            submitBtn.disabled = false; // Enable button always at end of function
        }
    });
});





