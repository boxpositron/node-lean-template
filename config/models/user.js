// load the things we need
var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var shortid = require('shortid');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    _id: {
        type: String,
        default: shortid.generate,
        unique: true
    },

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// add timestamps
userSchema.plugin(timestamps);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);