const express = require('express');
const { lastname } = require('../../models/Children');
// const { CLEAR_ERRORS } = require('../../client/src/actions/types');
const router = express.Router();
const UserInfo = require('../../models/UserInfo');

router.post('/userinfo/register', (req, res) => {
  UserInfo.findOne({ userid: req.body.userid }).then(userinfo => {
    if (userinfo) {
      // errors.userinfo = 'UserInfo already exists';
      return res.json(userinfo);
    } else {
      const newUser = new UserInfo({
        userid: req.body.userid,
      });
      new UserInfo(newUser).save().then(profile => res.json(profile))
          .catch(err => console.log(err));
    }
  });
});
router.post('/userinfo/update', (req, res) => {
  if(!req.body.children){
    UserInfo.findOneAndUpdate({userid:req.body.userid}, req.body, {upsert: true}, function(err, result) {
      UserInfo.findOne({ userid: req.body.userid }).then(data => {
        return res.json(data);
      });
    });
  } else {
    req.body.children.forEach(element => {
      UserInfo.findOneAndUpdate({userid:req.body.userid}, {common:req.body.common,$push: {"children":{"firstname":element.firstname,"middlename":element.middlename,"lastname":element.lastname,"age":element.age,"birthday":element.birthday, "address":element.address}}}, {upsert: true}, function(err, result) {
        UserInfo.findOne({ userid: req.body.userid }).then(data => {
          return res.json(data);
        });
      });
    });
  };
});
router.post('/userinfo/deletechild', (req, res) => {
  UserInfo.findOneAndUpdate({userid:req.body.userid}, {$pull: {"children":{_id:req.body.childid}}}, {upsert: true}, function(err, result) {
    UserInfo.findOne({ userid: req.body.userid }).then(data => {
      return res.json(data);
    });
  });
});

module.exports = router;