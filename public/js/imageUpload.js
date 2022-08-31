var fileInput = document.querySelector(".custom-file-input");
var fileNameSpan = document.querySelector(".custom-file-label");

fileInput.addEventListener("change", (e) => {
    //console.log(fileInput.files[0].name);
fileNameSpan.innerHTML = fileInput.files[0].name;
});

