const userModel = require('../models/User');
const reviewModel = require('../models/Review');

const dashboardsControllers = {
    // Render Admin Dashboard
    adminDashboard: async (req, res) => {
        try {
            if (req.isAuthenticated()) {
                // Populate all users from userModel
                let users = await userModel.find({});
                let filteredUsers = users.filter(
                    (user) => user.email !== req.user.email
                );
                // console.log("filteredUsers: ", filteredUsers);
                return res.render('admin-dashboard', { title: "Admin Dashboard", filteredUsers: filteredUsers });
            } else {
                return res.redirect('/');
            }
        } catch (err) {
            console.log(err);
            return res.redirect('/');
        }
    },
    // Render Employee Dashboard
    employeeDashboard: async (req, res) => {
        try {
            if (req.isAuthenticated()) {
                // populate the employee with reviews assigned to it and reviews from others
                const employee = await userModel.findById(req.params.id)
                    .populate({
                        path: 'reviewsFromOthers',
                        populate: {
                            path: 'reviewer',
                            model: 'User',
                        },
                    })
                    .populate('assignedReviews');

                // extract the reviews assigned to it
                const assignedReviews = employee.assignedReviews;

                // extract feedbacks from other employees
                const reviewsFromOthers = employee.reviewsFromOthers;

                // populate reviews given from others
                const populatedResult = await reviewModel.find().populate({
                    path: 'reviewer',
                    model: 'User',
                });

                return res.render('employee-dashboard', {
                    title: 'Employee Dashboard',
                    employee,
                    assignedReviews,
                    reviewsFromOthers,
                });
            } else {
                return res.redirect('/');
            }
        } catch (err) {
            console.log(err);
            return res.redirect('back');
        }
    }
};

module.exports = dashboardsControllers;