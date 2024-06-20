const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersControllers = require('../controllers/usersControllers');
const dashboardsControllers = require('../controllers/dashboardControllers');

router.get('/', usersControllers.signIn);
router.get('/sign-up', usersControllers.signUp);
router.post('/sign-out', usersControllers.signOut);

router.get('/admin-dashboard', dashboardsControllers.adminDashboard);
router.get('/employee-dashboard/:id', dashboardsControllers.employeeDashboard);

router.get('/add-employee', usersControllers.addEmployee);
router.get('/edit-employee/:id', usersControllers.editEmployee);
router.post('/update-employee/:id', usersControllers.updateEmployee);

router.get('/destroy/:id', usersControllers.deleteUser);

router.post('/create', usersControllers.create);
// Authentication using passport as middleware
router.post(
    '/create-session',
    passport.authenticate('local', {
        // successRedirect: '/sign-up', // or any route you want to redirect to upon successful login
        failureRedirect: '/',
        failureFlash: true // optionally enable flash messages for failures
    }),
    usersControllers.createSession
);

module.exports = router;