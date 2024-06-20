const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/User');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true // Allows to set first argument as req
        },
        async (req, email, password, done) => {
            try {
                const user = await userModel.findOne({ email });
                if (!user) {
                    req.flash('error', "User not found for given email");
                    return done(null, false, { message: "User not found for given email" });
                }
                const isPasswordCorrect = await user.isValidatedPassword(password);
                if (!isPasswordCorrect) {
                    req.flash('error', "Incorrect password!");
                    return done(null, false, { message: "Incorrect password!" });
                }

                // Password is correct
                return done(null, user);
            } catch (err) {
                req.flash("error", err);
                return done(err);
            }
        }
    )
);

// Serializing user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserializing user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Check if user authenticated (middleware)
passport.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    //if the user is not signed in
    return res.redirect('/');
};

passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;