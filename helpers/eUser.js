module.exports = {
    eUser: function(req,res,next) {
        if(req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', 'Voce deve estar logado para organizar pedidos');
        res.redirect('/');
    }
}