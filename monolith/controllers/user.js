const Datastore = require("nedb")
const db = new Datastore({ filename: __dirname + "/../.db/user", autoload: true })

class User {
    /** 
     *  @url=/user/auth
     *  @method=POST
     */
    static auth(req, res) {
        res.end()
    }

    /** 
     *  @url=/user
     *  @method=POST
     */
    static register(req, res) {
        // Securise les données
        db.findOne({
            login: req.body.login,
            password: req.body.password
        }, (err, doc) => {
            if (!doc) {
                db.insert(req.body, (err) => {
                    res.redirect(err ? "/register" : "/login")
                })
                return
            }

            res.redirect("/login")
        })

    }
    /** 
 *  @url=/user/login
 *  @method=POST
 */
    static login(req, res) {
        const { login, password } = req.body;
    
        db.findOne({ login, password }, (err, user) => {
            if (err) {
                res.status(500).send("Une erreur s'est produite lors de la recherche de l'utilisateur.");
                console.log(err);
                return;
            }
    
            if (!user) {
                req.session.error = "Ce compte n'existe pas";
                console.log(req.session.error);
                res.redirect("/login");
                return;
            }
    
            req.session.user = user;
            res.redirect("/");

        });
    }
    


}

module.exports = User