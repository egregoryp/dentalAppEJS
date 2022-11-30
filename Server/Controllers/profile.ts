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

import express from "express";
const router = express.Router();

import { CallbackError, Collection } from "mongoose";

// need to include the User model for authentication functions
import User from '../Models/user';

//import other models
import patient from '../Models/patient';
import dentist from '../Models/dentist';

// import the DisplayName Utility method
import { UserDisplayName, UserName, UserID, UserEmail, getFormattedDate, getEDTDate, convertUTCEDTDate } from "../Util";

import setTZ from 'set-tz';
setTZ('America/Toronto')

export function DisplayAddProfilePage(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // let id = req.params.id;
    let id = UserID(req);
  
    User.findOne({_id:id}).lean().exec((err:CallbackError, userCollection:any) => {
    //User.findById(id, function (err: CallbackError, userCollection: Collection) {
      if (err) {
        console.log(err);
        res.end(err);
      }  

      console.log(userCollection.typeOfUser);

      if(userCollection.typeOfUser === 'D'
      || userCollection.typeOfUser === 'A'     //adjust
      ){
        dentist.findOne({user_id:id}).lean().exec((err:CallbackError, profileCollection:any) => {
                   
          console.log(profileCollection);

          res.render("profile/profile", {
              title: "Complete Profile",
              page: "profile",
              users: userCollection,
              profiles: profileCollection,
              typeUserVal: userCollection.typeOfUser,
              displayName: UserDisplayName(req),
              user: UserName(req)
          });
        });
      } 
        else if (userCollection.typeOfUser === 'P')
      {
        dentist.findOne({user_id:id}).lean().exec((err:CallbackError, profileCollection:any) => {
          res.render("profile/profile", {
            title: "Complete Profile",
            page: "profile",
            users: userCollection,
            profiles: profileCollection,
            typeUserVal: userCollection.typeOfUser,
            displayName: UserDisplayName(req),
            user: UserName(req)
          });      
        });
      }
    });  
  }

  export function ProcessAddProfilePage(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {

    let id = req.params.id;

    let birthdateVar = new Date(req.body.birthDate);   
    let edtbirthdate  = convertUTCEDTDate(birthdateVar);

    let typeOfUserVal = req.body.TypeOfUser
    
    // let itsActive;
  
    // if (edtEndDate < edtDateTime) {
    //   itsActive = false;
    // } else {
    //   itsActive = true;
    // }
    
    //update user info
    User.findOneAndUpdate({_id: id }, {typeOfUser: typeOfUserVal, DisplayName: req.body.name, EmailAddress: req.body.EmailAddress} , 
                          function (err:CallbackError, docs:any) {
      if (err){
          console.log(err)
      }

    });

    //Create profile according type of user
    let userProfile;
    if (typeOfUserVal==="D"){
      
      userProfile = new dentist({
        user_id: id,
        dateOfBirth: edtbirthdate,         
        sex: req.body.Sex,         
        address: req.body.address,         
        city: req.body.city,         
        province_state: req.body.province,         
        postalcode: req.body.postalCode,         
        country: req.body.country,         
        phoneNumber: req.body.phoneNumber,         
        comments: req.body.comments,         
        specialty: req.body.specialConsiderations   
      });

      dentist.create(userProfile, function (err: CallbackError) {
      if (err) {
        console.error(err);
        res.end(err);
      }      

      res.redirect("/dentist");
      });

    } else if (typeOfUserVal==="P"){
      userProfile = new patient({
        user_id: id,     
        dateOfBirth: edtbirthdate,
        sex: req.body.Sex,         
        address: req.body.address,         
        city: req.body.city,         
        province_state: req.body.province,         
        postalcode: req.body.postalCode,         
        country: req.body.country,         
        phoneNumber: req.body.phoneNumber,         
        comments: req.body.comments,         
        specialConsiderations: req.body.specialConsiderations         
      });

      patient.create(userProfile, function (err: CallbackError) {
        if (err) {
          console.error(err);
          res.end(err);
        }
  
        res.redirect("/dentist"); //should be redirected to appointments
        });
    }    
  }

  export default router;