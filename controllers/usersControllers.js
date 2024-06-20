const path = require('path');
const reviewModel = require('../models/Review');
const userModel = require('../models/User');

const usersControllers = {
    // Render sign-in page
    signIn: (req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.role === 'admin') {
                return res.redirect('/admin-dashboard');
            }
            return res.redirect(`/employee-dashboard/${req.user._id}`);
        }
        return res.render('sign-in', {
            title: 'ERS | Sign In'
        });
    },
    // Render sign-up page
    signUp: (req, res) => {
        if (req.isAuthenticated()) {
            if (req.user.role === 'admin') {
                return res.redirect('/admin-dashboard');
            }
            return res.redirect(`/employee-dashboard/${req.user._id}`);
        }
        return res.render('sign-up', {
            title: 'ERS | Sign Up'
        });
    },
    // Render add employee page
    addEmployee: (req, res) => {
        if (req.isAuthenticated() && req.user.role === 'admin') {
            return res.render('add-employee', { title: 'Add Employee' });
        }
        return res.redirect('/');
    },
    // Render edit employee page
    editEmployee: async (req, res) => {
        try {
            // if (req.isAuthenticated() && req.user.role === 'admin') {
            //     const employee = await userModel.findById(req.params.id);
            //     const reviewsFromOthersArray = employee.reviewsFromOthers;
            //     let reviewsFromOthers = [];
            //     for (let id of reviewsFromOthersArray) {
            //         const review = await reviewModel.findById(id).populate('reviewer').exec();
            //         reviewsFromOthers.push(review);
            //     }
            //     return res.render('edit-employee', { title: 'Edit employee', employee, reviewsFromOthers });
            // }
            // return res.redirect('/');
            if (req.isAuthenticated() && req.user.role === 'admin') {
                const employee = await userModel.findById(req.params.id).populate({
                    path: "reviewsFromOthers",
                    model: "Review",
                    populate: ({
                        path: "reviewer",
                        model: "User"
                    })
                });
                const reviewsFromOthers = employee.reviewsFromOthers;
                return res.render('edit-employee', { title: 'Edit Employee', employee, reviewsFromOthers });
            }
            return res.redirect('/')
        } catch (err) {
            console.log(err);
            return res.redirect('back');
        }
    },
    // Logic to register a user after entering data on sign-up page
    create: async (req, res) => {
        try {
            const { username, email, password, confirmPassword, role, gender } = req.body;

            //If password doesn't match
            if (password !== confirmPassword) {
                req.flash('error', 'Passwords do not match!');
                return res.redirect('back');
            }

            //Code2
            //Check if user already exists
            const userExists = await userModel.findOne({ email: email });
            if (!userExists) {
                await userModel.create({
                    email,
                    password,
                    username,
                    role,
                    gender
                }).then((user) => {
                    if (!user) {
                        req.flash("error", "Could not create user");
                        return res.redirect('back');
                    }
                    req.flash("success", "User created in database");
                    return res.redirect('/');
                }).catch((err) => {
                    console.log(err);
                    req.flash("error", "Error creating user!");
                    return res.redirect('back');
                });
            } else {
                req.flash('error', 'User already registered!')
                return res.redirect('back');
            }
        } catch (err) {
            console.log("error", err);
            return res.redirect("back");
        }
    },
    // Render update employee page
    updateEmployee: async (req, res) => {
        try {
            if (req.isAuthenticated() && req.user.role === 'admin') {
                const employee = await userModel.findById(req.params.id);
                const { username, gender, role } = req.body;
                if (!employee) {
                    req.flash('error', 'Employee not found');
                    return res.redirect('back');
                }
                // Update with data from req.body
                employee.username = username;
                employee.gender = gender;
                employee.role = role;
                employee.save();

                req.flash('success', 'Employee details updated!');
                return res.redirect('/');
            }
            return res.redirect('/');
        } catch (err) {
            console.log(err);
            return res.redirect('back');
        }
    },
    // Delete an user
    deleteUser: async (req, res) => {
        try {
            const id = req.params.id;
            // Delete all the reviews the user with this id gave
            await reviewModel.deleteMany({ reviewer: id });
            // Delete all the reviews the user with this id received
            await reviewModel.deleteMany({ recipient: id });
            // Delete the user with this id
            await userModel.findByIdAndDelete(id);
            req.flash('success', 'User and associated reviews are deleted!');
            return res.redirect('/');
        } catch (err) {
            console.log(err);
            return res.redirect('back');
        }
    },
    // Sign in and create a session
    createSession: async (req, res) => {
        req.flash('success', 'Login is successful!')
        if (req.user.role === 'admin') {
            return res.redirect('/admin-dashboard');
        }
        // if user is not admin it will redirect to employee page
        return res.redirect(`/employee-dashboard/${req.user._id}`);
    },
    // Clear the cookie and delete session
    signOut: (req, res, next) => {
        // Clear session and logout user
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            // Destroy session
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                }
                // Clear the session cookie
                res.clearCookie('connect.sid');
                return res.redirect('/');
            });
        });
    }
};

module.exports = usersControllers;