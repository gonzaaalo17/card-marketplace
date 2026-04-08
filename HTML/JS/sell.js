
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

    submitBtn.addEventListener("click", async () => {
        const data = {
            name: document.getElementById("card_name_ip").value,
            vendor: document.getElementById("vendor_ip").value,
            price: document.getElementById("price_ip").value,
            rarity: document.getElementById("rarity_ip").value,
            condition: document.getElementById("condition_ip").value,
            collection: document.getElementById("collection_ip").value,
            description: document.getElementById("description_ip").value,
            image: preview.src
        };

        console.log("preview.src:", data);
        console.log(validate_sell_fields(data))

        if (!validate_sell_fields(data)){
            error_label.classList.remove("hidden");
            show_cancel("Form not submited");
            return
        }

        const token = localStorage.getItem("token");

        if (!token) {
            // No logged in → open login modal
            error_label.classList.add("hidden");
            open_log_modal();
            return;
        }
        
        const response = await fetch("http://localhost:8080/api/cards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            show_cancel("Failed to submit card");
            throw new Error("Failed to submit card");
        }

        const result = await response.json();
        error_label.classList.add("hidden");
        console.log("SUCCESS:", result);
        show_confirmation("Form submitted correctly.");
    });
});





