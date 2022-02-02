let express = require('express');
// const { route } = require('express/lib/application');

let router = express.Router();
let usercontrollers = require('../controller/usercontrollers');

//this gets all the users info doesn not need any input,
router.get('/user',usercontrollers.checkjwt , usercontrollers.getusers);

//this gets all the business info, can input name for more specific search
router.get('/businessName', usercontrollers.getbusinesses);

// this will allow you to update a review left,
router.put('/review');

// this will allow you to remove a like/dislike
router.delete('/review/:remove');

//allows user to enter new business into database
router.post('/newbusiness');

// this allows you a new user to create an account
router.post('/newuser', usercontrollers.createuser);

// allows user to log into account
router.post('/login', usercontrollers.login);


module.exports = router;
