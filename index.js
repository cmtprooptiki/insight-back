import express from "express";
import cors from "cors";
import session from "express-session";
import dbuser from "./config/Database.js";
import db from "./config/db.js";

import dotenv from "dotenv";
import  SequelizeStore  from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";

import Queries from "./routes/QueriesRoute.js"

import AuthRoute from "./routes/AuthRoute.js";
import bodyParser from "body-parser";

import Users from "./models/UserModel.js";


console.log("hey")
dotenv.config();

const app = express();
app.use(bodyParser.json());

const sessionStore=SequelizeStore(session.Store);

const store = new sessionStore({
    db:dbuser
});
app.use('/uploads', express.static('uploads'));

(async()=>{
    await dbuser.sync();
 
    await Users.sequelize.sync();

   
    
})();




app.use(session({
    secret:process.env.SESS_SECRET,
    resave:false,
    saveUninitialized:"true",
    store:store,
    cookie:{
        secure:false,
        httpOnly:true,
        sameSite:"lax"
    }
}))

app.use(cors({
    credentials:true,
    origin:'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
    preflightContinue: false,  // Set to false to handle OPTIONS in route
    optionsSuccessStatus: 204,  // 204 status code for successful OPTIONS request
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE','PATCH'],
}));



app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);

app.use(Queries);


store.sync();

app.listen(process.env.APP_PORT,()=>{
    console.log('Server up and runningg....');
});