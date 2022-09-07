const fetch = require("node-fetch-commonjs");

module.exports.formValidation=(username,email,password, recaptchaResponse)=>{
    const error=[];
    let regexUsername=/[^\w.]/g;//[A-Za-z0-9_.] dışındakileri kabul etmez kontolü
    let regexUsername2=/[A-Z]/g;//büyük harf kontrolü
    let regexPassword=/\s/g;//boşluk kontrolü
    let regexEmail = /(?<e1>.*)(?=@)@(?<e2>.*)/;
    let regexEmail2=/[^\w.]/g;
    let match = email.match(regexEmail);
    //console.log("match: ",match)
    let recaptchaSecretkey="6LfZMdohAAAAAE0s00QlZUcb8gNN6VXcrRrr_pv8";
    let recaptchaUrl="https://www.google.com/recaptcha/api/siteverify";
    try
    {    
        if(username=="" || password == "" || email=="")
        throw "Boş bırakmayın.";

        if(regexUsername.test(username))
        throw "Username türkçe veya özel karakter içermemelidir.";

        if(regexUsername2.test(username))
        throw "Username büyük harf içermemelidir.";

        if(regexPassword.test(password))
        throw "Password boşluk içermemelidir."

        if(password.length<6)
        throw "Şifre 6 karekterden uzun olmalıdır.";

        if(password.length>50)
        throw "Şifre 50 karakterden uzun olamaz.";

        if(email.length>50)
        throw "Email 50 karakterden uzun olamaz.";

        if(username.length>20)
        throw "Username 20 karakterden fazla olamaz.";

        if(match==null)
        throw "Hatalı email girişi.";

        if(regexEmail2.test(match[1]))
        throw "@'dan önceki kısımda özel karakter kullanmayınız.";

        if(recaptchaResponse)
        {
            fetch(recaptchaUrl+"?secret="+recaptchaSecretkey+"&response="+recaptchaResponse,{method:"POST"})
            .then(result=>result.json())
            .then(response=>{
                //console.log("response: ",response);
                if(response.success==false)
                throw "Çok fazla giriş isteğinde bulundunuz."
            })
            .catch(err=>{
                throw "Recaptcha hatası."
            })

        }
        else
        {
            throw "Recaptcha boş bırakılamaz."
        }
    }
    catch(hata)
    {
        error.push(hata);
    }
    
    return error;
}


module.exports.addWriteFormControl=(metin)=>{
    const error=[];
    try{
        if(metin=="")
        throw "Boş bırakmayın.";
        
        if(metin.length >200)
        throw "Maksimum 200 karakter girebilirsiniz.";
    }
    catch(errorMessage)
    {
        error.push(errorMessage);
    }
    return error;
};


module.exports.resetPasswordFormValidation=(yeniSifre1,yeniSifre2)=>{
    const error=[];
    try{
            if(yeniSifre1 == "" || yeniSifre2 == "")
            throw "Boş bırakmayın.";

            if(yeniSifre1!=yeniSifre2)
            throw "Girilen şifreler aynı değil.";

            if(yeniSifre1.length<6 || yeniSifre2.length<6)
            throw "Şifre uzunluğu minimum 6 karakter uzunluğunda olmalıdır.";
    }
    catch(yanit)
    {
        error.push(yanit)
    }
    return error;
}

module.exports.emailChangeFromValidation=(yeniEmail,mevcutSifre)=>{
    const error=[];
    try{
        if(yeniEmail == "" || mevcutSifre == "")
        throw "Lütfen boş bırakmayın."
    }
    catch(yanit)
    {
        error.push(yanit);
    }
    return error;
}

module.exports.postLoginPasswordValidation=(password, recaptchaResponse)=>{

let recaptchaSecretkey="6LfZMdohAAAAAE0s00QlZUcb8gNN6VXcrRrr_pv8";
let recaptchaUrl="https://www.google.com/recaptcha/api/siteverify";
const error=[];

try{

    if(password=="")
    throw "Boş bırakmayınız.";

    if(password.length>50)
    throw "Şifre 50 karakterden fazla olamaz."

    if(recaptchaResponse)
    {
        fetch(recaptchaUrl+"?secret="+recaptchaSecretkey+"&response="+recaptchaResponse,{method:"POST"})
        .then(result=>result.json())
        .then(response=>{
            //console.log("response: ",response);
            if(response.success==false)
            throw "Çok fazla giriş isteğinde bulundunuz."
        })
        .catch(err=>{
            throw "Recaptcha hatası."
        })

    }
    else
    {
        throw "Recaptcha boş bırakılamaz."
    }

}
catch(errorMessage)
{
    error.push(errorMessage);
}

return error;
}

