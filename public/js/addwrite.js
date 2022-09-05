var metin=document.querySelector("#metin");
var karakterSayaci=document.querySelector("#karakterSayaci");

metin.addEventListener("keypress",say);
metin.addEventListener("keyup",say);

function say()
{
    var getmetin=metin.value;
    if(getmetin.length>200)
    {
        metin.value=metin.value.substring(0, 200)
    }
    karakterSayaci.innerHTML=`${getmetin.length}/200`;
}