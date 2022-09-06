
module.exports.formValidation=(username,email,password)=>{
    const error=[];
    let regexUsername=/[^\w.]/g;//[A-Za-z0-9_.] dışındakileri kabul etmez kontolü
    let regexUsername2=/[A-Z]/g;//büyük harf kontrolü
    let regexPassword=/\s/g;//boşluk kontrolü
    let regexEmail = /(?<e1>.*)(?=@)@(?<e2>.*)/;
    let regexEmail2=/[^\w.]/g;
    let match = email.match(regexEmail);
    //console.log("match: ",match)
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