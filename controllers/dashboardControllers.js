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
                const employee = await userModel.findById(req.params.id);
                const assignedReviewsArray = employee.assignedReviews;
                let assignedReviews = [];
                for (let id of assignedReviewsArray) {
                    let review = await userModel.findById(id);
                    assignedReviews.push(review);
                }
                const reviewsFromOthersArray = employee.reviewsFromOthers;
                let reviewsFromOthers = [];
                for (let id of reviewsFromOthersArray) {
                    let review = await reviewModel.findById(id).populate('reviewer').exec();
                    reviewsFromOthers.push(review);
                }
                console.log("reviewsFromOthers: ", reviewsFromOthers);
                return res.render('employee-dashboard', {
                    title: "Employee Dashboard",
                    employee,
                    assignedReviews,
                    reviewsFromOthers
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