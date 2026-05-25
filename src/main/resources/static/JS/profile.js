// ========================
// INIT
// ========================

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    setupImagePreview();

    const form = document.getElementById("profile-form");
    form.addEventListener("submit", updateProfile);
});

async function loadProfile() {
    try {
        const username = localStorage.getItem("username");
        const response = await fetch(`/api/users/${username}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            show_cancel("Failed loading profile");
            throw new Error("Failed loading profile");
        }

        const user = await response.json();

        document.getElementById("username_ip").value = user.username;
        document.getElementById("name_ip").value = user.name;
        document.getElementById("surname_ip").value = user.surname;
        document.getElementById("email_ip").value = user.email;

        if (user.image) {
            document.getElementById("preview").src = user.image;
        }

    } catch(error) {
        console.error(error);
        show_cancel("Failed loading profile");
    }
}

function setupImagePreview() {

    const fileInput = document.getElementById("profile_image");
    const preview = document.getElementById("preview");
    const frame = document.querySelector(".image_frame");

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
        };

        reader.readAsDataURL(file);
    });
}

// ========================
// UPDATE PROFILE
// ========================

function validate_profile_fields(data, labels){
    let valid = true;

    valid = validate_names(labels[0], data.name) && valid;
    valid = validate_names(labels[1], data.surname) && valid;
    valid = validate_email(labels[2], data.email) && valid;

    return valid
}

async function updateProfile(event) {
    event.preventDefault();
    try {
        const username = document.getElementById("username_ip").value;

        const required_data = {
            name: document.getElementById("name_ip").value,
            surname: document.getElementById("surname_ip").value,
            email: document.getElementById("email_ip").value
        };

        const labels = [
            document.getElementById("profile_error_name"),
            document.getElementById("profile_error_surname"),
            document.getElementById("profile_error_email")
        ];

        if (!validate_profile_fields(required_data, labels)){
            console.log("Profile form was not sent. ❌");
            show_cancel("Profile form was not sent");
            return
        }

        const formData = new FormData();

        formData.append(
            "name",
            required_data.name
        );

        formData.append(
            "surname",
            required_data.surname
        );

        formData.append(
            "email",
            required_data.email
        );

        const imageInput =
            document.getElementById("profile_image");

        if (imageInput.files.length > 0) {
            formData.append(
                "image",
                imageInput.files[0]
            );
        }

        const response = await fetch(
            `/api/users/update`,
            {
                method: "PUT",
                credentials: "include",
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error("Failed updating profile");
            show_cancel("Profile not updated");
        }
        show_confirmation("Profile updated");

    } catch(error) {
        console.error(error);
        show_cancel("Profile not updated");
    }
}