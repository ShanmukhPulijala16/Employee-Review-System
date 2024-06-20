const userModel = require('../models/User');
const reviewModel = require('../models/Review');

const reviewsControllers = {
    // Assign a review
    assignReview: async (req, res) => {
        const { recipient_email } = req.body;
        try {
            if (req.isAuthenticated()) {
                const reviewer = await userModel.findById(req.params.id);
                const recipient = await userModel.findOne({ email: recipient_email });

                //Check whether recipient is already assigned to reviewer
                const isAssigned = reviewer.assignedReviews.includes(recipient._id);
                if (isAssigned) {
                    req.flash('error', 'Review already assigned!');
                    return res.redirect('back');
                }

                await reviewer.updateOne({
                    $push: { assignedReviews: recipient }
                });

                req.flash('success', 'Review assigned sucessfully!');
                return res.redirect('back');
            } else {
                req.flash('error', "Couldn't assign review!");
                return res.redirect('back');
            }

        } catch (err) {
            console.log(err);
            return res.redirect('back');
        }
    },
    // Create and submit review
    createReview: async (req, res) => {
        try {
            const { email, feedback } = req.body;
            const reviewer = await userModel.findById(req.params.id);
            const recipient = await userModel.findOne({ email });
            const review = await reviewModel.create({
                review: feedback,
                reviewer: reviewer._id,
                recipient: recipient._id
            });

            // Remove all extra spaces from the review
            const reviewString = review.review.trim();
            //Don't submit empty feedback
            if (reviewString === "") {
                req.flash('error', "Feedback can't be empty");
                return res.redirect('back');
            }

            // Push reference of newly created review
            await recipient.updateOne({
                $push: { reviewsFromOthers: review._id }
            });

            // Remove reference of the recipient from the reviewer's assignedReviews field
            await reviewer.updateOne({
                $pull: { assignedReviews: recipient._id }
            });

            req.flash('success', 'Review submitted successfully');
            return res.redirect('back');
        } catch (err) {
            console.log(err);
            return res.redirect('back');
        }
    },
    updateReview: async (req, res) => {
        try {
            const { feedback } = req.body;
            const reviewObj = await reviewModel.findById(req.params.id);

            if (!reviewObj) {
                req.flash('error', 'Review does not exist!');
                return res.redirect('back');
            }
            // Assigning the new feedbak
            reviewObj.review = feedback;
            // Saving the review
            await reviewObj.save();
            req.flash('success', 'Review updated!');
            return res.redirect('/');
        } catch (err) {
            console.log(err);
            return res.redirect('back');
        }
    }
};

module.exports = reviewsControllers;