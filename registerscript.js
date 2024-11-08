document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("registerForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // For demonstration purposes, just alert the entered data
        alert(`Name: ${name}\nEmail: ${email}\nPassword: ${password}`);

        // Implement your form submission logic here
        // e.g., send data to the server using AJAX
    });
});
