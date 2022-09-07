const User = require("../models/user");
const sgMail = require('@sendgrid/mail')
const randomBytes = require('randombytes');
const formValidationFile=require("../validation/formValidation");
const bcrypt = require("bcryptjs");

sgMail.setApiKey("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");

module.exports.resetpassword=(req,res)=>{
    return res.render("pages/resetpassword",{ title:"Reset Password"});
}

module.exports.resetpasswordemail=(req,res)=>{ 
    
const recaptchaResponse=req.body["g-recaptcha-response"];
const {email}=req.body;

const kontrol=formValidationFile.resetPasswordEmailValidation(email,recaptchaResponse);

if(!(kontrol.length>0))
{
    User.findOne({email:email})
    .then(user=>{
       if(!user)
       {
           req.flash("flashSuccess","Böyle bir emaile sahip kullanıcı var ise email gitmiştir");
           return res.redirect("/login/username");
       }
       if(user)
       {
        
           let random;
           randomBytes(16, function (err, resp) {
               random=resp.toString("hex");
               console.log(email,random,user.username);
               console.log(`${req.protocol}://${req.get("host")}/reset-password/${random}`);
               user.reset_token=random;
               user.reset_token_expiration=Date.now()+3600000; //3 600 000 ms => 1 hours
               user.save()
               .then(response=>{
                   const msg = {
                       to: email, // Change to your recipient
                       from: 'muhammetgoreniletisim@gmail.com', // Change to your verified sender
                       subject: 'Reset Password',
                       html: `
                       <h2>Parola sıfırlama linki</h2>
                       
                       Parola sıfırlamak için <a href="${req.protocol}://${req.get("host")}/reset-password/${random}">tıklanıyınız</a>
                        `
                     }
                    sgMail.send(msg)
                    .then(result=>{
                        req.flash("flashSuccess","Böyle bir emaile sahip kullanıcı var ise email gitmiştir");
                        return res.redirect("/login/username");
                        
                    })
                    .catch(err=>{
                        console.log(err);
                        req.flash("flashError","Hata oluştu");
                        return res.redirect("/reset-password");
                    });
               })
               .catch(err=>{
                    console.log(err);
                    req.flash("flashError","Hata oluştu");
                    return res.redirect("/reset-password");
               });
              });
       }
    })
    .catch(err=>{
        console.log(err); 
        req.flash("flashError","Hata oluştu");
        return res.redirect("/reset-password");
    });  
}
else
{
    req.flash("flashError",kontrol);
    return res.redirect("/reset-password");
}
}

module.exports.getResetPasswordToken=(req,res)=>{
    //reset_token_expiration:{$gt:Date.now()} şimdiki zamanda büyük olanı getir
    const {resettoken}=req.params; 
    User.findOne({reset_token:resettoken, reset_token_expiration:{$gt:Date.now()}},(err,user)=>{
        if(user)
        {
            return res.render("pages/newPassword",{title:"New Password",token:resettoken,passwordOpenClose:true});
        }
        else if(err)
        {
            console.log(err)
            req.flash("flashError","Hata oluştu");
            return res.redirect("/reset-password");
        }
        else
        {
            return res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
        }
    })
    
}


module.exports.postResetPasswordToken=(req,res)=>{
    const {resettoken}=req.params;
    const {yeniSifre1,yeniSifre2,username}=req.body;
    const kontrol=formValidationFile.resetPasswordFormValidation(yeniSifre1,yeniSifre2);
    if(!(kontrol.length>0))
    {
        User.findOne({reset_token:resettoken, reset_token_expiration:{$gt:Date.now()}},(err,user)=>{
            if(user)
            {
                bcrypt.compare(yeniSifre1,user.password,(err,result)=>{
                    if(result)
                    {
                        req.flash("flashError","Mevcut şifrenizden farklı bir şifre oluşturun.");
                        return res.redirect(`/reset-password/${resettoken}`);
                    }
                    else if(err)
                    {
                        console.log(err)
                        req.flash("flashError","Hata oluştu");
                        return res.redirect(`/reset-password/${resettoken}`);
                    }
                    else
                    {
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(yeniSifre1, salt, function(err, hash) {
                                if(err)
                                {
                                    req.flash("flashError","Şifreleme hatası");
                                    return res.redirect("/reset-password");
                                }
                                else
                                {
                                    User.updateOne({reset_token:resettoken},{$set:{password:hash,reset_token_expiration:Date.now()}})
                                    .then(response=>{
        
                                        req.flash("flashSuccess","Şifre Değiştirildi");
                                        return res.redirect("/login/username");
                                    })
                                    .catch(err=>{
                                        req.flash("flashError","Hata oluştu");
                                        return res.redirect("/reset-password");
                                    });
                                    
                                }
                            });
                        });
                    }
                })
            }
            else if(err)
            {
                req.flash("flashError","Hata oluştu");
                return res.redirect("/reset-password");
            }
            else if(!user)
            {
                return res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
            }
        })
    }
    else
    {
        req.flash("flashError",kontrol);
        return res.redirect(`/reset-password/${resettoken}`);
    }
}


