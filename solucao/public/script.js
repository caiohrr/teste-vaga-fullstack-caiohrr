// public/script.js

function updateFileName(input) {
    console.log("File selected:", input.files[0]?.name);
    const file_name = input.files[0]?.name || "No file chosen";
    input.parentElement.nextElementSibling.textContent = file_name;
}
