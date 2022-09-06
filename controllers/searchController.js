const User=require("../models/user");

module.exports.search=(req,res)=>{
    const username=req.query.q.toLowerCase();
   
    if(username != "")
    {
        if(username.length <= 20)
        {
            var otherUser_image;
        
            User.findOne({username:username})
            .then(response=>{
                if(response != null)
                {
                    if (response.user_image != "notimage") {
                        otherUser_image = response.user_image;
                    }
                    res.render("pages/results",{
                        user:req.session["username"],
                        query:username,
                        durum:true,
                        otherUser_image:otherUser_image
                    });
                }
                else
                {
                    res.render("pages/results",{
                        user:req.session["username"],
                        query:username,
                        durum:false
                        });
                }
            })
            .catch(err=>{
                console.log(err);
                return  res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
            });
        }
        else
        {
            res.render("pages/results",{
                user:req.session["username"],
                query:username,
                message:"Kullanıcı adı 20 karakterden fazla olamaz."
               });
        }
    }
    else
    {
        res.render("pages/results",{
            user:req.session["username"],
            query:username,
            message:"Boş bırakmayın."
           });
    }
    

    
}