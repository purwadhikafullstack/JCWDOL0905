const db = require("../models");
const users = db.User;
const admins = db.Admin;
const branch = db.Store_Branch;
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_SECRET_KEY;

module.exports = {
    getProfile: async (req, res) => {
        try {
            const profileData = await users.findOne({where: {id: req.params.id}});
            if(profileData.birthdate==null){
                profileData.birthdate='';
            }
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
                return res.status(404).send({ isError: true, message: "Email already registered" });
            }

            if(req.file != undefined){
                let imageUrl = req.protocol + "://" + req.get("host") + "/api/media/profiles/" + req.file.filename;
                await users.update({name, gender, email, birthdate, profile_picture: imageUrl}, {where: {id: req.params.id}});
            }else{
                await users.update({name, gender, email, birthdate}, {where: {id: req.params.id}});
            }

            res.status(200).send({isError: false, message: "Profile updated", data: req.body});
          
        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Edit profile failed"})}
    },
    getAdminProfile: async (req, res) => {
        const admin = jwt.verify(req.params.token, jwtKey);

        console.log(admin);
        const resultBranchAdmin = await admins.findOne({ where: {id: admin.id_admin}, attributes: ["id", "admin_name", "email", "role", "id_branch"], include: [ { model: branch, attributes: ["branch_name", "address", "city", "province"], }, ] });

        console.log(resultBranchAdmin, 'resultbranch');
        const {rows} = resultBranchAdmin
        res.status(200).send({isError: false, message: "Get Admin Profile", data: resultBranchAdmin});

    }
}