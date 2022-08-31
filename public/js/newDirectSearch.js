var arainput=document.querySelector("#user");
var arabtn=document.querySelector("#arabtn");
var results=document.querySelector("#results");
var userList=document.querySelector("#userList");
results.style.display="none";


arabtn.addEventListener("click",()=>{
    gonder();
});

arainput.addEventListener("keypress",(e)=>{
    if(e.key=="Enter")
    {
        gonder();
    }
});

function gonder()
{
    var img;
    const veri={user:arainput.value};
    fetch("/direct/new/search/",{
        method:"POST",
        body:JSON.stringify(veri),
        headers:{
            'content-type': 'application/json'
        }
    })
    .then(result=>result.json())
    .then(response=>{
        userList.style.display="block";
        results.style.display="none";
        
        if(response.otherUsername)
        {
            if(response.otherUser_image)
            {
                img="<img src=/user-images/"+response.otherUsername+"/"+response.otherUser_image+" width=60 height=60 class=!rounded float-start' alt='...'>";
            }
            else
            {
                img="<img src='/images/user.png' width=60 height=60  class='rounded float-start' alt='...'>";
            }
            userList.innerHTML="<a style='color:black' href='/"+response.otherUsername+"'>"+
            "<div class='row' style='padding:10px'>"+
                "<div class='col-md-12'>"+
                   "<hr>"+img+"&nbsp&nbsp&nbsp@"+response.otherUsername+"<hr>"+
                "</div>"+
            "</div>"+
            "</a>";
        }
        else
        {
            userList.style.display="none";
            results.style.display="block";
            results.innerHTML=response.message;
        }
        arainput.value="";
    })
    .catch(err=>{
        userList.style.display="none";
        results.style.display="block";
        results.innerHTML="Hata oluştu";
        arainput.value="";
    });
}