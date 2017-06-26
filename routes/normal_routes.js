module.exports = function(router) {

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', {
            title: 'Express'
        });
    });

}