const Direct = require("../models/direct");
const User = require("../models/user");
//const randomBytes = require('randombytes');

module.exports.getDirect = (req, res) => {

    let temp = []; //önce tüm mesajlardaki alıcıları bu diziye ekliyorum 
    let temp2 = []; //sonra her alıyıcıdan bir tane olsun örneğin 2 tane secret, secret olmasın diye bu dize ekliyorum ayıklayıp
    let temp3 = []; //ayıklanan kullanıcıların sadece kullanıcı adlarını değil daha detayları bilgilerini almak için ayarlar yapıp bu diiye ekliyoruz
    let receiver_image_photo;

    Direct.find({
            $or: [{
                sender: req.session["username"]
            }, {
                receiver: req.session["username"]
            }]
        })
        .then(result => {
            if (result.length > 0) {
                result.forEach(element => {

                    if (element.sender != req.session["username"] && (element.delete_confirm_user1 != req.session["username"] && element.delete_confirm_user2 != req.session["username"])) {
                        temp.push(element.sender);
                    } else if (element.receiver != req.session["username"] && (element.delete_confirm_user1 != req.session["username"] && element.delete_confirm_user2 != req.session["username"])) {
                        temp.push(element.receiver);
                    }

                });

                if (temp.length > 0) {
                    temp.forEach(element => {
                        if (temp2.indexOf(element) == -1) {
                            temp2.push(element);
                        }
                    });

                    let sayac = 0;

                    temp2.forEach(element2 => {
                        User.findOne({
                            username: element2
                        }, (err, user) => {
                            if (user) {
                                if (user.user_image != "notimage") {
                                    receiver_image_photo = user.user_image;
                                }

                                temp3.push({
                                    receiver: user.username,
                                    receiver_image_photo: receiver_image_photo
                                });
                                receiver_image_photo = undefined;
                                sayac++;
                                if (temp2.length == sayac) {

                                    res.render("pages/direct", {
                                        user: req.session["username"],
                                        activeMesaj: true,
                                        title: "Mesaj",
                                        sohbetSayisi: temp2.length,
                                        sohbetKisileri: temp3
                                    });
                                }
                            }
                        })
                    });
                } else {
                    res.render("pages/direct", {
                        user: req.session["username"],
                        activeMesaj: true,
                        title: "Mesaj",
                        sohbetSayisi: 0,
                        sohbetKisileri: undefined
                    });
                }

            } else {
                res.render("pages/direct", {
                    user: req.session["username"],
                    activeMesaj: true,
                    title: "Mesaj",
                    sohbetSayisi: 0,
                    sohbetKisileri: undefined
                });
            }
        })
        .catch(err => console.log(err));
}

module.exports.getyenimesaj = (req, res) => {
    res.render("pages/newDirect", {
        user: req.session["username"],
        activeMesaj: true,
        title: "Mesaj",
        newDirectPage: true
    });
}


module.exports.getWriteDirect = (req, res) => {
    if (req.params.otherusername != req.session["username"]) {
        User.findOne({
            username: req.params.otherusername
        }, (err, user) => {
            if (user) {
                let sakla = [];
                Direct.find({
                        $or: [{
                                $and: [{
                                        sender: req.session["username"]
                                    },
                                    {
                                        receiver: req.params.otherusername
                                    }
                                ]
                            },
                            {
                                $and: [{
                                        sender: req.params.otherusername
                                    },
                                    {
                                        receiver: req.session["username"]
                                    }
                                ]
                            }

                        ]
                    })
                    .then(result => {
                        result.forEach(element => {
                            if (req.session["username"] != element.sender && (req.session["username"] != element.delete_confirm_user1 && req.session["username"] != element.delete_confirm_user2)) {
                                sakla.push({
                                    sender: element.sender,
                                    message: element.message,
                                    kalin: true
                                });
                            } else if (req.session["username"] == element.sender && (req.session["username"] != element.delete_confirm_user1 && req.session["username"] != element.delete_confirm_user2)) {
                                sakla.push({
                                    sender: element.sender,
                                    message: element.message,
                                    kalin: false
                                });
                            }

                        });

                        return res.render("pages/writeDirect", {
                            user: req.session["username"],
                            activeMesaj: true,
                            writeDirectPage: true,
                            receiver: req.params.otherusername,
                            result: sakla,
                            title: "Mesaj"
                        });
                    })
                    .catch(err => console.log(err));
            } else if (err) {
                console.log(err)
                return  res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
            } else {
                return  res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
            }
        })
    } else {
        return  res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
    }
}

