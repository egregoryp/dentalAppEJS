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

import mongoose from "mongoose";

import { CallbackError, Collection } from "mongoose";

import User from "../Models/user";

import patient from "../Models/patient";

import dentist from "../Models/dentist";

import { UserDisplayName, UserName, TypeOfUser, UserID, getFormattedDate, getEDTDate, convertUTCEDTDate } from "../Util";

import setTZ from 'set-tz';
setTZ('America/Toronto')

export function DisplayDentistList(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // find all dentist in the dentist collection

  let typeOfUser = TypeOfUser(req);  
  let userID = UserID(req);  
  
  if (typeOfUser == 'D') {
    // dentist.find({ OwnerUserName: OwnerUsrName },function (err: CallbackError, dentist: Collection) {
      User.aggregate([  
                      {
                        "$project":   {
                          "_id": {
                            "$toString": "$_id"
                          },
                          "DisplayName": {
                            "$toString": "$DisplayName"
                          },
                          "username": {
                            "$toString": "$username"
                          },
                          "EmailAddress": {
                            "$toString": "$EmailAddress"
                          },
                          "typeOfUser": {
                            "$toString": "$typeOfUser"
                          }
                        }
                      },
                      { "$match" : { "_id" : userID, "typeOfUser" : "D"} }, 
                      { 
                        "$lookup": {
                          "from": "dentist",
                          "localField": "_id",
                          "foreignField": "user_id",
                          "as": "dentist"
                        }
                      }                                              
                      ]).exec((err, dentistAdd) => {

              let dUser;        
              let dentistUser;
              let dentistUserArr = [];

              for (let i = 0; i < dentistAdd.length; i++) {
              dUser = {
              DisplayName: dentistAdd[i].DisplayName,
              username: dentistAdd[i].username,           
              EmailAddress: dentistAdd[i].EmailAddress,
              typeOfUser: dentistAdd[i].typeOfUser                   
              }

              //Creating one object from user - dentist profile
              dentistUser = {
              ...dUser,
              ...dentistAdd[i].dentist[0] 
              }

              //pushing objects into array
              dentistUserArr.push(dentistUser);
              }

              res.render("dentist/dentists", {
              title: "dentists",
              page: "dentists",
              displayName: UserDisplayName(req),
              typeUser: TypeOfUser(req),
              user: UserName(req),   
              userID: UserID(req),              
              typeOfUser: typeOfUser,
              dentists: dentistUserArr,
              surveys: dentistUserArr,
              });
        });
            
  } else if (typeOfUser == 'A') {              
    // dentist.find({ OwnerUserName: OwnerUsrName },function (err: CallbackError, dentist: Collection) {
      User.aggregate([  
                      {
                        "$project":   {
                          "_id": {
                            "$toString": "$_id"
                          },
                          "DisplayName": {
                            "$toString": "$DisplayName"
                          },
                          "username": {
                            "$toString": "$username"
                          },
                          "EmailAddress": {
                            "$toString": "$EmailAddress"
                          },
                          "typeOfUser": {
                            "$toString": "$typeOfUser"
                          }
                        }
                      },
                      { 
                        "$lookup": {
                          "from": "dentist",
                          "localField": "_id",
                          "foreignField": "user_id",
                          "as": "dentist"
                        }
                      },
                      { 
                        "$lookup": {
                          "from": "patient",
                          "localField": "_id",
                          "foreignField": "user_id",
                          "as": "patient"
                        }
                      }                                              
                      ]).exec((err, dentistAdd) => {

              let dUser;        
              let dentistPatientUser;
              let dentistUserArr = [];

              console.log(dentistAdd);

              for (let i = 0; i < dentistAdd.length; i++) {
                dUser = {
                DisplayName: dentistAdd[i].DisplayName,
                username: dentistAdd[i].username,           
                EmailAddress: dentistAdd[i].EmailAddress,
                typeOfUser: dentistAdd[i].typeOfUser     
                }

                //Creating one object from user - dentist profile

                if(dentistAdd[i].dentist[0]){
                  dentistPatientUser = {
                    ...dUser,
                    ...dentistAdd[i].dentist[0] 
                    }
                } else {
                  dentistPatientUser = {
                    ...dUser,
                    ...dentistAdd[i].patient[0] 
                    }
                }

                //pushing objects into array
                dentistUserArr.push(dentistPatientUser);                
              }

              res.render("dentist/dentists", {
                title: "dentists",
                page: "dentists",
                displayName: UserDisplayName(req),
                typeUser: TypeOfUser(req),
                user: UserName(req),   
                userID: UserID(req),
                typeOfUser: typeOfUser,
                dentists: dentistUserArr,
                surveys: dentistUserArr,
              });
        }); 
  } else {        
    // appointment.find({ isActive: true },function (err: CallbackError, dentists: Collection) {
      User.aggregate([  
                        {
                          "$project":   {
                            "_id": {
                              "$toString": "$_id"
                            },
                            "DisplayName": {
                              "$toString": "$DisplayName"
                            },
                            "username": {
                              "$toString": "$username"
                            },
                            "EmailAddress": {
                              "$toString": "$EmailAddress"
                            },
                            "typeOfUser": {
                              "$toString": "$typeOfUser"
                            }
                          }
                        },
                        { "$match" : { "typeOfUser" : "D"} }, 
                        { 
                          "$lookup": {
                            "from": "dentist",
                            "localField": "_id",
                            "foreignField": "user_id",
                            "as": "dentist"
                          }
                        }                                              
                        ]).exec((err, dentistAdd) => {

        let dUser;        
        let dentistUser;
        let dentistUserArr = [];

        for (let i = 0; i < dentistAdd.length; i++) {
          dUser = {
              DisplayName: dentistAdd[i].DisplayName,
              username: dentistAdd[i].username,           
              EmailAddress: dentistAdd[i].EmailAddress,
              typeOfUser: dentistAdd[i].typeOfUser                   
          }

          //Creating one object from user - dentist profile
          dentistUser = {
            ...dUser,
            ...dentistAdd[i].dentist[0] 
          }

          //pushing objects into array
          dentistUserArr.push(dentistUser);
        }

        res.render("dentist/dentists", {
          title: "dentists",
          page: "dentists",
          displayName: UserDisplayName(req),
          typeUser: TypeOfUser(req),
          user: UserName(req),   
          userID: UserID(req),
          typeOfUser: typeOfUser,
          dentists: dentistUserArr,
          surveys: dentistUserArr,
        });
      });
     
  }
}

