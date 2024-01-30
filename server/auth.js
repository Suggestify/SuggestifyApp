import express from 'express'
import bcryptjs from "bcryptjs";
import User from "./models/User.js";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router()
router.post("/SignUp", async (req,res)=>{

    try{
        const secret = process.env.B_SECRET;
        var pwdDB = secret + req.body.password;
        const hashedPWD = await bcryptjs.hash(pwdDB, saltrounds)  // hashed password to pass into database

        const curEmail = req.body.email;
        const curUserName = req.body.userName;

        const data = {email: curEmail, userName: curUserName, password: hashedPWD };  // email, username, password for database
        const currentUser = new User(data);
        await currentUser.save();
        res.sendStatus(200);

    }

    catch(err){
        res.status(400)
        res.json(err);
    }

});


router.post("/SignIn", async (req,res)=>{
    try{
        const userId = req.body.UserId;
        var user;
        if(userId.includes("@")){
            user = await User.findOne({email: userId});

        }else{
            user = await User.findOne({userName: UserId});
        }

        const pwdDB = user.password;  // password from database


        const secret = process.env.B_SECRET;
        const pwdUser = secret + req.body.password;  // password on current input


        bcryptjs.compare(pwdUser, pwdDB, function(err, match){
            if(err){
                console.log(err)
            }
            if(match){
                // const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
                // const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET);
                console.log("match");
                res.sendStatus(200);
            }
            else{
                console.log("no match");
                res.sendStatus(401);
            }
        });
    } catch(err){
        res.status(400);
    }
});

router.get("/", (req,res) =>{
    console.log("test")
})

export default router