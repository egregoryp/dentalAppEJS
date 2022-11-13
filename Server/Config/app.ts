// <!--COMP231 Web Application Development - Mantis Developers Team
// --Principal Developers's : 
// ---Name: Ricardo Lopez Tuiran           ---Student ID:301167302 
// ---Name: Elias Pena Evertz              ---Student ID: 301166037
// ---Name: Silvana Gjini                  ---Student ID: 301201477
// ---Name: Bhupinder Dabb                 ---Student ID: 301187371

// --Support Team Members (Secondary Developers, UI/UX Designers)    
// ---Name: Ankit Kodan                    ---Student ID: 
// ---Name: Rishabh Dev Dogra              ---Student ID:
// ---Name: Balkaran Singh                 ---Student ID:
// ---Name: Mehwish Mehmood                ---Student ID:
// ---Name: Ala’a Al-khdour                ---Student ID:    

// --Web App name: Book a'Smile
// --Description: The Dental Appointments Management System is a software application that will allow users to register, 
// --edit and manage their personal accounts, book appointments according to the dentist availability, keep track on appointments 
// --and have a history of procedures with dates and specific notes.   
// -->

// modules for node and express
import createError from 'http-errors';
import express, { NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { getFormattedDate } from "../Util";

// import db package
import mongoose from 'mongoose';

// Step 1 for auth - import modules
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import flash from 'connect-flash';

// modules for JWT support
import cors from 'cors';

// Step 2 for auth - define our auth objects
let localStrategy = passportLocal.Strategy; // alias

// Step 3 for auth - import the user model
import User from '../Models/user';

// import the router data
import indexRouter from '../Routes/index'; // top-level routes
import authRouter from '../Routes/auth'; // authentication routes
import response from '../Routes/response'; // routes for response
import dentist from '../Routes/dentist'; // routes for dentist
import statistics from '../Routes/statistics'; // routes for statistics

import url from 'url';

import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../variables.env') });

const app = express();

//create a helper function to use in ejs files
app.locals.getFormatDate = (inputDate:Date, fullDate: Boolean=false) =>{
  return getFormattedDate(inputDate, fullDate);
}

// Complete the DB Configuration
import * as DBConfig from './db';
mongoose.connect((process.env.RemoteURI) ? process.env.RemoteURI : DBConfig.LocalURI);
const db = mongoose.connection; // alias for the mongoose connection

// Listen for Connections or Errors
db.on("open", function()
{
  console.log(`Connected to MongoDB at: ${DBConfig.HostName}`);
});

db.on("error", function()
{
  console.error(`Connection Error`);
});

// view engine setup
app.set('views', path.join(__dirname, '../Views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../Client')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use(cors()); // adds CORS (cross-origin resource sharing) to the config

// Step 4 - for auth - setup express session
app.use(session({
  secret: DBConfig.Secret,
  saveUninitialized: false,
  resave: false
}));

// Step 5 - setup Flash
app.use(flash());

// Step 6 - initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Step 7 - implement the Auth Strategy
passport.use(User.createStrategy());

// Step 8 - setup User serialization and deserialization (encoding and decoding)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use routes
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/dentist', dentist);
app.use('/response', response);
app.use('/statistics', statistics);

// to handel querystring
let queryObject:any;
app.use(function(req, res) 
{
  queryObject = url.parse(req.url, true).query;
  //console.log(queryObject);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.end('Feel free to add query parameters to the end of the url');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
  next(createError(404));
});

// error handler
app.use(function(err: createError.HttpError, req: express.Request, res: express.Response, next: NextFunction) 
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
