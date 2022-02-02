let express = require('express');
// const { route } = require('express/lib/application');

let router = express.Router();
let controller = require('../controller/usercontrollers');


// gets a list of all the business
router.get('/businessName', controller.businessName);

// gives a thumbs up to the business
router.put('/ups'.controller.thumbsUp);

// gives a thumbs down to the business
router.put('/downs'.controller.thumbsDown);

// gets a list of users likes
router.get('/userUps', controller.userLikes);

// Removes a liked business off a users list
router.delete('/remove/:id', controller.remove);

// updates review left by user if business reaches out
router.put('/update', controller.updateReview);

// allows user to post update on business
router.post('newRating', controller.newRating);

module.exports = router;
