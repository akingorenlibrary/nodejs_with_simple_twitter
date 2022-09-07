const formValidationFile = require("../validation/formValidation");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

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
        title: "Register",
        passwordOpenClose:true
    });
}



module.exports.postRegister = (req, res) => {
    const recaptchaResponse=req.body["g-recaptcha-response"];
    const errors = [];
    const {
        username,
        email,
        password
    } = req.body;
    const kontrol = formValidationFile.formValidation(username, email, password, recaptchaResponse);
    if (kontrol.length > 0) {
        return res.render("pages/register", {
            errormessage: kontrol,
            username: username,
            email: email,
            password: password,
            activeRegister: true,
            title:"Register",
            passwordOpenClose:true
        });
    } else {
        //username sorgulama işlemi
        User.findOne({
                username: username
            })
            .then(result => {
                if (result != null) {
                    errors.push("Daha önce seçilmeyen bir kullanıcı adı seçiniz");
                    return res.render("pages/register", {
                        errormessage: errors,
                        username: username,
                        email: email,
                        password: password,
                        activeRegister: true,
                        title:"Register",
                        passwordOpenClose:true
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
                                            activeRegister: true,
                                            passwordOpenClose:true,
                                            title:"Register"
                                        });
                                    } else {
                                        //ekleme işlemi
                                        const add = new User({
                                            username: username,
                                            email: email,
                                            password: hash,
                                            user_image: "notimage"
                                        });
                                        add.save()
                                            .then(result => {
                                                console.log("Üye Eklendi")
                                                //req.flash("flashSuccess", "Kayıt oldunuz, giriş yapın");
                                                //return res.redirect("/login/username");
                                                //kayıt başarılı
                                                {
                                                req.session.username = username;
                                                req.session.save(err => {
                                                    if (err) {
                                                        console.log("session hatası: ", err);
                                                        return res.redirect("/logout");
                                                    }
                                                });
                                                const token = jwt.sign({
                                                    foo: 'bar'
                                                }, 'secretosho');
                                               
                                                // console.log("req.body.benihatirla:(yok) ",req.body.benihatirla)
                                                res.cookie("jwt", token, {
                                                    maxAge: 86400000, // 1 day
                                                    httpOnly: true
                                                });
                                                //console.log("req.session.cookie: ",req.session.cookie);
                                                req.session.cookie.maxAge = 86400000; // 1 day
                                                //req.flash("flashSuccess", "Şİfre Doğru");
                                                return res.redirect("/");
                                                
                                                }
                                            })
                                            .catch(err => {
                                                console.log("Üye eklenirken hata oluştu")
                                                errors.push("Üye eklenirken hata oluştu");
                                                return res.render("pages/register", {
                                                    errormessage: errors,
                                                    activeRegister: true,
                                                    passwordOpenClose:true,
                                                    title:"Register"
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