const Write = require("../models/writes");
const controlProfilePasswordChangeFile = require("../validation/profile-password-change");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const Direct=require("../models/direct");
const { formValidation,emailChangeFromValidation } = require("../validation/formValidation");


module.exports.profile = (req, res) => {
    User.findOne({username:req.params.username},(err,user)=>{
        if(user)
        {
            if(user.username==req.session["username"])
            {
                //kendisi
                return ownProfile(req,res);
            }
            else
            {
                //başka bir kullanıca bakıyor
                return otherProfile(req,res);
            }
        }
        else if(err)
        {
            //hata
            return res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
        }
        else
        {
            //böyle bir kullanıcı yok
            return  res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
        }
    })

}


function ownProfile(req,res){
    const sakla = [];
    var zaman = new Date();
    var tut;
    var user_image;

    User.findOne({
        username: req.session["username"]
    }, (err, user) => {
        if (user) {
            if (user.user_image != "notimage") {
                user_image = user.user_image;
            }
        }
    })



    Write.find({
            username: req.session["username"]
        }).limit(10).sort({
            date: -1
        })
        .then(result => {
            result.forEach((element) => {
                sakla.push({
                    username: element.username,
                    metin: element.getwrite,
                    date: element.date,
                    postid: element._id
                });
            })
            sakla.forEach(element => {
                zaman = element.date;
                tut = {
                    tarih: zaman.getDate(),
                    ay: zaman.getMonth() + 1,
                    yil: zaman.getFullYear(),
                    saat: zaman.getHours(),
                    dakika: zaman.getMinutes()
                }
                if (tut.dakika.toString().length == 1) {
                    tut.dakika = `0${tut.dakika}`;
                }
                if (tut.saat.toString().length == 1) {
                    tut.saat = `0${tut.saat}`;
                }
                if (tut.ay.toString().length == 1) {
                    tut.ay = `0${tut.ay}`;
                }
                if (tut.tarih.toString().length == 1) {
                    tut.tarih = `0${tut.tarih}`;
                }

                element.date = tut.tarih + "/" + tut.ay + "/" + tut.yil + " | " + tut.saat + ":" + tut.dakika;
                //console.log(zaman.getUTCDate(),"/",zaman.getMonth()+1,"/",zaman.getFullYear()," ",zaman.getHours(),":",zaman.getMinutes());
            });

            Write.find({
                    username: req.session["username"]
                })
                .then(result => {

                    if (result.length > 10) {

                        return res.render("pages/profile", {
                            user: req.session["username"],
                            activeProfile: true,
                            title: "Profile",
                            writes: sakla,
                            goruldu: sakla.length,
                            allpost: result.length,
                            user_image: user_image,
                            profilePage:true
                        });
                    } else {
                        return res.render("pages/profile", {
                            user: req.session["username"],
                            activeProfile: true,
                            title: "Profile",
                            writes: sakla,
                            user_image: user_image,
                            profilePage:true
                        });
                    }
                })
                .catch(err => {
                    req.flash("flashError", "Hata oluştu");
                    res.redirect(`/${req.session["username"]}`);
                });
        })
        .catch(err => {
            req.flash("flashError", "Hata oluştu");
            res.redirect(`/${req.session["username"]}`);
        });

}

module.exports.getprofilechangepassword = (req, res) => {

    res.render("pages/passwordchange", {
        user: req.session["username"],
        title: "Password Change",
        activeProfile: true,
        passwordOpenClose:true
    })

}


