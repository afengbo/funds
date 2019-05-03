// 登陆 & 注册
const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile");

// $route GET apis/profiles/test
// @desc   返回请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({msg: "profile works"})
})

// $route POST apis/profiles/add
// @desc   创建信息
// @access private
router.post("/add", passport.authenticate("jwt", {session: false}), (req, res) => {
  const profileFields = {};
  if (req.body.type) profileFields.type = req.body.type;
  if (req.body.describe) profileFields.describe = req.body.describe;
  if (req.body.income) profileFields.income = req.body.income;
  if (req.body.expend) profileFields.expend = req.body.expend;
  if (req.body.cash) profileFields.cash = req.body.cash;
  if (req.body.remark) profileFields.remark = req.body.remark;

  new Profile(profileFields).save().then(profile => {
    res.json(profile);
  })
})

// $route GET apis/profiles/
// @desc   获取所有信息
// @access private
router.get("/", passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.find()
    .then(profile => {
      if(!profile) {
        return res.status(404).json("没有任何内容");
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
})

// $route GET apis/profiles/:id
// @desc   获取一条信息
// @access private
router.get("/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.findOne({ _id: req.params.id })
    .then(profile => {
      if(!profile) {
        return res.status(404).json("没有任何内容");
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
})

// $route POST apis/profiles/edit/:id
// @desc   编辑一条信息
// @access private
router.post("/edit/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
  const profileFields = {};
  if (req.body.type) profileFields.type = req.body.type;
  if (req.body.describe) profileFields.describe = req.body.describe;
  if (req.body.income) profileFields.income = req.body.income;
  if (req.body.expend) profileFields.expend = req.body.expend;
  if (req.body.cash) profileFields.cash = req.body.cash;
  if (req.body.remark) profileFields.remark = req.body.remark;

  Profile.findOneAndUpdate(
    { _id: req.params.id },
    { $set: profileFields },
    { new: true })
      .then(profile => res.json(profile))
      .catch(err => res.status(400).json(err));
})

// $route GET apis/profiles/delete/:id
// @desc   删除一条信息
// @access private
router.delete("/delete/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
  Profile.findOneAndRemove({ _id: req.params.id })
    .then(profile => {
      if(!profile) {
        return res.status(404).json("没有对应ID内容");
      }
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
})

module.exports = router;