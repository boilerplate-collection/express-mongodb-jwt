const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;


checkinput = (req, res, next)=> {
    const {username, email, password} = req.body;

    if(!username){
        res.status(400).send({ message: "username은 필수 입력 값입니다."})
        return;
    }

    if(!password){
        res.status(400).send({ message: "password는 필수 입력 값입니다."})
        return;
    }

    const vaildCheck = email.indexOf('@');
    if(email === undefined || email === null || vaildCheck=== -1){
        res.status(400).send({ message: "올바른 이메일을 입력해주세요."})
        return;
    }



    next();
}

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "이미 가입되어있는 사용자 입니다." });
            return;
        }

        // Email
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(400).send({ message: "이미 가입되어있는 이메일 입니다." });
                return;
            }

            next();
        });
    });
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `실패! ${req.body.roles[i]} 권한이 존재하지 않습니다!`
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;