module.exports.userResetPassword=(req,res)=>{
const recaptchaResponse=req.body["g-recaptcha-response"];
const kontrol=formValidationFile.userResetPasswordEmailValidation(recaptchaResponse);
if(!(kontrol.length>0))
{
    User.findOne({username:req.session["username"]},(err,user)=>{
        if(user)
        {
            let email=user.email;
            let random;
            randomBytes(16, function (err, resp) {
                random=resp.toString("hex");
                user.reset_token=random;
                user.reset_token_expiration=Date.now()+3600000; //3 600 000 ms => 1 hours
                user.save()
                .then(response=>{
                    const msg = {
                        to: email, // Change to your recipient
                        from: 'muhammetgoreniletisim@gmail.com', // Change to your verified sender
                        subject: 'Reset Password',
                        html: `
                        <h2>Parola sıfırlama linki</h2>
                        
                        Parola sıfırlamak için <a href="${req.protocol}://${req.get("host")}/reset-password/${random}">tıklanıyınız</a>
                         `
                      }
                     sgMail.send(msg)
                     .then(result=>{
                         req.flash("flashSuccess","Şifre sıfırlama linki mail adresinize gönderildi.");
                         return res.redirect(`/${req.session["username"]}`);
                         
                     })
                     .catch(err=>{
                         console.log(err);
                         req.flash("flashError","Hata oluştu");
                         return res.redirect(`/${req.session["username"]}/password-change`);
                     });
                })
                .catch(err=>{
                     console.log(err);
                     req.flash("flashError","Hata oluştu");
                     return res.redirect(`/${req.session["username"]}/password-change`);
                });
               });
        }
        else
        {
            req.flash("flashError","Hata oluştu");
            return res.redirect(`/${req.session["username"]}/password-change`);
        }
    })
}
else
{
    req.flash("flashError",kontrol);
    return res.redirect(`/${req.session["username"]}/password-change`);
}
}


module.exports.getuserResetPassword=(req,res)=>{
    //reset_token_expiration:{$gt:Date.now()} şimdiki zamanda büyük olanı getir
    const {resettoken}=req.params; 
    console.log("ok");
    User.findOne({reset_token:resettoken, reset_token_expiration:{$gt:Date.now()}},(err,user)=>{
        if(user)
        {
            return res.render("pages/newUserPassword",{user:req.session["username"],title:"New User Password",token:resettoken,passwordOpenClose:true});
        }
        else if(err)
        {
            console.log(err)
            req.flash("flashError","Hata oluştu");
            return res.redirect("/reset-password");
        }
        else
        {
            
            return res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
        }
    })
}


module.exports.postuserResetPassword=(req,res)=>{
    const {resettoken}=req.params;
    const {yeniSifre1,yeniSifre2,username}=req.body;
    const kontrol=formValidationFile.resetPasswordFormValidation(yeniSifre1,yeniSifre2);
    if(!(kontrol.length>0))
    {
        User.findOne({reset_token:resettoken, reset_token_expiration:{$gt:Date.now()}},(err,user)=>{
            if(user)
            {
                bcrypt.compare(yeniSifre1,user.password,(err,result)=>{
                    if(result)
                    {
                        req.flash("flashError","Mevcut şifrenizden farklı bir şifre oluşturun.");
                        return res.redirect(`/${req.session["username"]}/reset-password/${resettoken}`);
                    }
                    else if(err)
                    {
                        console.log(err)
                        req.flash("flashError","Hata oluştu");
                        return res.redirect(`/${req.session["username"]}/reset-password/${resettoken}`);
                    }
                    else
                    {
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(yeniSifre1, salt, function(err, hash) {
                                if(err)
                                {
                                    req.flash("flashError","Şifreleme hatası");
                                    return res.redirect(`/${req.session["username"]}/reset-password`);
                                }
                                else
                                {
                                    User.updateOne({reset_token:resettoken},{$set:{password:hash,reset_token_expiration:Date.now()}})
                                    .then(response=>{
        
                                        req.flash("flashSuccess","Şifre Değiştirildi");
                                        return res.redirect(`/${req.session["username"]}`);
                                    })
                                    .catch(err=>{
                                        req.flash("flashError","Hata oluştu");
                                        return res.redirect(`/${req.session["username"]}`);
                                    });
                                    
                                }
                            });
                        });
                    }
                })
            }
            else if(err)
            {
                req.flash("flashError","Hata oluştu");
                return res.redirect(`/${req.session["username"]}`);
            }
            else if(!user)
            {
                return res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
            }
        })
    }
    else
    {
        req.flash("flashError",kontrol);
        return res.redirect(`/${req.session["username"]}/reset-password/${resettoken}`);
    }
}