function showAdditionalFields() {
    const educationLevel = document.getElementById("education-level").value;
    const majorField = document.getElementById("major-field");
    const semesterField = document.getElementById("semester-field");

    if (educationLevel === "bachelors" || educationLevel === "masters") {
        majorField.style.display = "block";
        semesterField.style.display = "block";
    } else {
        majorField.style.display = "none";
        semesterField.style.display = "none";
    }
}
