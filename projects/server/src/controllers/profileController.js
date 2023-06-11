const db = require("../models");
const users = db.User;

module.exports = {
    getProfile: async (req, res) => {
        try {
            const profileData = await users.findOne({where: {id: req.params.id}});
            if (!profileData) {
                return res.status(400).send({code: 400, message: `Invalid id user : ${req.params.id}`})}
            res.status(200).send({code: 200, message: "Get profile data success", data: profileData});

        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Get profile data failed"})}
    },

    editProfile: async (req, res) => {
        try {
            let {name, gender, email, birthdate, prevEmail} = req.body;
            if (!email){
                return res.status(404).send({isError: true, message: "Please fill the required field (email)"});
            }
            let findEmail = await users.findOne({ where: { email: email } });
            if (findEmail && prevEmail!=email){
                return res.status(404).send({ isError: true, message: "Email already exists" });
            }

            await users.update({name, gender, email, birthdate}, {where: {id: req.params.id}});
            res.status(200).send({isError: false, message: "Profile updated", data: req.body});
          
        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Edit profile failed"})}
    },
}