module.exports.resetPasswordEmailValidation=(email,recaptchaResponse)=>{

    let recaptchaSecretkey="6LfZMdohAAAAAE0s00QlZUcb8gNN6VXcrRrr_pv8";
    let recaptchaUrl="https://www.google.com/recaptcha/api/siteverify";
    const error=[];
    
    try{
    
        if(email=="")
        throw "Boş bırakmayınız.";
    
        if(email.length>50)
        throw "Email 50 karakterden fazla olamaz."
    
        if(recaptchaResponse)
        {
            fetch(recaptchaUrl+"?secret="+recaptchaSecretkey+"&response="+recaptchaResponse,{method:"POST"})
            .then(result=>result.json())
            .then(response=>{
                //console.log("response: ",response);
                if(response.success==false)
                throw "Çok fazla giriş isteğinde bulundunuz."
            })
            .catch(err=>{
                console.log(err)
                throw "Recaptcha hatası."
            })
    
        }
        else
        {
            throw "Recaptcha boş bırakılamaz."
        }
    
    }
    catch(errorMessage)
    {
        error.push(errorMessage);
    }

    return error;
}

module.exports.controlProfilePasswordChange = (mevcutSifre, yeniSifre1, yeniSifre2) => {
    const error = [];
    try{
        if (mevcutSifre == "" && yeniSifre1 == "" && yeniSifre2 == "")
        throw "Lütfen şifre kısmını boş bırakmayınız";

        if(yeniSifre1 != yeniSifre2)
        throw "Girilen yeni şifreler eşleşmiyor";

        if(yeniSifre1.length<6)
        throw "Şifre 6 karekterden uzun olmalıdır";

        if(yeniSifre1.length>50)
        throw "Şifre 50 karekterden uzun olamaz.";

        if(mevcutSifre==yeniSifre1 || mevcutSifre==yeniSifre2)
        throw "Mevcut şifre yeni şifre ile aynı olamaz";

    }
    catch(hata){
        error.push(hata);
    }
    return error;
}



module.exports.userResetPasswordEmailValidation = (recaptchaResponse) => {
    let recaptchaSecretkey="6LfZMdohAAAAAE0s00QlZUcb8gNN6VXcrRrr_pv8";
    let recaptchaUrl="https://www.google.com/recaptcha/api/siteverify";
    const error = [];
    try{
        if(recaptchaResponse)
        {
            fetch(recaptchaUrl+"?secret="+recaptchaSecretkey+"&response="+recaptchaResponse,{method:"POST"})
            .then(result=>result.json())
            .then(response=>{
                //console.log("response: ",response);
                if(response.success==false)
                throw "Çok fazla giriş isteğinde bulundunuz."
            })
            .catch(err=>{
                console.log(err)
                throw "Recaptcha hatası."
            })
    
        }
        else
        {
            throw "Recaptcha boş bırakılamaz."
        }

    }
    catch(hata){
        error.push(hata);
    }
    return error;
}

module.exports.postMembershipDeleteRecaptchaValidation = (recaptchaResponse) => {
    let recaptchaSecretkey="6LfZMdohAAAAAE0s00QlZUcb8gNN6VXcrRrr_pv8";
    let recaptchaUrl="https://www.google.com/recaptcha/api/siteverify";
    const error = [];
    try{
        if(recaptchaResponse)
        {
            fetch(recaptchaUrl+"?secret="+recaptchaSecretkey+"&response="+recaptchaResponse,{method:"POST"})
            .then(result=>result.json())
            .then(response=>{
                //console.log("response: ",response);
                if(response.success==false)
                throw "Çok fazla giriş isteğinde bulundunuz."
            })
            .catch(err=>{
                console.log(err)
                throw "Recaptcha hatası."
            })
    
        }
        else
        {
            throw "Recaptcha boş bırakılamaz."
        }

    }
    catch(hata){
        error.push(hata);
    }
    return error;
}
