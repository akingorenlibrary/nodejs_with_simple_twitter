const formValidationFile = require("../validation/formValidation");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports.getRegister = (req, res) => {
    /*
    if (!(req.cookies["username"])) {
    res.render("pages/register",{activeRegister:true});
} else {
    res.render("pages/404",{ user:req.cookies["username"]})
}
*/
    /*
    if (!(req.session["username"])) {
        res.render("pages/register",{activeRegister:true});
    } else {
        res.render("pages/404",{ user:req.session["username"]})
    }
    */
    res.render("pages/register", {
        activeRegister: true,
        title: "Register"
    });
}



module.exports.postRegister = (req, res) => {
    const errors = [];
    const {
        username,
        email,
        password
    } = req.body;
    const getUsername = username.toLowerCase();
    const kontrol = formValidationFile.formValidation(getUsername, email, password);
    if (kontrol.length > 0) {
        console.log(kontrol);
        return res.render("pages/register", {
            errormessage: kontrol,
            username: getUsername,
            email: email,
            password: password,
            activeRegister: true
        });
    } else {
        //username sorgulama işlemi
        User.findOne({
                username: getUsername
            })
            .then(result => {
                if (result != null) {
                    errors.push("Daha önce seçilmeyen bir kullanıcı adı seçiniz");
                    return res.render("pages/register", {
                        errormessage: errors,
                        username: getUsername,
                        email: email,
                        password: password,
                        activeRegister: true
                    });
                }
                if (result == null) {
                    //email sorgulama işlemi
                    User.findOne({
                        email: email
                    }, (err, user) => {
                        if (user) {
                            req.flash("flashError", "Bu email adresi başka bir hesaba kayıtlı.");
                            return res.redirect("/register");
                        } else if (err) {
                            console.log(err);
                            req.flash("flashError", "Hata oluştu");
                            return res.redirect("/register");
                        } else {
                            //şifreleme işlemi
                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(password, salt, function (err, hash) {
                                    if (err) {
                                        console.log("şifreleme hatası");
                                        errors.push("şifreleme hatası");
                                        return res.render("pages/register", {
                                            errormessage: errors,
                                            activeRegister: true
                                        });
                                    } else {
                                        //ekleme işlemi
                                        const add = new User({
                                            username: getUsername,
                                            email: email,
                                            password: hash,
                                            user_image: "notimage"
                                        });
                                        add.save()
                                            .then(result => {
                                                console.log("Üye Eklendi")
                                                req.flash("flashSuccess", "Kayıt oldunuz, giriş yapın");
                                                return res.redirect("/login/username");
                                            })
                                            .catch(err => {
                                                console.log("Üye eklenirken hata oluştu")
                                                errors.push("Üye eklenirken hata oluştu");
                                                return res.render("pages/register", {
                                                    errormessage: errors,
                                                    activeRegister: true
                                                });
                                            });

                                    }
                                });
                            });

                        }
                    })

                }
            });


    }
}