// export function DisplayAddDentistList(
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) {
//   let questionArr: String[] = new Array();

//   res.render("dentist/details", {
//     title: "Add dentist",
//     page: "details",
//     surveys: "",
//     displayName: UserDisplayName(req),
//     typeUser: TypeOfUser(req),
//     user: UserName(req),   
//     userID: UserID(req),
//     questions: questionArr,
//   });

//   console.log(questionArr);
// }

// export function ProcessAddDentistPage(
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) {
//   let start_date = new Date(req.body.startDate);   
//   let edtStartDate  = convertUTCEDTDate(start_date);

//   let end_date = new Date(req.body.endDate);   
//   let edtEndDate  = convertUTCEDTDate(end_date);

//   let edtDateTime = getEDTDate(false);

//   let itsActive;

//   if (edtEndDate < edtDateTime) {
//     itsActive = false;
//   } else {
//     itsActive = true;
//   }

//   let newDentist = new appointment({
//     Name: req.body.name,
//     Owner: UserDisplayName(req),
//     OwnerUserName: UserName(req),
//     isActive: itsActive,
//     type: req.body.type,
//     Start_Date: edtStartDate, //Start_Date: req.body.startDate,
//     End_Date: edtEndDate      //End_Date: req.body.endDate,
//   });

//   appointment.create(newDentist, function (err: CallbackError) {
//     if (err) {
//       console.error(err);
//       res.end(err);
//     }

//     let newQuestion = new question({
//       Survey_ID: newDentist._id,
//       question: [
//         req.body.q1,
//         req.body.q2,
//         req.body.q3,
//         req.body.q4,
//         req.body.q5,
//       ],
//     });

//     question.create(newQuestion, function (err: CallbackError) {
//       if (err) {
//         console.error(err);
//         res.end(err);
//       }
//     });

//     // if no error will continue and go back to dentist
//     res.redirect("/dentist");
//   });
// }

// export function DisplayEditDentistPage(
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) {
//   let id = req.params.id;

//   dentist.findById(id, function (err: CallbackError, dentists: any) {
//     if (err) {
//       console.log(err);
//       res.end(err);
//     }

//     User.find(
//       { _id: dentists.user_id },
//       function (err: CallbackError, questions: any) {
//         if (err) {
//           console.log(err);
//           res.end(err);
//         }

//         //console.log(dentists);
//         //console.log(questions);

//         res.render("dentist/details", {
//           title: "Edit dentist",
//           page: "details",          
//           displayName: UserDisplayName(req),
//           typeUser: TypeOfUser(req),
//           user: UserName(req),   
//           userID: UserID(req),          
//           dentists: dentists
//         });
//       }
//     );
//   });
// }


export default router;
