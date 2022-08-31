const express=require("express");
const passport=require("passport");
const app=express();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const LocalStrategy=require("passport-local").Strategy;
const session=require("express-session");
const cookieParser=require("cookie-parser");
app.use(cookieParser("osho"));
app.use(session({ 
    cookie: { maxAge: 60000 },
    resave:true,
    secret:"osho",
    saveUninitialized:true
}));
   
passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ username: username }, function (err, user) {
            if (err)//bir hata oluşursa
            { return done(err,null,"Bir hata oluştu")}//(ilk parametre error,ikinci parametre user,3. parametre herhangi bir hata olduğunda gönderilecek mesaj)
            if (!user)//böylr bir user yok ise
             { return done(null,false,"Böyle bir kullanıcı yok"); }
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err)//bir hataoluştur
                {
                    return done(err,false,"Bir hata oluştu");
                }
                if(result)//böyle bir kullanıcı var ve şifre doğru
                {
                    return done(null,user,"Giriş Başarılı");
                }
                else//böyle bir kullanıcı var ve şifre yanlış
                {
                    return done(null,false,"Şifre Yanlış");
                }
            })
          }); 
        }
      ));

    //varsayılan dosyalar
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
          done(err, user);
        });
      });


/*
module.exports.postlogin = (req, res) => {
    const {
        username,
        password
    } = req.body;
    User.findOne({
        username: username
    }, (err, user) => {
        if (err) {
            console.log("Hata");
            req.flash("flashError","Hata");
            res.redirect("/login");
        }
        if (!user) {
            console.log("Böyle bir kullanıcı yok");
            req.flash("flashError","Böyle bir kullanıcı yok");
            res.redirect("/login");
        }
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if(err)
                {
                    console.log("Hata");
                    req.flash("flashError","Hata");
                    res.redirect("/login");
                }
                if (result) {
                    console.log("şifre doğru");
                    req.flash("flashSuccess","Şİfre Doğru");
                    //token oluşturma
                    const dbusername=user.username;
                    const token = jwt.sign({dbusername},jwtKey,{
                    algorithm:"HS256",
                    expiresIn:jwtExpirySeconds
                   });
                   console.log("token: ",JSON.stringify(token));
                   res.cookie("tokentut",token);
                    //
                    res.redirect("/");
     
                } else {
                    console.log("şifre yanlış");
                    req.flash("flashError","Şİfre Yanlış");
                    res.redirect("/login");
                }
            })


        }
    })
    */