const db = require('../models');

// disallow users from viewing or editing maps that don't belong to them.
module.exports = (req, res, next) => {
    db.map.findById(req.params.id).then( (map) => {
        if (req.user.id !== map.userId) {
            req.flash('error','This is not your map. These are your maps');
            res.redirect('/maps');
            next();
        } else {
            next();
        }
    }).catch( (error) => {
        req.flash('error', error.message)
        res.redirect('/maps');
    })
}