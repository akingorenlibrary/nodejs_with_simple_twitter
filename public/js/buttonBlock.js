var buttonBlock=document.getElementsByName("buttonBlock");
if(buttonBlock)
{
    for(let n=0;n<buttonBlock.length;n++)
{
    let i=0;
    buttonBlock[n].addEventListener("click",(e)=>{
        //console.log(i)
        if(i>0)
        {
            e.preventDefault();
        }
        i++;
    
    });
    
}
}