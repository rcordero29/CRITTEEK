const connection = require('../source/db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { bus } = require('nodemon/lib/utils');
const secret = process.env.supersecret;

function checkjwt(req, res, next) {
  let token;
  if (!req.headers.authorization) {
    token = null;
    return res.status(500).json('you are not authorized');
  } else {
    let bearer = req.headers.authorization.split(' ');
    token = bearer[1];
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.status(500).json('you are not authorized');
      } else {
        console.log(decoded);
        req.userid = decoded.userid;
        next();
      }
    });
  }
}

function getusers(req, res) {
  console.log('inside get users route');
  let sql = 'SELECT * FROM usertable;';
  connection.query(sql, function (err, rows) {
    if (err) {
      return res.status(500).json('error');
    }
    res.json(rows);
  });
}

function getbusinesses(req, res) {
  console.log('Inside get businesses route');
  let sql = 'SELECT * FROM businessName;';
  connection.query(sql, function (err, rows) {
    if (err) {
      console.log(err);
      return res.status(500).json('error');
    }
    res.json(rows);
  });
}

async function createuser(req, res) {
  console.log('insider create user route');
  let { firstname, lastname, userpassword, useremail } = req.body;
  let sql =
    'INSERT INTO  usertable(firstname, lastname, userpassword, useremail) VALUES (?, ?, ?, ?);';
  let hash = await argon2.hash(userpassword);
  let body = [firstname, lastname, hash, useremail];
  connection.query(sql, body, function (err, results) {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
}
async function login(req, res) {
  console.log('inside login route');
  let { userpassword, useremail } = req.body;
  let sql = 'select * from usertable WHERE useremail = ?';
  connection.query(sql, [useremail], async function (err, rows) {
    if (err) {
      return res.status(500).json(err);
    }
    const hash = rows[0].userpassword;
    let match = await argon2.verify(hash, userpassword);
    if (!match) {
      return res.status(500).json('wrong password');
    } else {
      let unsignToken = {
        userid: rows[0].userid,
      };
      let token = jwt.sign(unsignToken, secret);
      res.json({ token });
    }
  });
}

function addbusiness(req, res) {
  console.log('inside add business route');
  let { businessName, businessAddress, businessPhone } = req.body;
  let sql =
    'INSERT INTO businessName (businessName, businessAdress, businessphone) VALUES (?,?,?);';
  let body = [businessName, businessAddress, businessPhone];
  connection.query(sql, body, function (err, results) {
    if (err) {
      console.log(err);
      return res.status(500).json('business error');
    } else {
      res.json(results);
    }
  });
}

function deleteBusiness(req, res) {
  console.log('inside delete business');
  //Don't forget to wrap this in an object - destructuring
  let {id} = req.params;
  let sql = 'DELETE FROM businessName WHERE ID = ?;';
  connection.query(sql, [id], function (err, results) {
    if (err) {
      console.log(err);
      return res.status(500).json('business error');
    } else {
      res.json(results);
    }
  });
}

function thumbsup(req, res) {
  console.log('inside thumbs up route');
  let businessId = req.params.id
  let userId = req.userid
  let thumbsup = 1
  let body = [businessId,userId,thumbsup];
  let sql = 'INSERT INTO userlikes (businessID, userID, thumbsup ) VALUES (?, ?, ?);'
  connection.query(sql, body, function (err, results) {
    if (err){
      console.log(err);
      return res.status(500).json('business error');
    }
    else {
      console.log(results);
      res.json('you liked this !')
    }
  })
}







module.exports = {
  getusers,
  createuser,
  login,
  getbusinesses,
  checkjwt,
  addbusiness,
  deleteBusiness,
  thumbsup
};
