const Write=require("../models/writes");

module.exports.explorePostAddMore = (req, res) => {
    const veritut=[];
    var tumpostsayisi;
    var tutsonrakiresult;
    const {syc}=req.body;
    //console.log("syc: ",syc);
    Write.find().sort({date:-1})
    .then(result=>{
        tumpostsayisi=result.length;
       // console.log("tumpostsayisi: ",tumpostsayisi);
        var yeniresult=result.splice(syc,10);//onuncudan sonra on tane göster
        var sonrakiresult=result.splice(syc,10);
       // console.log("sonrakiresult: ",sonrakiresult.length);
        tutsonrakiresult=sonrakiresult.length;
        return yeniresult;
    })
    .then(result=>{
       // console.log("gelen: ",result.length)
            if(result!="")
            {
                {
                    result.forEach((element) => {
                        veritut.push({username:element.username,metin:element.getwrite,date:element.date});
                    })
                    veritut.forEach(element => {
                        //console.log(element.date);
                        zaman=element.date;
                        tut={
                            tarih:zaman.getDate(),
                            ay:zaman.getMonth()+1,
                            yil:zaman.getFullYear(),
                            saat:zaman.getHours(),
                            dakika:zaman.getMinutes()
                        }
                        if(tut.dakika.toString().length==1)
                        {
                            tut.dakika=`0${tut.dakika}`;
                        }
                        if(tut.saat.toString().length==1)
                        {
                            tut.saat=`0${tut.saat}`;
                        }
                        if(tut.ay.toString().length==1)
                        {
                            tut.ay=`0${tut.ay}`;
                        }
                        if(tut.tarih.toString().length==1)
                        {
                            tut.tarih=`0${tut.tarih}`;
                        }
                        element.date=tut.tarih+"/"+tut.ay+"/"+tut.yil+" | "+tut.saat+":"+tut.dakika;
                    });
                    //console.log("veritut: ",veritut);
                }
                return res.json({morePost:veritut,tumpostsayisi:tumpostsayisi,sonrakiresult:tutsonrakiresult});
            }
            else
            {
                //console.log("yeniresult(yok): ",result);
                return res.json({morePost:veritut});
            }
    })    


   
}


module.exports.profilePostAddMore=(req,res)=>{
    const veritut=[];
    var tumpostsayisi;
    var tutsonrakiresult;
    const {syc}=req.body;
    Write.find({username:req.session["username"]}).sort({date:-1})
    .then(result=>{
        tumpostsayisi=result.length;
        var yeniresult=result.splice(syc,10);//onuncudan sonra on tane göster
        var sonrakiresult=result.splice(syc,10);
        // console.log("sonrakiresult: ",sonrakiresult.length);
        tutsonrakiresult=sonrakiresult.length;
        return yeniresult;
    })
    .then(result=>{
        //console.log("gelen: ",result.length)
            if(result!="")
            {
                {
                    result.forEach((element) => {
                        veritut.push({username:element.username,metin:element.getwrite,date:element.date,postid:element._id});
                    })
                    veritut.forEach(element => {
                        //console.log(element.date);
                        zaman=element.date;
                        tut={
                            tarih:zaman.getDate(),
                            ay:zaman.getMonth()+1,
                            yil:zaman.getFullYear(),
                            saat:zaman.getHours(),
                            dakika:zaman.getMinutes()
                        }
                        if(tut.dakika.toString().length==1)
                        {
                            tut.dakika=`0${tut.dakika}`;
                        }
                        if(tut.saat.toString().length==1)
                        {
                            tut.saat=`0${tut.saat}`;
                        }
                        if(tut.ay.toString().length==1)
                        {
                            tut.ay=`0${tut.ay}`;
                        }
                        if(tut.tarih.toString().length==1)
                        {
                            tut.tarih=`0${tut.tarih}`;
                        }
                        element.date=tut.tarih+"/"+tut.ay+"/"+tut.yil+" | "+tut.saat+":"+tut.dakika;
                    });
                    //console.log("veritut: ",veritut);

                }
                return res.json({morePost:veritut,tumpostsayisi:tumpostsayisi,sonrakiresult:tutsonrakiresult});
            }
            else
            {
                //console.log("yeniresult(yok): ",result);
                return res.json({morePost:veritut});
            }
    }) 
   
}

module.exports.otherProfilePostAddMore=(req,res)=>{
    const veritut=[];
    var tumpostsayisi;
    var tutsonrakiresult;
    const {syc,otherUsername}=req.body;
    Write.find({username:otherUsername}).sort({date:-1})
    .then(result=>{
        tumpostsayisi=result.length;
        var yeniresult=result.splice(syc,10);//onuncudan sonra on tane göster
        var sonrakiresult=result.splice(syc,10);
        // console.log("sonrakiresult: ",sonrakiresult.length);
        tutsonrakiresult=sonrakiresult.length;
        return yeniresult;
    })
    .then(result=>{
        //console.log("gelen: ",result.length)
            if(result!="")
            {
                {
                    result.forEach((element) => {
                        veritut.push({username:element.username,metin:element.getwrite,date:element.date,postid:element._id});
                    })
                    veritut.forEach(element => {
                        //console.log(element.date);
                        zaman=element.date;
                        tut={
                            tarih:zaman.getDate(),
                            ay:zaman.getMonth()+1,
                            yil:zaman.getFullYear(),
                            saat:zaman.getHours(),
                            dakika:zaman.getMinutes()
                        }
                        if(tut.dakika.toString().length==1)
                        {
                            tut.dakika=`0${tut.dakika}`;
                        }
                        if(tut.saat.toString().length==1)
                        {
                            tut.saat=`0${tut.saat}`;
                        }
                        if(tut.ay.toString().length==1)
                        {
                            tut.ay=`0${tut.ay}`;
                        }
                        if(tut.tarih.toString().length==1)
                        {
                            tut.tarih=`0${tut.tarih}`;
                        }
                        element.date=tut.tarih+"/"+tut.ay+"/"+tut.yil+" | "+tut.saat+":"+tut.dakika;
                    });
                    //console.log("veritut: ",veritut);

                }
                return res.json({morePost:veritut,tumpostsayisi:tumpostsayisi,sonrakiresult:tutsonrakiresult});
            }
            else
            {
                //console.log("yeniresult(yok): ",result);
                return res.json({morePost:veritut});
            }
    }) 
   
}