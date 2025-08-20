function checkPassword() {
        const correctPassword = "CannonCares!"; // Replace with your desired password
        const enteredPassword = document.getElementById("passwordInput").value;
        const protectedContent = document.getElementById("protectedContent");
        const passwordPrompt = document.getElementById("passwordPrompt");

        if (enteredPassword === correctPassword) {
            passwordPrompt.style.display = "none"; // Hide the password prompt
            protectedContent.style.display = "block"; // Show the protected content
        } else {
            alert("Incorrect password. Please try again.");
        }
    }
