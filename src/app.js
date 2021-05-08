require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerModel = require("../src/models/registers");
require("./db/conn");

const app = express();

const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

//SignIn
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmpassword;
        if (password === confirmPassword) {
            const registerUser = new registerModel({
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                confirmPassword: req.body.confirmpassword,
                age: req.body.age,
                gender: req.body.gender
            })

            console.log(registerUser);

            //password hash
            const token = await registerUser.generateAuthToken();

            console.log(token);

            const result = await registerUser.save();
            res.status(201).send(result);
        } else {
            console.log(`${password} and ${confirmPassword} are not same.`)
            res.end("Not Same");
        }

    } catch (e) {
        res.status(400).send(e);
    }
})


//LogIn

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userEmail = await registerModel.findOne({ email: email });
        console.log(userEmail.password);
        console.log(password);
        // Comapring password with the encoded one.
        const isMatch = await bcrypt.compare(password, userEmail.password);
        console.log(isMatch);



        if (isMatch) {
            // Generating token only if the user enters right credentials.
            const token = await userEmail.generateAuthToken();
            console.log(token);
            // res.write(userEmail);
            res.status(201).send("Login done");
        } else {
            res.status(404).send("Wrong credentials.");
        }
    } catch (e) {
        res.status(400).send(e);
    }
})

app.listen(port, () => {
    console.log(`Running on port no. ${port}`);
})