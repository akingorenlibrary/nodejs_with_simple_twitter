const User=require("../models/user");
const ProfileControllerFile=require("../controllers/profileController");

module.exports.usernameControl=(req,res,next)=>{

User.findOne({
    username: req.params.username
}, (err, user) => {
    if (user) {
        if (user.username == req.session["username"]) 
        {
            return next();
        } 
        else {
            return res.render("pages/NotFound",{NotFoundPage:true,title:"Not Found"})

        }
    } else {
        return res.render("pages/NotFound",{NotFoundPage:true,title:"Not Found"})

    }
})

}