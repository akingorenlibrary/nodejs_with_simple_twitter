const Write=require("../models/writes");

module.exports.explore=(req,res)=>{
    const sakla=[];
    var zaman=new Date();
    var tut;
    Write.find().limit(10).sort({date:-1})
    .then(result=>{
            result.forEach((element) => {
                sakla.push({username:element.username,metin:element.getwrite,date:element.date});
            })
            sakla.forEach(element => {
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
               //console.log(zaman.getUTCDate(),"/",zaman.getMonth()+1,"/",zaman.getFullYear()," ",zaman.getHours(),":",zaman.getMinutes());
            });
            
            Write.find({})
            .then(result=>{
                //console.log("result: ",result.length)
               if(result.length>10)
               {
                    return  res.render("pages/explore",{ 
                        user:req.session["username"],
                        activeHome:true,
                        writes:sakla,
                        goruldu:sakla.length,
                        allpost:result.length,
                        title:"Explore",
                        explorePage:true
                    });
               }
               else
               {
                    return  res.render("pages/explore",{ 
                        user:req.session["username"],
                        activeHome:true,
                        writes:sakla,
                        title:"Explore",
                        explorePage:true
                    });
               }
            })
            .catch(err=>console.log(err)); 
            
        })
    .catch(err=>console.log(err));
    
       
    
    }