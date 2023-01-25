const { verifySignUp, validator } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const  { body} = require('express-validator');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/signup",[
            body('username').trim().isLength({ min: 8 , max: 13}).withMessage('username은 8글자 이상 13 글자 미만이어야 합니다.'),
            body('password').trim().isLength({ min: 8 , max: 15}).withMessage('password는 8글자 이상 15 글자 미만이어야 합니다.'),
            body('email').trim().isEmail().withMessage('올바른 이메일을 입력해주세요.').normalizeEmail(),
            validator,
        ],
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/api/auth/login",
        [
            body('username').trim().notEmpty().withMessage("username을 입력해주세요"),
            body('password').trim().notEmpty().withMessage("password를 입력해주세요."),
            validator,
        ],
        controller.signin
    );
};