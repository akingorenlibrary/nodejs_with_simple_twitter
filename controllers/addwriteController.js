const Write = require("../models/writes");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const {
    addWriteFormControl
} = require("../validation/formValidation");

module.exports.getaddwrite = (req, res) => {
    /*
    if (req.cookies["username"]) {
        res.render("pages/addwrite", {
            user: req.cookies["username"]
        });
    }
    else{
        res.render("pages/404")
    }
    */
    /*
     if (req.session["username"]) {
         res.render("pages/addwrite", {
             user: req.session["username"]
         });
     }
     else{
         res.render("pages/404")
     }
     */
    res.render("pages/addwrite", {
        user: req.session["username"],
        activeAddwrite: true,
        title: "Add Write",
        addwritePage:true,
        buttonBlock:true
    });
}

module.exports.postaddwrite = (req, res) => {
        
            const {
                metin
            } = req.body;
    
            const kontrol = addWriteFormControl(metin);
            console.log(kontrol);
            if (!(kontrol.length > 0)) {
                User.findOne({
                    username: req.session["username"]
                }, (err, user) => {
                    if (user) {
                        const add = new Write({
                            user_id: user._id,
                            username: user.username,
                            getwrite: metin
                        });
                        add.save()
                            .then(result => {
                                req.flash("flashSuccess", "Metin Paylaşıldı");
                                return res.redirect("/addwrite");
                            })
                            .catch(err => {
                                req.flash("flashError", "Metin Paylaşılamadı");
                                return res.redirect("/addwrite");
                            })
                    }
                })
            } else {
                req.flash("flashError", `${kontrol}`);
                return res.redirect("/addwrite");
            }
        
        

}