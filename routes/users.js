const express=require("express");
const router=express.Router();

const {pageControlNotSession,pageControlSession}=require("../middleware/pageControl");
const loginControllersFile=require("../controllers/loginController");
const registerControllersFile=require("../controllers/registerController");
const logoutControllerFile=require("../controllers/logoutController");
const addwriteControllerFile=require("../controllers/addwriteController");
const profileControllerFile=require("../controllers/profileController");
const searchControllerFile=require("../controllers/searchController");
const {explore}=require("../controllers/exploreController");
const resetPasswordFile=require("../controllers/resetPassword");
const {jwtControl}=require("../middleware/jwtControl");
const postControllerFile=require("../controllers/postController");
const {usernameControl}=require("../middleware/usernameControl");
const mesajControllerFile=require("../controllers/mesajController");
 
//pageControlSession => kontrol et session var ise bu sayfaya erişime izin verme
//pageControlNotSession => kontrol et session yok ise bu sayfaya erişime izin verme

router.get("/",pageControlNotSession,explore);
router.post("/explore/addmore",pageControlNotSession,postControllerFile.explorePostAddMore);
router.post("/profile/addmore",pageControlNotSession,postControllerFile.profilePostAddMore);
router.post("/otherProfile/addmore",pageControlNotSession,postControllerFile.otherProfilePostAddMore);

router.get("/register",pageControlSession,registerControllersFile.getRegister); //
router.get("/reset-password",pageControlSession,resetPasswordFile.resetpassword); //
router.get("/reset-password/:resettoken",pageControlSession,resetPasswordFile.getResetPasswordToken); //
router.post("/reset-password/:resettoken",pageControlSession,resetPasswordFile.postResetPasswordToken); //
router.post("/reset-password-email",pageControlSession,resetPasswordFile.resetpasswordemail); //
router.post("/register",pageControlSession,registerControllersFile.postRegister); //


router.get("/search",searchControllerFile.search);

router.get("/logout",pageControlNotSession,logoutControllerFile.logout);
router.get("/addwrite",pageControlNotSession,jwtControl,addwriteControllerFile.getaddwrite);
router.get("/search",searchControllerFile.search);
router.post("/addwrite",pageControlNotSession,jwtControl,addwriteControllerFile.postaddwrite);

router.get("/direct",pageControlNotSession,mesajControllerFile.getDirect);
router.get("/direct/new",pageControlNotSession,mesajControllerFile.getyenimesaj);
router.get("/direct/t/:otherusername",pageControlNotSession,jwtControl,mesajControllerFile.getWriteDirect);
router.post("/direct/new/search/",pageControlNotSession,mesajControllerFile.getNewDirectSearch);
router.get("/direct/delete/:receiver",pageControlNotSession,jwtControl,mesajControllerFile.directDelete);


router.get("/login/username",pageControlSession,loginControllersFile.getLoginUsername); //
router.post("/login/username",pageControlSession,loginControllersFile.postLoginUsername); //
router.get("/login/password",pageControlSession,loginControllersFile.getLoginPassword); //
router.post("/login/password",pageControlSession,loginControllersFile.postLoginPassword); //

router.get("/:username/password-change",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.getprofilechangepassword);
router.post("/:username/password-change",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.postprofilechangepassword);

router.get("/:username/membership-delete",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.getmembershipDelete);
router.post("/:username/membership-delete",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.postmembershipDelete);

router.get("/:username/ayarlar",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.ayarlar);

router.get("/:username/image-upload",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.getimageUpload);
router.get("/:username/image-upload/image-remove",pageControlNotSession,usernameControl,profileControllerFile.imageRemove);
router.post("/:username/image-upload",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.postimageUpload);

router.get("/:username/post-delete/:postid",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.getpostDelete);
router.post("/:username/post-delete/:postid",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.postpostDelete);

router.get("/:username/post-update/:postid",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.getpostupdate);
router.post("/:username/post-update/:postid",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.postpostupdate);
router.get('/favicon.ico', (req, res) => { res.render("pages/NotFound",{title:"Not Found",NotFoundPage:true})});

router.get("/:username/email-change",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.getemailchange);
router.post("/:username/email-change",pageControlNotSession,jwtControl,usernameControl,profileControllerFile.postemailchange);

router.get("/:username/reset-password",pageControlNotSession,jwtControl,usernameControl,resetPasswordFile.userResetPassword);
router.get("/:username/reset-password/:resettoken",pageControlNotSession,jwtControl,usernameControl,resetPasswordFile.getuserResetPassword);
router.post("/:username/reset-password/:resettoken",pageControlNotSession,jwtControl,usernameControl,resetPasswordFile.postuserResetPassword);

router.get("/:username",profileControllerFile.profile);

module.exports=router;