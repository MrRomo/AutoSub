module.exports = {
    isLoggedIn(req, res, next) {
        if (req.user) {
            console.log("isLoggedIn");
            next();
        } else {
            console.log("not logged");
            req.session.oauth2return = req.originalUrl;
            return res.redirect('/');
        }
    },
    isNotLoggedIn(req, res, next) {
        if (req.user) {
            console.log("isLoggedIn");
            req.session.oauth2return = req.originalUrl;
            return res.redirect(`/rooms`);
        }
        console.log("not logged");
        next();
    },
    async isAdmin(req, res, next) {
        if (req.user.admin) {
            return next()
        } else {
            return res.redirect('/home')
        }
    },
}