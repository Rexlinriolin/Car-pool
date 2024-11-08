document.addEventListener("DOMContentLoaded", function() {
    // Example of adding an event listener to the buttons
    let buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            alert("Button clicked: " + this.innerText);
        });
    });
});
