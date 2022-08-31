module.exports.controlProfilePasswordChange = (mevcutSifre, yeniSifre1, yeniSifre2) => {
    const error = [];
    try{
        if (mevcutSifre == "" && yeniSifre1 == "" && yeniSifre2 == "")
        throw "Lütfen şifre kısmını boş bırakmayınız";

        if(yeniSifre1 != yeniSifre2)
        throw "Girilen yeni şifreler eşleşmiyor";

        if(yeniSifre1.length<6)
        throw "Şifre 6 karekterden uzun olmalıdır";

        if(mevcutSifre==yeniSifre1 || mevcutSifre==yeniSifre2)
        throw "Mevcut şifre yeni şifre ile aynı olamaz";

    }
    catch(hata){
        error.push(hata);
    }
    return error;
}