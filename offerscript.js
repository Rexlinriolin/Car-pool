document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("form").addEventListener("submit", function(event) {
        event.preventDefault();
        const from = document.getElementById("from").value;
        const to = document.getElementById("to").value;
        const date = document.getElementById("date").value;
        const seats = document.getElementById("seats").value;

        // For demonstration purposes, just alert the entered data
        alert(`From: ${from}\nTo: ${to}\nDate: ${date}\nSeats: ${seats}`);

        // Implement your form submission logic here
        // e.g., send data to the server using AJAX
    });
});
