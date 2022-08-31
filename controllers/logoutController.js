module.exports.logout=(req,res)=>{
    req.flash("flashSuccess","Çıkış Yapıldı");
   // res.clearCookie("username");  
   async function bekle()
   {
    await delete req.session["username"];
    await delete res.clearCookie("jwt");
    return res.redirect("/login/username");
   }
   bekle();
}