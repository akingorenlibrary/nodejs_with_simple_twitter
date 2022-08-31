const User=require("../models/user");

module.exports.search=(req,res)=>{
    if(req.query.q != "")
    {
        var otherUser_image;
        //console.log("query: ",req.query.q);
        User.findOne({username:req.query.q})
        .then(response=>{
            if(response != null)
            {
                if (response.user_image != "notimage") {
                    otherUser_image = response.user_image;
                }
                res.render("pages/results",{
                    user:req.session["username"],
                    query:req.query.q,
                    durum:true,
                    otherUser_image:otherUser_image
                   });
            }
            else
            {
                res.render("pages/results",{
                     user:req.session["username"],
                     query:req.query.q,
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
            query:req.query.q,
            message:"Boş bırakmayın"
           });
    }
    

    
}