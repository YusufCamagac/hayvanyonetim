
const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = 'Yönetici1.'; 

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) {
        console.error("Şifre hash'lenirken hata oluştu:", err);
    } else {
        console.log("Hash'lenmiş şifre:", hash);
    }
});