function otherProfile(req,res){
    let temp = [];
    let zaman2 = new Date();
    let temp2;
    let otherUser_image;
    const otherUsername=req.params.username;

    User.findOne({
        username: otherUsername
    }, (err, user) => {
        if (user) {
            if (user.user_image != "notimage") {
                otherUser_image = user.user_image;
            }
        }
        if(err)
        {
            console.log(err);
            return  res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
        }
    })

    Write.find({
            username: otherUsername
        }).limit(10).sort({
            date: -1
        })
        .then(result => {
            result.forEach((element) => {
                temp.push({
                    otherUsername: element.username,
                    otherMetin: element.getwrite,
                    otherDate: element.date,
                    otherPostid: element._id
                });
            })

            temp.forEach(element => {
                zaman2 = element.otherDate;
                temp2 = {
                    tarih: zaman2.getDate(),
                    ay: zaman2.getMonth() + 1,
                    yil: zaman2.getFullYear(),
                    saat: zaman2.getHours(),
                    dakika: zaman2.getMinutes()
                }
                if (temp2.dakika.toString().length == 1) {
                    temp2.dakika = `0${temp2.dakika}`;
                }
                if (temp2.saat.toString().length == 1) {
                    temp2.saat = `0${temp2.saat}`;
                }
                if (temp2.ay.toString().length == 1) {
                    temp2.ay = `0${temp2.ay}`;
                }
                if (temp2.tarih.toString().length == 1) {
                    temp2.tarih = `0${temp2.tarih}`;
                }

                element.otherDate = temp2.tarih + "/" + temp2.ay + "/" + temp2.yil + " | " + temp2.saat + ":" + temp2.dakika;
            });

            Write.find({
                    username: otherUsername
                })
                .then(result => {

                    if (result.length > 10) {

                        return res.render("pages/otherProfile", {
                            user: req.session["username"],
                            activeProfile: true,
                            title: "Profile",
                            otherWrites: temp,
                            goruldu: temp.length,
                            allpost: result.length,
                            otherUser_image: otherUser_image,
                            otherUsername:otherUsername,
                            otherProfilePage:true
                        });
                    } else {
                        return res.render("pages/otherProfile", {
                            user: req.session["username"],
                            activeProfile: true,
                            title: "Profile",
                            otherWrites: temp,
                            otherUser_image: otherUser_image,
                            otherUsername:otherUsername,
                            otherProfilePage:true
                        });
                    }
                })
                .catch(err => {
                    console.log("err1",err);
                    return  res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
                });
        })
        .catch(err => {
            console.log("err2",err);
            return  res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
        });
    
}


module.exports.postprofilechangepassword = (req, res) => {
    const {
        mevcutSifre,
        yeniSifre1,
        yeniSifre2
    } = req.body;
    const kontrol = controlProfilePasswordChangeFile.controlProfilePasswordChange(mevcutSifre, yeniSifre1, yeniSifre2);
    console.log("kontrol: ",kontrol);
    if (kontrol.length > 0) {
        //hata var
        return res.render("pages/passwordchange", {
            errormessage: kontrol,
            user: req.session["username"],
            title: "Password Change",
            activeProfile: true,
            passwordOpenClose:true
        });
    } else {
        User.findOne({
            username: req.session["username"]
        }, (err, user) => {
            if (user) {
                
            bcrypt.compare(mevcutSifre, user.password, (err, result) => {
                if (err) {
                    req.flash("flashError", "Hata oluştu");
                    return res.redirect(`/${req.session["username"]}/password-change`);
                }
                else if (result) {
                    req.flash("flashSuccess", "Şifre değiştirildi");
                    return res.redirect(`/${req.session["username"]}/password-change`);
                } 
                else {
                    req.flash("flashError", "Mevcut şifrenizi yanlış girdiniz");
                    return res.redirect(`/${req.session["username"]}/password-change`);
                }
            })
                    
            }
            if (!user) {
                req.flash("flashError", "Hata oluştu");
                return res.redirect(`/${req.session["username"]}/password-change`);
            }
            if (err) {
                req.flash("flashError", "Hata oluştu");
                return res.redirect(`/${req.session["username"]}/password-change`);
            }

        })
    }
}


module.exports.getmembershipDelete = (req, res) => {

    res.render("pages/membershipDelete", {
        user: req.session["username"],
        activeProfile: true,
        title: "Memmbership Delete"
    });

}

