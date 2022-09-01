const socket=io.connect("http://localhost:3000/");
const output=document.querySelector("#output");
const feedback=document.querySelector("#feedback");
const message=document.querySelector("#message");
const gonderbtn=document.querySelector("#gonderbtn");
const user=document.querySelector("#user");
const receiver=document.querySelector("#receiver");
const chatWindow=document.querySelector("#chat-window");


scroll();
message.addEventListener("keypress",(e)=>
{
    if(e.key=="Enter")
    {
        gonder();
       
    }
});


gonderbtn.addEventListener("click",()=>{
   gonder();
});



function gonder()
{
    socket.emit("chat",{
        message:message.value,
        sender:user.value,
        receiver:receiver.innerHTML
    });
    message.value="";
}

socket.on("chat",(data)=>{

    if((data.sender==user.value || data.receiver==user.value ) && (receiver.innerHTML==data.sender || receiver.innerHTML==data.receiver) )
    {
        if(data.sender !=user.value)
        {
            output.innerHTML+="<b>"+data.sender+" : "+data.message+"</b> <br>";
        }
        else
        {
            output.innerHTML+="<div style='background-color:'#eee'>"+data.sender+" : "+data.message+"</div>";
        }
    }
    scroll();

  });


function scroll(){
    chatWindow.scrollTop = chatWindow.scrollHeight;
}