var sayi = 1;
var sifre = document.querySelectorAll("#sifre");
var inputsifre = document.getElementsByClassName("form-control password");

for(let i=0;i<sifre.length;i++)
{
    sifre[i].innerHTML = "";
    sifre[i].innerHTML = "<img src='/images/closeeye.svg' alt='Bootstrap'>";
}

for(let n=0;n<sifre.length;n++)
{
    sifre[n].addEventListener("click", () => {
      
        sayi++;
        if (sayi % 2 == 0) {
            sifre[n].innerHTML = "";
            sifre[n].innerHTML = "<img src='/images/openeye.svg' alt='Bootstrap'>";

            if(inputsifre.length>0)
            inputsifre[n].type = "text";
            else
            inputsifre.type = "text";

        } else {
            sifre[n].innerHTML = "";
            sifre[n].innerHTML = "<img src='/images/closeeye.svg' alt='Bootstrap'>";
   
            if(inputsifre.length>0)
            inputsifre[n].type = "password";
            else
            inputsifre.type = "password";

        }
    });
}
