document.getElementById("passwordPrompt")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("passwordPrompt").click();
    }
});
