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

import survey from "../Models/surveys";

import question from "../Models/question";

import response from "../Models/response";

import { UserDisplayName, UserName, getFormattedDate, getEDTDate, convertUTCEDTDate } from "../Util";

import setTZ from 'set-tz';
setTZ('America/Toronto')

export function DisplaySurveyList(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // find all surveys in the surveys collection

  let OwnerUsrName = UserName(req);
  
  if (OwnerUsrName) {
    // survey.find({ OwnerUserName: OwnerUsrName },function (err: CallbackError, surveys: Collection) {
    survey.find({OwnerUserName: OwnerUsrName}).lean().exec((err, surveys) => {
        if (err) {
          return console.error(err);
        } else {
          
          // converting dates to EDT timezone
          // for (let i=0; i < surveys.length; i++){                       
          //   console.log(surveys[i].Start_Date);
          //   console.log(surveys[i].Start_Date.toISOString());            

          //   console.log(surveys[i].End_Date);            
          //   console.log(surveys[i].End_Date.toISOString());            
          // }     

          res.render("dentist/index", {
            title: "dentist",
            page: "dentist",
            displayName: UserDisplayName(req),
            user: UserName(req),
            surveys: surveys,
          });               
          
        }
      });
  } else {    
    // survey.find({ isActive: true },function (err: CallbackError, surveys: Collection) {
    survey.find({ isActive: true }).lean().exec((err, surveys) => {
        if (err) {
          return console.error(err);
        } else {

          // converting dates to EDT timezone
          // for (let i=0; i < surveys.length; i++){            
          //   console.log(surveys[i].Start_Date);
          //   console.log(surveys[i].Start_Date.toISOString());            

          //   console.log(surveys[i].End_Date);            
          //   console.log(surveys[i].End_Date.toISOString());            
          // }     

          res.render("dentist/index", {
            title: "dentist",
            page: "dentist",
            displayName: UserDisplayName(req),
            user: UserName(req),   
            surveys: surveys,
          });
        }
      });
  }
}

export function DisplayAddSurveyList(
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

export function ProcessAddSurveyPage(
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

  let newSurvey = new survey({
    Name: req.body.name,
    Owner: UserDisplayName(req),
    OwnerUserName: UserName(req),
    isActive: itsActive,
    type: req.body.type,
    Start_Date: edtStartDate, //Start_Date: req.body.startDate,
    End_Date: edtEndDate      //End_Date: req.body.endDate,
  });

  survey.create(newSurvey, function (err: CallbackError) {
    if (err) {
      console.error(err);
      res.end(err);
    }

    let newQuestion = new question({
      Survey_ID: newSurvey._id,
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

export function DisplayEditSurveyPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let id = req.params.id;

  survey.findById(id, function (err: CallbackError, surveys: Collection) {
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

        //console.log(surveys);
        //console.log(questions);

        res.render("dentist/details", {
          title: "Edit dentist",
          page: "details",
          surveys: surveys,
          displayName: UserDisplayName(req),
          user: UserName(req),
          questions: questions,
        });
      }
    );
  });
}

export function ProcessEditSurveyPage(
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

  let surveyFound = new survey({
    _id: id,
    Name: req.body.name,
    Owner: UserDisplayName(req),
    OwnerUserName: UserName(req),
    isActive: itsActive,
    type: req.body.type,
    Start_Date: edtStartDate, //Start_Date: req.body.startDate,
    End_Date: edtEndDate      //End_Date: req.body.endDate,
  });

  survey.updateOne({ _id: id }, surveyFound, (err: CallbackError) => {
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

  //converting SurveyID to object
  let qid = new mongoose.Types.ObjectId(id);

  question.findOneAndUpdate(
    { Survey_ID: qid },
    { question: questionFound },
    function (err: CallbackError, docs: any) {
      if (err) {
        console.error(err);
        res.end(err);
      }

      // if no error will continue and go back to the surveys
      res.redirect("/surveys");
    }
  );
}

export function ProcessDeleteSurveyPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let id = req.params.id;
  survey.remove({ _id: id }, function (err: CallbackError) {
    if (err) {
      console.error(err);
      res.end(err);
    }
  });

  //converting SurveyID to object
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

    // if no error will continue and go back to the surveys
    res.redirect("/surveys");
  });
}

export default router;
