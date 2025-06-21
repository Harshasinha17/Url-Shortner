const {v4:uuidv4}= require("uuid");
const User = require("../models/user");
const {setUser} = require("../service/auth");

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
        await User.create({
            name,
            email,
            password,
        });
       return res.status(200).json({ message: "Login successful" });

    } 
async function handleUserlogin(req, res) {
    const {  email, password } = req.body;
       const user= await User.findOne({
            
            email,
            password,
        });
        if(!user){
            return res.render("login",{
                error:"invalid username or password",
            });   }

const token = setUser(user); // This creates a signed JWT
/*res.cookie("uid", token, {
    httpOnly: true,  // Prevent access from JS
    secure: true,    // Use only on HTTPS
    sameSite: "lax"
});*/ 
        res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax"
});

        return res.redirect("/");
    } 
module.exports = {
    handleUserSignup,
    handleUserlogin,
};
