var sayi = 1;
var sifre = document.querySelector("#sifre");
var inputsifre = document.querySelector("#inputsifre");

sifre.innerHTML = "";
sifre.innerHTML = "<img src='/images/closeeye.svg' alt='Bootstrap'>";

sifre.addEventListener("click", () => {
    sayi++;
    if (sayi % 2 == 0) {
        sifre.innerHTML = "";
        sifre.innerHTML = "<img src='/images/openeye.svg' alt='Bootstrap'>";
        inputsifre.type = "text";
    } else {
        sifre.innerHTML = "";
        sifre.innerHTML = "<img src='/images/closeeye.svg' alt='Bootstrap'>";
        inputsifre.type = "password";
    }
});
