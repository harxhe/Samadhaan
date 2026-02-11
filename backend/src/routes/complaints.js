const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');

router.post('/', complaintsController.createComplaint);
router.get('/', complaintsController.getAllComplaints);
router.get('/user/:userId', complaintsController.getUserComplaints);

module.exports = router;
