const confirmModal = document.getElementById("modal-confirm");
const errorModal = document.getElementById("modal-error");
const confirmText = confirmModal.querySelector("p");
const errorText = errorModal.querySelector("p");

function show_confirmation(message) {
    confirmText.textContent = message;

    // Mostrar
    confirmModal.classList.remove("hidden");

    // Trigger animación
    setTimeout(() => {
        confirmModal.classList.add("show");
    }, 10);

    // Ocultar automáticamente
    setTimeout(() => {
        confirmModal.classList.remove("show");

        setTimeout(() => {
            confirmModal.classList.add("hidden");
        }, 400); // espera a que termine animación
    }, 2500);
}

function show_cancel(message) {
    errorText.textContent = message;

    // Mostrar
    errorModal.classList.remove("hidden");

    // Trigger animación
    setTimeout(() => {
        errorModal.classList.add("show");
    }, 10);

    // Ocultar automáticamente
    setTimeout(() => {
        errorModal.classList.remove("show");

        setTimeout(() => {
            confirmModal.classList.add("hidden");
        }, 400); // espera a que termine animación
    }, 2500);
}
