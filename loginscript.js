document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // For demonstration purposes, just alert the entered data
        alert(`Email: ${email}\nPassword: ${password}`);

        // Implement your form submission logic here
        // e.g., send data to the server using AJAX
    });
});
