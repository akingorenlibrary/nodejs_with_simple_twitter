const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require('jsonwebtoken');


module.exports.getLoginUsername = (req, res) => {
  
   //console.log("getlogin jwt:",req.cookies["jwttoken"]);
    res.render("pages/loginusername", {
        activeLogin: true,
        title:"Login"
    });

   
}


module.exports.postLoginUsername=(req,res)=>{
    const getUsername=req.body.username.toLowerCase();
    if(getUsername!="")
    {
        User.findOne({username:getUsername},(err,user)=>{
            if(user)
            {
                req.session.oturum=getUsername;
                req.session.save(err=>{
                    if(err)
                    {
                        req.flash("flashError","Böyle bir kullanıcı yok");
                        return res.redirect("/login/username");
                    }
                })
               return  res.redirect("/login/password");
                
            }
            else if(!user)
            {
                req.flash("flashError","Böyle bir kullanıcı yok");
                return res.redirect("/login/username");
            }
            if(err)
            {
                req.flash("flashError","Hata oluştu");
                return res.redirect("/login/username");
            }
        })
    }
    else
    {
        req.flash("flashError","Boş Bırakmayın");
        return  res.redirect("/login/username");
    }
}

module.exports.getLoginPassword=(req,res)=>{
    if(req.session.oturum)
    {
        return res.render("pages/loginpassword",{title:"Login",activeLogin: true});
    }
    else
    {
       return res.redirect("/login/username");
    }
}



module.exports.postLoginPassword=(req,res)=>{
    
    if(req.session.oturum)//username doğru ise oturum diye bir session oluşturulur ve /login/password sayfasına erişmesine izin verir
    {
        const {password}=req.body;
        const username=req.session["oturum"];
            if(password!="")
            {
                User.findOne({
                    username: username
                }, (err, user) => {
                    if (err) {
                        console.log("Hata");
                        req.flash("flashError", "Hata");
                        return res.redirect("/login/username");
                    }
                    if (!user) {
                        console.log("Böyle bir kullanıcı yok");
                        req.flash("flashError", "Böyle bir kullanıcı yok");
                        return res.redirect("/login/username");
                    }
                    if (user) {
                        bcrypt.compare(password, user.password, function (err, result) {
                            if (err) {
                                console.log("Hata");
                                req.flash("flashError", "Hata");
                                return res.redirect("/login/username");
                            }
                            if (result) {

                                delete req.session["oturum"];//loginin ilk sayfasında kullanıcı adını bununla sakladım şimdi işim bitti
                                req.session.username = username;
                                req.session.save(err=>{
                                    if(err)
                                        {
                                            console.log("jwt hatası: ",err);
                                            return res.redirect("/logout");
                                        }
                                    });
                                const token=jwt.sign({ foo: 'bar' }, 'secretosho');
                                if(req.body.benihatirla)
                                {
                                    //console.log("req.body.benihatirla(var):",req.body.benihatirla)
                                    res.cookie("jwt",token,{
                                        maxAge: 604800000, // 1 week
                                        httpOnly: true
                                        });
                
                                    req.flash("flashSuccess", "Şİfre Doğru");
                                    return res.redirect("/");
                                }
                                else
                                {
                                   // console.log("req.body.benihatirla:(yok) ",req.body.benihatirla)
                                    res.cookie("jwt",token,{
                                        maxAge: 86400000, // 1 day
                                        httpOnly: true
                                        });
                                    //console.log("req.session.cookie: ",req.session.cookie);
                                    req.session.cookie.maxAge =86400000; // 1 day
                                    req.flash("flashSuccess", "Şİfre Doğru");
                                    return res.redirect("/");
                                }
                                   
                                    
                                   
                              
                            } else {
                                console.log("şifre yanlış");
                                req.flash("flashError","Şİfre Yanlış");
                                return  res.redirect("/login/password");
                            }
                        })
            
            
                    }
            
                })
            }
            else
            {
                req.flash("flashError","Boş Bırakmayın");
                return  res.redirect("/login/password");
            }
          
    }
    else
    {
       return res.redirect("/login/username");
    }
}

/*
module.exports.home = (req, res) => {
    let kullanicilar = [];
    User.find()
        .then(result => {
            result.forEach(element => {
                kullanicilar.push(element.username)
            });
            res.render("pages/home", {
                result: kullanicilar,
                activeHome: true,
                user: req.session["username"],
                title:"Home"
            });
        })
        .catch(err => console.log(err));
}

*/






