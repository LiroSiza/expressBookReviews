const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { isValid } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Middleware to check if the user is authenticated for customer routes
app.use("/customer/auth/*", function auth(req,res,next){
    // Check if the user is authenticated
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).send("Unauthorized access")
    }
    // Verify the token
    jwt.verify(token, "access", (err, decoded) => {
        if(err){
            return res.status(403).send("Forbidden access")
        }
        // If the token is valid, save the decoded user information in the request object
        req.user = decoded;
        next();
    })
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
