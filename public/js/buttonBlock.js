var buttonBlock=document.querySelectorAll("#buttonBlock");
if(buttonBlock)
{
    for(let n=0;n<buttonBlock.length;n++)
{
    let i=0;
    buttonBlock[n].addEventListener("click",(e)=>{
        if(i>0)
        {
            e.preventDefault();
        }
        i++;
    
    });
    
}
}