module.exports.pageControlSession=(req,res,next)=>{ //session var ise bu sayfalara girmesin
if(req.session["username"])
{
return res.render("pages/NotFound",{NotFoundPage:true,title:"Not Found"})
}
next();
}


module.exports.pageControlNotSession=(req,res,next)=>{//session yok ise bu sayfalara girmesin
if(!(req.session["username"]))
{
return res.redirect("/login/username");
}
next();
}

 /*
    if(req.session["username"])
   {
        //==undefined) && (req.url=="/addwrite" || req.url=="/logout" || req.url=="/")
        //addwrite ve profile ve logout sayfalarına erişemememiz gerekiyor
            return res.redirect(`/login/username`);
   }
   else
   {
        // if( (req.session["username"]!=undefined) && (req.url=="/login/username" || req.url=="/login/password" || req.url=="/register" || req.url=="/reset-password"))
        //login ve register sayfalarına erişemememiz gerekiyor
            return res.redirect("/");
   }  
   //next();
 */