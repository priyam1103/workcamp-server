const User = require("../models/user");

exports.getUsers = async function (req, res) {
    try {
        const users = await User.find();
        console.log(users)
        res.status(200).json({ users });
    } catch (err) {
        res.status(400).json({ message: "error occured" });
        
    }
}