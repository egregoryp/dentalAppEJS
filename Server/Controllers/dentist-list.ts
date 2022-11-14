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

import dentist from "../Models/appointment";

import question from "../Models/question";

import response from "../Models/response";

import { UserDisplayName, UserName, getFormattedDate, getEDTDate, convertUTCEDTDate } from "../Util";

import setTZ from 'set-tz';
setTZ('America/Toronto')

export function DisplayDentistList(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // find all dentist in the dentist collection

  let OwnerUsrName = UserName(req);
  
  if (OwnerUsrName) {
    // dentist.find({ OwnerUserName: OwnerUsrName },function (err: CallbackError, dentist: Collection) {
      dentist.find({OwnerUserName: OwnerUsrName}).lean().exec((err, dentists) => {
        if (err) {
          return console.error(err);
        } else {
          
          // converting dates to EDT timezone
          // for (let i=0; i < dentist.length; i++){                       
          //   console.log(dentist[i].Start_Date);
          //   console.log(dentist[i].Start_Date.toISOString());            

          //   console.log(dentist[i].End_Date);            
          //   console.log(dentist[i].End_Date.toISOString());            
          // }     

          res.render("dentist/index", {
            title: "dentist",
            page: "dentist",
            displayName: UserDisplayName(req),
            user: UserName(req),
            surveys: dentists,
          });               
          
        }
      });
  } else {    
    // dentist.find({ isActive: true },function (err: CallbackError, dentists: Collection) {
      dentist.find({ isActive: true }).lean().exec((err, dentists) => {
        if (err) {
          return console.error(err);
        } else {

          // converting dates to EDT timezone
          // for (let i=0; i < dentists.length; i++){            
          //   console.log(dentists[i].Start_Date);
          //   console.log(dentists[i].Start_Date.toISOString());            

          //   console.log(dentists[i].End_Date);            
          //   console.log(dentists[i].End_Date.toISOString());            
          // }     

          res.render("dentist/index", {
            title: "dentist",
            page: "dentist",
            displayName: UserDisplayName(req),
            user: UserName(req),   
            surveys: dentists,
          });
        }
      });
  }
}

export function DisplayAddDentistList(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let questionArr: String[] = new Array();

  res.render("dentist/details", {
    title: "Add dentist",
    page: "details",
    surveys: "",
    displayName: UserDisplayName(req),
    questions: questionArr,
  });

  console.log(questionArr);
}

export function ProcessAddDentistPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let start_date = new Date(req.body.startDate);   
  let edtStartDate  = convertUTCEDTDate(start_date);

  let end_date = new Date(req.body.endDate);   
  let edtEndDate  = convertUTCEDTDate(end_date);

  let edtDateTime = getEDTDate(false);

  let itsActive;

  if (edtEndDate < edtDateTime) {
    itsActive = false;
  } else {
    itsActive = true;
  }

  let newDentist = new dentist({
    Name: req.body.name,
    Owner: UserDisplayName(req),
    OwnerUserName: UserName(req),
    isActive: itsActive,
    type: req.body.type,
    Start_Date: edtStartDate, //Start_Date: req.body.startDate,
    End_Date: edtEndDate      //End_Date: req.body.endDate,
  });

  dentist.create(newDentist, function (err: CallbackError) {
    if (err) {
      console.error(err);
      res.end(err);
    }

    let newQuestion = new question({
      Survey_ID: newDentist._id,
      question: [
        req.body.q1,
        req.body.q2,
        req.body.q3,
        req.body.q4,
        req.body.q5,
      ],
    });

    question.create(newQuestion, function (err: CallbackError) {
      if (err) {
        console.error(err);
        res.end(err);
      }
    });

    // if no error will continue and go back to dentist
    res.redirect("/dentist");
  });
}

export function DisplayEditDentistPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let id = req.params.id;

  dentist.findById(id, function (err: CallbackError, dentists: Collection) {
    if (err) {
      console.log(err);
      res.end(err);
    }

    let qId = new mongoose.Types.ObjectId(id);

    question.find(
      { Survey_ID: qId },
      function (err: CallbackError, questions: Collection) {
        if (err) {
          console.log(err);
          res.end(err);
        }

        //console.log(dentists);
        //console.log(questions);

        res.render("dentist/details", {
          title: "Edit dentist",
          page: "details",
          surveys: dentists,
          displayName: UserDisplayName(req),
          user: UserName(req),
          questions: questions,
        });
      }
    );
  });
}

export function ProcessEditDentistPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let id = req.params.id;

  let start_date = new Date(req.body.startDate);   
  let edtStartDate  = convertUTCEDTDate(start_date);

  let end_date = new Date(req.body.endDate);   
  let edtEndDate  = convertUTCEDTDate(end_date);
  
  let edtDateTime = getEDTDate(false);
  
  // console.log(end_date);
  // console.log(edtEndDate);
  // console.log(edtDateTime);

  let itsActive;

  if (edtEndDate < edtDateTime) {
    itsActive = false;
  } else {
    itsActive = Boolean(req.body.activeSurvey);
  }

  let dentistFound = new dentist({
    _id: id,
    Name: req.body.name,
    Owner: UserDisplayName(req),
    OwnerUserName: UserName(req),
    isActive: itsActive,
    type: req.body.type,
    Start_Date: edtStartDate, //Start_Date: req.body.startDate,
    End_Date: edtEndDate      //End_Date: req.body.endDate,
  });

  dentist.updateOne({ _id: id }, dentistFound, (err: CallbackError) => {
    if (err) {
      console.error(err);
      res.end(err);
    }
  });

  let questionFound = [];
  questionFound.push(req.body.q1);
  questionFound.push(req.body.q2);
  questionFound.push(req.body.q3);
  questionFound.push(req.body.q4);
  questionFound.push(req.body.q5);

  //converting dentistID to object
  let qid = new mongoose.Types.ObjectId(id);

  question.findOneAndUpdate(
    { Survey_ID: qid },
    { question: questionFound },
    function (err: CallbackError, docs: any) {
      if (err) {
        console.error(err);
        res.end(err);
      }

      // if no error will continue and go back to the dentists
      res.redirect("/dentist");
    }
  );
}

export function ProcessDeleteDentistPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let id = req.params.id;
  dentist.remove({ _id: id }, function (err: CallbackError) {
    if (err) {
      console.error(err);
      res.end(err);
    }
  });

  //converting dentistID to object
  let qid = new mongoose.Types.ObjectId(id);

  question.findOneAndDelete(
    { Survey_ID: qid },
    function (err: CallbackError, docs: any) {
      if (err) {
        console.error(err);
        res.end(err);
      }

      // console.log("Deleted User : ", docs);
    }
  );

  response.deleteMany({ Survey_ID: id }, function (err: CallbackError) {
    if (err) {
      console.error(err);
      res.end(err);
    }

    // if no error will continue and go back to the dentist
    res.redirect("/dentist");
  });
}

export default router;
