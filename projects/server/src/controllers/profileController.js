const db = require("../models");
const users = db.User;
const voucher = db.Voucher;
const user_voucher = db.User_Voucher;
const { Op } = require("sequelize");
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
            if(!birthdate) birthdate = null
            if (!email) return res.status(400).send({isError: true, message: "Please fill the required field (email)"});
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).send({isError: true, message: "Invalid email format"});
            let findEmail = await users.findOne({ where: { email: email } });
            if (findEmail && prevEmail!=email){
                return res.status(404).send({ isError: true, message: "Email already registered" });
            }

            if(req.file != undefined){
                let imageUrl = process.env.API_URL + "/media/profiles/" + req.file.filename;
                if(!birthdate) await users.update({name, gender, email, birthdate: null, profile_picture: imageUrl}, {where: {id: req.params.id}});
                else await users.update({name, gender, email, birthdate, profile_picture: imageUrl}, {where: {id: req.params.id}});
            }else{
                if(birthdate) await users.update({name, gender, email, birthdate: null}, {where: {id: req.params.id}});
                else await users.update({name, gender, email, birthdate}, {where: {id: req.params.id}});
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

    },

    checkReferral: async (req, res) => {
        try{
            let findVoucher = await user_voucher.findOne({include: [{
                model: voucher,
                where: { voucher_type: 'referral code'},
                required: true
               }], where: { id_user: req.params.id_user} });
            res.status(200).send({isError: false, message: "Successfully check user voucher", data: findVoucher});

        } catch(error){
            console.log(error);
            res.status(404).send({isError: true, message: "Check user voucher failed"})
        }
    },

    claimReferralVoucher: async (req, res) => {
        try {          
            let {referral_code} = req.body;
            
            let findReferral = await users.findOne({ where: { referral_code, id: {[Op.not]:req.params.id_user} } });
            if (!findReferral){
                return res.status(404).send({ isError: true, message: "Referral code not match" });
            }

            let findVoucher = await voucher.findOne({ where: { voucher_type: 'referral code' } });
            if (!findVoucher){
                return res.status(404).send({ isError: true, message: "No referral voucher currently available" });
            }

            let result = await user_voucher.create({is_used: 0, id_user: req.params.id_user, id_voucher: findVoucher.dataValues.id});
            res.status(200).send({isError: false, message: "Referral voucher succesfully claimed", data: result});
          
        } catch (error) {
            console.log(error);
            res.status(404).send({isError: true, message: "Failed to claim referral voucher"})}
    },

}