module.exports.postmembershipDelete = (req, res) => {

    User.deleteOne({
            username: req.session["username"]
        })
        .then(result => {
            Write.deleteMany({
                    username: req.session["username"]
                })
                .then(response => {
                    async function bekle() {
                        req.flash("flashSuccess", "Üyeliniz Silindi");
                        await delete req.session["username"];
                    }
                    bekle();
                    return res.redirect("/login/username");
                })
                .catch(err => {
                    req.flash("flashSuccess", "Üyeliniz Silinirken Hata Oluştu");
                    res.redirect(`/${req.session["username"]}`);
                });
        })
        .catch(err => {
            req.flash("flashSuccess", "Üyeliniz Silinirken Hata Oluştu");
            res.redirect(`/${req.session["username"]}`);
        });



}


module.exports.getpostDelete = (req, res) => {

    let sakla = [];
    Write.find({
        _id: req.params.postid
    }, (err, writetable) => {
        writetable.forEach((element) => {
            sakla.push({
                id: element._id,
                username: element.username,
                write: element.getwrite
            });
        })
        res.render("pages/postDelete", {
            user: req.session["username"],
            activeProfile: true,
            title: "Post Delete",
            post: sakla
        });
    })


}

module.exports.postpostDelete = (req, res) => {

    Write.deleteOne({
            _id: req.params.postid
        })
        .then(result => {
            req.flash("flashSuccess", "Post Silindi");
            res.redirect(`/${req.session["username"]}`);
        })
        .catch(err => {
            req.flash("flashSuccess", "Post Silinirken Hata Oluştu");
            res.redirect(`/${req.session["username"]}`);
        });


}


module.exports.getpostupdate = (req, res) => {

    let sakla = [];
    Write.find({
        _id: req.params.postid
    }, (err, writetable) => {
        writetable.forEach((element) => {
            sakla.push({
                id: element._id,
                username: element.username,
                write: element.getwrite
            });
        })
        res.render("pages/postUpdate", {
            user: req.session["username"],
            activeProfile: true,
            title: "Post Update",
            post: sakla,
            postUpdatePage:true
        });
    })

}

module.exports.postpostupdate = (req, res) => {

    Write.updateOne({
            _id: req.params.postid
        }, {
            $set: {
                getwrite: req.body.metin
            }
        })
        .then(result => {
            req.flash("flashSuccess", "Post Güncellendi");
            res.redirect(`/${req.session["username"]}`);
        })
        .catch(err => {
            req.flash("flashSuccess", "Post Güncellenirken Hata Oluştu");
            res.redirect(`/${req.session["username"]}`);
        });

}



module.exports.ayarlar = (req, res) => {
    res.render("pages/ayarlar", {
        user: req.session["username"],
        activeProfile: true,
        title: "Ayarlar",
    });
}

module.exports.getimageUpload = (req, res) => {
    var user_image;


    fs.readdir(path.join(__dirname, `../public/user-images/`), function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        if (files.indexOf(req.session["username"]) == -1) {
            fs.mkdir(path.join(__dirname, `../public/user-images/${req.session["username"]}`), (err2) => {
                if (err2) {
                    console.log("hata: ", err2)
                }
            });
        }
    });


    User.findOne({
        username: req.session["username"]
    }, (err, user) => {
        if (user) {
            if (user.user_image != "notimage") {
                user_image = user.user_image;

            }
            return res.render("pages/imageUpload", {
                user: req.session["username"],
                activeProfile: true,
                title: "Ayarlar",
                user_image: user_image,
                imageUploadPage:true
            })
        }
    })


}

module.exports.postimageUpload = (req, res) => {

    if (req.file != undefined) {

        if (req.file.mimetype == "image/png" || req.file.mimetype == "image/jpeg") {
            if (req.file.size < 10000000) //10000000 byte=10 mb
            {   
                User.findOne({username:req.session["username"]},(err,user)=>{
                    if(user)
                    {
                        if(user.user_image != "notimage")
                        {
                            fs.unlink(path.join(__dirname, `../public/user-images/${req.session["username"]}/${user.user_image}`),(err)=>{
                                if(err)
                                {
                                req.flash("flashError", "Bir hata oluştu");
                                return res.redirect(`/${req.session["username"]}/image-upload`);
                                }
                            })
                        }
                    }
                })

                User.updateOne({
                    username: req.session["username"]
                }, {
                    $set: {
                        user_image: req.file.filename
                    }
                })
                .then(onay => {
                    req.flash("flashSuccess", "Resim yüklendi");
                    return res.redirect(`/${req.session["username"]}/image-upload`);
                })
                .catch(err => {
                    req.flash("flashError", "Hata oluştu");
                    return res.redirect(`/${req.session["username"]}/image-upload`);
                })


                
            } else {
                req.flash("flashError", "JPG veya PNG formatında değil");
                res.redirect(`/${req.session["username"]}/image-upload`);
            }
        }

    } else {
        req.flash("flashError", "Bir resim yükleyin");
        res.redirect(`/${req.session["username"]}/image-upload`);
    }
}

