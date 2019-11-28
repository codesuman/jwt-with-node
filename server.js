require("dotenv").config();

const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

const PORT = 3000;
const posts = [{
    name: 'James Clear',
    title: '1% change everyday'
}, {
    name: 'Paulo Coelho',
    title: 'The Alchemist'
}];

app.use(express.json());

app.get("/posts", authenticateToken, (req, res) => {
    console.log(`req.body.username :  ${req.body.username}`);

    res.status(200).json({
        success: true,
        data: posts.filter(post => post.name === req.body.username)
    })
});

app.post("/login", (req, res) => {
    console.log(`req.body : `, req.body);

    const accessToken = jwt.sign({ name: req.body.username }, process.env.SECRET_TOKEN);

    res.status('200').json({ accessToken });
});

function authenticateToken(req, res, next) {
    console.log(`authenticateToken >>>`);

    const authHeader = req.headers.authorization;
    const jwtToken = authHeader && authHeader.split(' ')[1]; // BEARER ###jwt_token###

    if (!jwtToken) return res.status(401).json({ success: false, message: "Who are you ?" });

    jwt.verify(jwtToken, process.env.SECRET_TOKEN, (err, decodedPayload) => {
        // User is not authenticated - he is not who he claims to be
        if (err) return res.status(403).json({ success: false, message: "Unauthorized user" });

        console.log(`decodedPayload : `, decodedPayload);

        req.body.username = decodedPayload.name;
        next();
    })
}

app.listen(PORT, console.log(`Server is running on port ${PORT}`));