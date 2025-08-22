function checkPassword() {
    const encodedPassword = "Q2Fubm9uQ2FyZXMh";
    const correctPassword = atob(encodedPassword);

    const enteredPassword = document.getElementById("passwordInput").value;
    const protectedContent = document.getElementById("protectedContent");
    const passwordPrompt = document.getElementById("passwordPrompt");

    if (enteredPassword === correctPassword) {
        passwordPrompt.style.display = "none";
        protectedContent.style.display = "block";
    } else {
        alert("Incorrect password. Please try again.");
    }
}
