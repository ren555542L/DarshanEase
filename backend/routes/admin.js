const express = require('express');
const router = express.Router();
const { getAllUsers, getAllOrganizers, updateUser, deleteUser, getAnalytics, createOrganizer } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/organizers', getAllOrganizers);
router.post('/organizers', createOrganizer);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

module.exports = router;
