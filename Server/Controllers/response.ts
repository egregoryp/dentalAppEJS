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

import mongoose from 'mongoose'; //to convert string to obectId

import { CallbackError, Collection } from "mongoose";

import survey from "../Models/surveys";

import question from "../Models/question";

import response from "../Models/response";

import { UserDisplayName } from "../Util";

export function DisplayResponseSurveyPage(
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

      question.find({Survey_ID: qId}, function (err: CallbackError, questions: Collection) {
        if (err) {
          console.log(err);
          res.end(err);
        }            
      
        //console.log(surveys);
        //console.log(questions);

        res.render("response/response", {
          title: "Answer Survey",
          page: "response",
          surveys: surveys,
          displayName: UserDisplayName(req),
          questions:questions
        
      });
    
    
    });        
  });
  
}

export function ProcessResponseSurveyPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let id = req.params.id;  
  
  
  survey.findOne({_id:id}).lean().exec((err, doc) => {
    if (err) {
      console.log(err);
      res.end(err);
    }   

    let responseArr;

    // console.log(req.body.a1TF);

    if (doc!.type == "T"){
      responseArr = [req.body.a1, req.body.a2, req.body.a3, req.body.a4, req.body.a5 ];
    } else if (doc!.type == "TF"){
      let longResponse = [];
      if (req.body.a1TF =="T"){
        longResponse[0]="True";
      }else 
      {
        longResponse[0]="False";

      }
      if (req.body.a2TF =="T"){
        longResponse[1]="True";
      }else 
      {
        longResponse[1]="False";

      }
      if (req.body.a3TF =="T"){
        longResponse[2]="True";
      }else 
      {
        longResponse[2]="False";

      }
      if (req.body.a4TF =="T"){
        longResponse[3]="True";
      }else 
      {
        longResponse[3]="False";

      }
      if (req.body.a5TF =="T"){
        longResponse[4]="True";
      }else 
      {
        longResponse[4]="False";

      }

      responseArr = [longResponse[0], longResponse[1], longResponse[2], longResponse[3], longResponse[4]];
    } else if (doc!.type == "R"){
      let longResponse = [];

      if(req.body.a1R=="VU")
      {
        longResponse[0]="Very Unsatisfied";
      }
      else if(req.body.a1R=="U")
      {
        longResponse[0]="Unsatisfied";
      }      
      else if(req.body.a1R=="S")
      {
        longResponse[0]="Satisfied";
      }
      else if(req.body.a1R=="VS")
      {
        longResponse[0]="Very Satisfied";
      }
      else 
      // (req.body.a1R=="NA")
      {
        longResponse[0]="Not Applicable";
      }

      ///////

      if(req.body.a2R=="VU")
      {
        longResponse[1]="Very Unsatisfied";
      }
      else if(req.body.a2R=="U")
      {
        longResponse[1]="Unsatisfied";
      }      
      else if(req.body.a2R=="S")
      {
        longResponse[1]="Satisfied";
      }
      else if(req.body.a2R=="VS")
      {
        longResponse[1]="Very Satisfied";
      }
      else 
      // (req.body.a2R=="NA")
      {
        longResponse[1]="Not Applicable";
      }

      ///////

      if(req.body.a3R=="VU")
      {
        longResponse[2]="Very Unsatisfied";
      }
      else if(req.body.a3R=="U")
      {
        longResponse[2]="Unsatisfied";
      }      
      else if(req.body.a3R=="S")
      {
        longResponse[2]="Satisfied";
      }
      else if(req.body.a3R=="VS")
      {
        longResponse[2]="Very Satisfied";
      }
      else
      // (req.body.a3R=="NA")
      {
        longResponse[2]="Not Applicable";
      }

      ///////

      if(req.body.a4R=="VU")
      {
        longResponse[3]="Very Unsatisfied";
      }
      else if(req.body.a4R=="U")
      {
        longResponse[3]="Unsatisfied";
      }      
      else if(req.body.a4R=="S")
      {
        longResponse[3]="Satisfied";
      }
      else if(req.body.a4R=="VS")
      {
        longResponse[3]="Very Satisfied";
      }
      else
      // (req.body.a4R=="NA")
      {
        longResponse[3]="Not Applicable";
      }

      ///////

      if(req.body.a5R=="VU")
      {
        longResponse[4]="Very Unsatisfied";
      }
      else if(req.body.a5R=="U")
      {
        longResponse[4]="Unsatisfied";
      }      
      else if(req.body.a5R=="S")
      {
        longResponse[4]="Satisfied";
      }
      else if(req.body.a5R=="VS")
      {
        longResponse[4]="Very Satisfied";
      }
      else
      // (req.body.a5R=="NA")
      {
        longResponse[4]="Not Applicable";
      }
      
      responseArr = [longResponse[0], longResponse[1], longResponse[2], longResponse[3], longResponse[4]];
    }

    let responseFound = new response({
      Survey_ID: id,
      response: responseArr
    });
    
    response.create(responseFound, function (err: CallbackError) {
      if (err) {
        console.error(err);
        res.end(err);
      }

      // if no error will continue and go back to the surveys
      res.redirect("/surveys");
    });
  });
}

// export function ProcessDeleteSurveyPage(
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) {
//   let id = req.params.id;
//   survey.remove({ _id: id }, function (err: CallbackError) {
//     if (err) {
//       console.error(err);
//       res.end(err);
//     }

//     // if no error will continue and go back to the surveys
//     res.redirect("/surveys");
//   });
// }

export default router;
