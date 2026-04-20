// ========================
// FIELDS
// ========================

const inputs = [
    document.getElementById("name_ip"),
    document.getElementById("lastname_ip"),
    document.getElementById("email_ip")
];

const localStorageData = [
    localStorage.getItem("name"),
    localStorage.getItem("lastname"),
    localStorage.getItem("email")
];

function autoFill() {
    for (let i = 0; i < inputs.length; i++) {
        if (localStorageData[i]) {
            inputs[i].value = localStorageData[i];
            inputs[i].disabled = true;
        }
    }
}

// Exec function when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    autoFill();

    // ========================
    // EVENTS
    // ========================

    // Submit form
    const submitBtn = document.querySelector(".submit");
    const error_label = document.getElementById("error_submission");
    const contact_labels = [
        document.getElementById("contact_error_name"),
        document.getElementById("contact_error_lastname"),
        document.getElementById("contact_error_email"),
        document.getElementById("contact_error_subject")
    ];

    function validate_subject(label, subject) {
        if (!subject || subject.trim() === "") {
            show_error(label);
            return false;
        }
        hide_error(label);
        return true;
    }

    function validate_contact_fields(data, labels){
        let valid = true;

        valid = validate_names(labels[0], data.name) && valid;
        valid = validate_names(labels[1], data.lastname) && valid;
        valid = validate_email(labels[2], data.email) && valid;
        valid = validate_subject(labels[3], data.subject) && valid;

        return valid
    }

    submitBtn.addEventListener("click", async () => {
        const required_data = {
            name: document.getElementById("name_ip").value,
            lastname: document.getElementById("lastname_ip").value,
            email: document.getElementById("email_ip").value,
            subject: document.getElementById("subject_ip").value,
        };

        const optional_data = {
            msg: document.getElementById("message_ip").value,
            file: document.getElementById("choose_ip").value,
        };

        const all_data = { ...required_data, ...optional_data };

        if (!validate_contact_fields(required_data, contact_labels)){
            show_cancel("Form not submited");
            return
        }

        console.log("SUCCESS:", all_data);
        show_confirmation("Form submitted correctly.");
    });
});

