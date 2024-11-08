document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("searchForm").addEventListener("submit", function(event) {
        event.preventDefault();
        searchRides();
    });
});

function searchRides() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const date = document.getElementById("date").value;

    // For demonstration purposes, just alert the entered data
    alert(`Searching for rides from ${from} to ${to} on ${date}`);

    // Implement your search logic here
    // For now, let's display a dummy result
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = `
        <h2>Search Results</h2>
        <p>Found a ride from ${from} to ${to} on ${date}.</p>
    `;
}
