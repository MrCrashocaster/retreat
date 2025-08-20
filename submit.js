document.getElementById("id_of_textbox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("id_of_button").click();
    }
});
