// hashPassword.js (temporary script)
const bcrypt = require('bcryptjs');

const password = 'password123';
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});