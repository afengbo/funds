const express = require("express");
const mongoose = require("mongoose");
// const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();

// 引入users.js
const users = require("./routes/apis/users");

// mongodb 连接参数
const db = require("./config/keys").mongoURI

// Connect to mongodb
mongoose.connect(db, { useNewUrlParser: true })
        .then(() => console.log("MongoDB连接成功"))
        .catch(err => console.log(err));

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
// passport 初始化
app.use(passport.initialize());

require("./config/passport")(passport);

// 连接mongo数据库
// MongoClient.connect(db, { useNewUrlParser: true }, function (err, db) {
//     if (err) throw err;
//     console.log('数据库已创建');
//     var dbase = db.db("restful");
//     dbase.createCollection('site', function (err, res) {
//         if (err) throw err;
//         console.log("创建集合!");
//         db.close();
//     });
// });


app.get("/", (req, res) => {
    res.send("Hello World!")
})

// 使用routers
app.use("/apis/users", users)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})