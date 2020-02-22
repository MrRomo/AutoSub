var admin = require("firebase-admin");
var env = require('../config')
// Get a database reference to our blog

admin.initializeApp({
    credential: admin.credential.cert(env.serviceAccount),
    databaseURL: env.firebaseURL
});

var db = admin.database();

function set(id,info){
    var ref = db.ref(`rooms/${id}`);
    ref.set(info)
}
function del(id,info){
    var ref = db.ref(`rooms/${id}`);
    ref.remove()
}
function update(id,info){
    var ref = db.ref(`rooms/${id}`);
    ref.update(info)
}

module.exports = {
    set,del,update
}