module.exports.getNewDirectSearch = (req, res) => {
    const {
        user
    } = req.body;
    const getUser=user.toLowerCase();
  
    let otherUser_image;

    if (getUser == req.session["username"]) {
        res.json({
            message: "Kendi kendinizi arayamazsınız"
        });
    } else if (getUser == "") {
        res.json({
            message: "Boş bırakmayın"
        });
    } else {
        User.findOne({
            username: getUser
        }, (err, dbuser) => {
            if (dbuser) {
                if (dbuser.user_image != "notimage") {
                    otherUser_image = dbuser.user_image;
                }
                res.json({
                    otherUsername: dbuser.username,
                    otherUser_image: otherUser_image
                });
            } else if (err) {
                res.json({
                    message: "Hata oluştu"
                });
            } else {
                res.json({
                    message: "kullanıcı bulunamadı"
                });
            }
        });
    }
}


module.exports.directControlOtherUsername = (req, res) => {
    const alici = req.params.otherusername;
    const gonderici = req.session["username"];
    console.log("alici: ", alici, " ", "gonderici :", gonderici)
    if (req.params.username != req.session["username"]) {
        Direct.findOne({
                $and: [{
                    $or: [{
                        sender: gonderici
                    }, {
                        receiver: gonderici
                    }]
                }, {
                    $or: [{
                        sender: alici
                    }, {
                        receiver: alici
                    }]
                }]
            })
            .then(response => {
                if (response != null) {
                    res.redirect(`/direct/t/${response.chat_id}`);
                } else {
                    let chat_id;
                    randomBytes(16, function (err, resp) {
                        chat_id = resp.toString("hex");
                        req.session.chat_id = chat_id;
                        req.session.alici = alici;
                        req.session.save(err => {
                            if (!err) {
                                return res.redirect(`/direct/t/${chat_id}`);
                            }
                        });

                    });


                }
            })
            .catch(err => console.log(err));
    }



}


module.exports.directDelete = (req, res) => {
    Direct.find({
            $and: [{
                $or: [{
                    sender: req.session["username"]
                }, {
                    receiver: req.session["username"]
                }]
            }, {
                $or: [{
                    sender: req.params.receiver
                }, {
                    receiver: req.params.receiver
                }]
            }]
        })
        .then(response => {
            response.forEach(element => {
                if (element.delete_confirm_user1 == "null" && element.delete_confirm_user1 != req.session["username"] && element.delete_confirm_user2 != req.session["username"]) {
                    Direct.updateOne({
                            _id: element._id
                        }, {
                            $set: {
                                delete_confirm_user1: `${req.session["username"]}`
                            }
                        })
                        .then(result => {
                            //console.log("işlem başarılı")
                        })
                        .catch(err => {
                            console.log(err)
                            req.flash("flashError", "Hata oluştu");
                            return res.redirect("/direct");
                        });
                } else if (element.delete_confirm_user2 == "null" && element.delete_confirm_user2 != req.session["username"] && element.delete_confirm_user1 != req.session["username"]) {
                    Direct.updateOne({
                            _id: element._id
                        }, {
                            $set: {
                                delete_confirm_user2: `${req.session["username"]}`
                            }
                        })
                        .then(result => {
                            //console.log("işlem başarılı")
                        })
                        .catch(err => {
                            console.log(err)
                            req.flash("flashError", "Hata oluştu");
                            return res.redirect("/direct");
                        });
                }
            });
            //iki taraftanda silinmesi için onaylanan konuşma varsa sil
            Direct.deleteMany({$and:[ {$or:[ {$and:[{sender:req.session["username"]},{receiver:req.params.receiver}]},{$and:[{sender:req.params.receiver},{receiver:req.session["username"]}]}]}, {$and:[ {delete_confirm_user1:{$ne:"null"}}, {delete_confirm_user2:{$ne:"null"}}]} ]})
            .then(responses=>{
                console.log("silme işlemi başarılı")
                req.flash("flashSuccess", "Sohbet silindi");
                return res.redirect("/direct");
            })
            .catch(err4=>{
                console.log(err4)
                req.flash("flashError", "Hata oluştu");
                return res.redirect("/direct");
            });
            //iki taraftanda silinmesi için onaylanan konuşma varsa sil
            

        })
        .catch(err => {
            console.log(err)
            req.flash("flashError", "Hata oluştu");
            return res.redirect("/direct");
        });

}