module.exports.imageRemove = (req, res) => {
   
    User.findOne({
        username: req.session["username"]
    }, (err, user) => {
        if (user) {
            if (user.user_image != "notimage") {
                fs.unlink(path.join(__dirname, `../public/user-images/${req.session["username"]}/${user.user_image}`),(err)=>{
                    if(err)
                    {
                        req.flash("flashError", "Bir hata oluştu");
                        return res.redirect(`/${req.session["username"]}/image-upload`);
                    }
                    else
                    {
                        User.updateOne({
                            username: req.session["username"]
                        }, {
                            $set: {
                                user_image: "notimage"
                            }
                        })
                        .then(result => {
                            req.flash("flashSuccess", "Fotoğraf kaldırıldı.");
                            return res.redirect(`/${req.session["username"]}/image-upload`);
                        })
                        .catch(err => {
                            req.flash("flashError", "Hata oluştu");
                            return res.redirect(`/${req.session["username"]}`);
                        });
                    }
                })
            

            } else {
                req.flash("flashError", "Kaldırılacak bir fotoğraf yok");
               return  res.redirect(`/${req.session["username"]}/image-upload`);
            }
        }
    })


}



module.exports.getemailchange=(req,res)=>{
    return res.render("pages/emailChange",{title:"Email Change",user:req.session["username"],activeProfile:true,passwordOpenClose:true});
}

module.exports.postemailchange=(req,res)=>{
    const {yeniEmail,mevcutSifre}=req.body;
    const kontrol=emailChangeFromValidation(yeniEmail,mevcutSifre);
    if(kontrol.length>0)
    {
        req.flash("flashError",kontrol);
        return res.redirect(`/${req.session["username"]}/email-change`);
    }
    else
    {
       User.findOne({email:yeniEmail},(err,user)=>{
        if(user)
        {
            req.flash("flashError","Bu email başka bir hesaba kayıtlı.");
            return res.redirect(`/${req.session["username"]}/email-change`);
        }
        else if(err)
        {
            req.flash("flashError","Hata oluştu.");
            return res.redirect(`/${req.session["username"]}/email-change`);
        }
        else
        {
            User.findOne({username:req.session["username"]},(err,user)=>{
                if(user)
                {
                    bcrypt.compare(mevcutSifre,user.password,(err,result)=>{
                        if(result)
                        {
                            user.email=yeniEmail;
                            user.save()
                            .then(response=>{
                                req.flash("flashSuccess","Email değiştirildi");
                                return res.redirect(`/${req.session["username"]}`);
                            })
                            .catch(err=>{
                                console.log(err)
                                req.flash("flashError","Hata oluştu");
                                return res.redirect(`/${req.session["username"]}/email-change`);
                            });
                        }
                        else if(err)
                        {
                            console.log(err)
                            req.flash("flashError","Hata oluştu");
                            return res.redirect(`/${req.session["username"]}/email-change`);
                        }
                        else
                        {
                            req.flash("flashError","Mevcut şifreyi yanlış girdiniz");
                            return res.redirect(`/${req.session["username"]}/email-change`);
                        }
                    })
                }
                else if(err)
                {
                    console.log(err)
                    req.flash("flashError","Hata oluştu");
                    return res.redirect(`/${req.session["username"]}/email-change`);
                }
                else
                {
                    req.flash("flashError","Hata oluştu");
                    return res.redirect(`/${req.session["username"]}/email-change`);
                }
            })
        }
       })
    }
}
