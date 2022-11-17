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

// import the DisplayName Utility method
import { UserDisplayName, UserName, UserEmail, getFormattedDate, getEDTDate, convertUTCEDTDate } from "../Util";

import setTZ from 'set-tz';
setTZ('America/Toronto')

export function DisplayAddProfilePage(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // let id = req.params.id;
    let id = '63717c3f0d605d8fc6d50ed4';
  
    User.findById(id, function (err: CallbackError, userCollection: Collection) {
      if (err) {
        console.log(err);
        res.end(err);
      }  
      
      res.render("profile/profile", {
        title: "Complete Profile",
        page: "profile",
        users: userCollection,
        displayName: UserDisplayName(req),
        user: UserName(req)
      });
    });
  }

  export function DisplayAddAppointmentsPage(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    return res.redirect('/profile/appointments');
  }
  
//   export function ProcessEditProfilePage(
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     let id = req.params.id;
  
//     let start_date = new Date(req.body.startDate);   
//     let edtStartDate  = convertUTCEDTDate(start_date);
  
//     let end_date = new Date(req.body.endDate);   
//     let edtEndDate  = convertUTCEDTDate(end_date);
    
//     let edtDateTime = getEDTDate(false);
    
//     // console.log(end_date);
//     // console.log(edtEndDate);
//     // console.log(edtDateTime);
  
//     let itsActive;
  
//     if (edtEndDate < edtDateTime) {
//       itsActive = false;
//     } else {
//       itsActive = Boolean(req.body.activeSurvey);
//     }
  
//     let dentistFound = new dentist({
//       _id: id,
//       Name: req.body.name,
//       Owner: UserDisplayName(req),
//       OwnerUserName: UserName(req),
//       isActive: itsActive,
//       type: req.body.type,
//       Start_Date: edtStartDate, //Start_Date: req.body.startDate,
//       End_Date: edtEndDate      //End_Date: req.body.endDate,
//     });
  
//     dentist.updateOne({ _id: id }, dentistFound, (err: CallbackError) => {
//       if (err) {
//         console.error(err);
//         res.end(err);
//       }
//     });
  
//     let questionFound = [];
//     questionFound.push(req.body.q1);
//     questionFound.push(req.body.q2);
//     questionFound.push(req.body.q3);
//     questionFound.push(req.body.q4);
//     questionFound.push(req.body.q5);
  
//     //converting dentistID to object
//     let qid = new mongoose.Types.ObjectId(id);
  
//     question.findOneAndUpdate(
//       { Survey_ID: qid },
//       { question: questionFound },
//       function (err: CallbackError, docs: any) {
//         if (err) {
//           console.error(err);
//           res.end(err);
//         }
  
//         // if no error will continue and go back to the dentists
//         res.redirect("/dentist");
//       }
//     );
//   }

  export default router;