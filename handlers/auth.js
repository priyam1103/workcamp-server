const User = require("../models/user");

exports.AddUser = async function (req, res) {
    try {
        const user = await User.findOne({ googleId: req.body.profileObj.googleId });
        if (user) {
            console.log(user)
            res.status(200).json({ message: "user already" })
        } else {
            const user_ = new User({
                username: req.body.profileObj.name,
                imageUrl: req.body.profileObj.imageUrl,
                emailId: req.body.profileObj.email,
                googleId: req.body.profileObj.googleId
            })
            user_.save();
            
            res.status(200).json({ message: "hello" })
        }
    } catch (err) {
        console.log(err);
    }
}