var addmorebutton = document.querySelector("#addmore");
var morepostlistele = document.querySelector("#morepostlistele");
var buttonrow = document.querySelector("#buttonrow");
var goruldu = document.querySelector("#goruldu");
var sayac = 10,gorunenpostsayisi=10;

if (addmorebutton) {
    buttonrow.style.display="block";
    addmorebutton.addEventListener("click", (e) => {
        e.preventDefault();
        const veri = {
            syc: sayac
        }
        fetch("/profile/addmore", {
                method: 'POST',
                body: JSON.stringify(veri),
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(getresponse => {
                //console.log("getresponse: ",getresponse.morePost)
                    if(getresponse.morePost.length>0)
                    {
                        for(let i=0;i<getresponse.morePost.length;i++)
                        {
                                morepostlistele.innerHTML +="<div class='row' style='margin-top:20px'>"+
                                    "<div class='col-md-12'>"+
                                        "<div class='card'>"+
                                            "<div class='card-header'>"+
                                                "@"+getresponse.morePost[i].username+
                                            "</div>"+
                                            "<div class='card-body'>"+
                                                "<blockquote class='blockquote mb-0'>"+
                                                    +getresponse.morePost[i].metin+
                                                "</blockquote>"+
                                            "</div>"+
                                            "<div style='text-align:right;padding:5px'>"+
                                                ""+getresponse.morePost[i].date+
                                            "</div>"+
                                            "<hr>"+
                                            "<div style='text-align:right;padding:5px'>"+
                                            "<a  role='button' href='/"+getresponse.morePost[i].username+"/post-delete/"+getresponse.morePost[i].postid+"' class='btn btn-danger'>Sil</a>&nbsp;"+
                                            "<a  role='button' href='/"+getresponse.morePost[i].username+"/post-update/"+getresponse.morePost[i].postid+"' class='btn btn-primary'>Düzenle</a>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>";
                        
                        }
                        if(getresponse.sonrakiresult==0)
                        {
                            buttonrow.style.display="none";
                        }
                        else
                        {
                        gorunenpostsayisi +=getresponse.morePost.length;
                        addmorebutton.innerHTML = "Daha fazla göster "+(gorunenpostsayisi)+"/"+getresponse.tumpostsayisi;
                        }
                    }
                    else
                    {
                        buttonrow.style.display="none";
                    }
            })
            .catch(err => console.log("hata"));

        sayac += 10;
    });

}