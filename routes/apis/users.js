// 登陆 & 注册
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const keys = require("../../config/keys");
const passport = require("passport");

const saltRounds = 10;
const User = require("../../models/User");

// $route GET apis/users/test
// @desc   返回请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({msg: "api works"})
})

// $route POST apis/users/register
// @desc   返回请求的json数据
// @access public
router.post("/register", (req, res) => {
    // console.log(req.body);
    // 查询数据库中邮箱是否存在
    User.findOne({email:req.body.email}).then(user => {
        if (user) {
            return res.status(400).json("邮箱已注册！")
        }else {
            // s：状态;  r：模式;  d：默认, mm表示显示一个默认头像
            var avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                identity: req.body.identity,
                password: req.body.password
            })

            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;

                    newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                });
            });
        }
    });
})

// $route POST apis/users/login
// @desc   返回json数据： token jwt
// @access public
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库
    User.findOne({email})
        .then(user => {
            if(!user) {
                return res.status(404).json("用户不存在");
            }

            // 密码匹配
            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                      if(isMatch) {
                          const rule = {
                              id:user.id, 
                              name:user.name,
                              avatar:user.avatar,
                              identity:user.identity,
                            };
                          // 参数：规则，加盐，过期时间，箭头函数
                          jwt.sign(rule, keys.secretOrKey, {expiresIn:3600}, (err, token) => {
                              if(err) throw err;
                              res.json({
                                  success:true,
                                  // 必须以Bearer 开头
                                  token: "Bearer " + token
                              })
                          });
                        //   res.json({msg: "success"});
                      }else{
                          return res.status(400).json("密码错误");
                      }
                  })
        })
})

// $route POST apis/users/current
// @desc   验证token  返回当前用户
// @access Private
router.get("/current", passport.authenticate("jwt", {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        identity: req.user.identity,
    })
})

module.exports = router;