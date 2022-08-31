const jwt = require('jsonwebtoken');

module.exports.jwtControl=(req,res,next)=>{
    if(req.cookies["jwt"])
    {
        jwt.verify(req.cookies["jwt"], 'secretosho', function(err, decoded) {
    
            if(decoded)
                {
                   return  next();
                }
            if(err)
                {
                    req.flash("flashError", `Hata Oluştu`);
                    return res.redirect("/logout");
                }
    
        });
    }
    else
    {
        req.flash("flashError", `Hata Oluştu`);
        return res.redirect("/logout");
    }
}