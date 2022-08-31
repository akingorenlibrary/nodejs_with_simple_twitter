const express=require("express");
const app=express();
const fs=require("fs");
const jwt=require("jsonwebtoken");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const dbUrl="mongodb+srv://aking:1234@nodedbilk.tkvgs.mongodb.net/passportdb?retryWrites=true&w=majority";
{
    mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(result=>console.log("Veritabanı bağlantısı başarılı"))
    .catch(err=>console.log("Veritabanı bağlantısı başarısız",err));
}
const flash=require("connect-flash");
const session=require("express-session");
const cookieParser=require("cookie-parser");
var MongoDBStore = require('connect-mongodb-session')(session);
const path=require("path");
const multer  = require('multer');
const { engine }=require("express-handlebars");
const userRouter=require("./routes/users");
const socket=require("socket.io");
const server=app.listen( process.env.PORT|| 3000);
const io=socket(server);



app.use(cookieParser());
app.use(cookieParser('userflash'));

var store = new MongoDBStore({
    uri: dbUrl,
    collection: 'mySessions'
});


app.use(require('express-session')({
secret: 'This is a secret',
cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
},
store: store,
resave: false,
saveUninitialized: false
}));

app.use(express.static("public"));
app.use(session({ 
    cookie: { maxAge: 60000 },
    resave:true,
    secret:"userflash",
    saveUninitialized:true
}));

app.use(flash());



app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

const storage=multer.diskStorage({
    destination:function (req,file,callback) {
        callback(null,`./public/user-images/${req.session["username"]}`)
      },
    filename:function (req,file,callback) {
        callback(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
      }
});

app.use(multer({storage:storage}).single("image"));

app.use((req,res,next)=>{
res.locals.flashSuccess=req.flash("flashSuccess");
res.locals.flashError=req.flash("flashError");
next(); 
})


app.use(userRouter);

const Direct=require("./models/direct");
//socketio
io.on("connection",(socket)=>{
   //console.log("socketid: ",socket.id);
    socket.on("chat",(data)=>{
        const add=new Direct({
            sender:data.sender,
            receiver:data.receiver,
            message:data.message,
            delete_confirm_user1:"null",
            delete_confirm_user2:"null"
        }) 
        add.save()
        .then(result=>{
            io.sockets.emit("chat",data);
        })
        .catch(err=>console.log(err));    
    });

});

//socketio

app.use((req,res)=>{
    res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})
});


