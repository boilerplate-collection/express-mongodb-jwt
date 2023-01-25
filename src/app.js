require('dotenv').config();

const express = require("express");
const cors = require("cors");
const dbConfig = require("./config/db.config")


const app = express();
const db = require("./models");
const Role = db.role;


const corsOptions = {
    origin: "http://localhost:4000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));



db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("MongoDB 연결 성공");
        initial();
    })
    .catch(err => {
        console.error("MongoDB 연결 에러", err);
        process.exit();
    });

const initial = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("role 컬렉션에 'user' 추가 성공");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("role 컬렉션에 'admin' 추가 성공 ");
            });
        }
    });
}



app.get("/", (req, res) => {
    res.json({ message: "Welcome to nodejs application." });
});
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`${PORT} 포트로 서버 연결됨`);
});

