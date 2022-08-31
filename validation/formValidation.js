
module.exports.formValidation=(username,email,password)=>{
    const error=[];
    try
    {
        if(username=="" || email=="" || password=="" )
        throw "Kullanıcı adı veya şifre boş bırakılamaz";
        
        if(password.length<6)
        throw "Şifre 6 karekterden uzun olmalıdır";
    }
    catch(hata)
    {
        error.push(hata);
    }
    
    return error;
}


module.exports.addWriteFormControl=(metin)=>{
    const error=[];
    if(metin=="")
    {
        error.push("Boş bırakmayın");
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