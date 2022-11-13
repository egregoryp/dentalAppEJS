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

import Excel from 'exceljs';
import path from 'path';
import express from "express";

const router = express.Router();

import mongoose from 'mongoose'; //to convert string to objectId

import { CallbackError, Collection } from "mongoose";

import survey from "../Models/surveys";

import question from "../Models/question";

import response from "../Models/response";

import { UserDisplayName } from "../Util";

export function DisplayStatisticsSurveyPage(   req: express.Request,  res: express.Response,  next: express.NextFunction) 
{
  let id = req.params.id;  

  survey.findById(id, function (err: CallbackError, surveys: Collection)     
  {
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
        response.find({Survey_ID: id}, function (err: CallbackError, responses: Collection) {
            if (err) {
              console.log(err);
              res.end(err);
            } 
        
        //console.log(surveys);
        //console.log(questions);
        //console.log(responses);

        res.render("statistics/statistics", {
          title: "Survey Statistics",
          page: "statistics",
          surveys: surveys,
          displayName: UserDisplayName(req),
          questions:questions,
          responses:responses
        
         });

        });
    
    });        
  });
  
}

export function ProcessStatisticsSurveyPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  
     
  let id = req.params.id;  
 
  // survey.findById(id, function (err: CallbackError, surveys: Collection) 
  survey.findById({_id:id}).lean().exec((err, surveys) => 
  {
    if (err) {
      console.log(err);
      res.end(err);
    }    
    
      let qId = new mongoose.Types.ObjectId(id);
 
      // question.find({Survey_ID: qId}, function (err: CallbackError, questions: Collection) {
      question.find({Survey_ID:qId}).lean().exec((err, questions) => {
        if (err) {
          console.log(err);
          res.end(err);
        }            
        // response.find({Survey_ID: id}, function (err: CallbackError, responses: Collection) {
        response.find({Survey_ID:id}).lean().exec((err, responses) => {
            if (err) {
              console.log(err);
              res.end(err);
            }         
       
             const exportSurveyStats = async () => {
             const workbook = new Excel.Workbook();
             let sheetName;
             if (surveys!.Name != null){
              sheetName = surveys!.Name.replace(' ', '');
             }
             const worksheet = workbook.addWorksheet(sheetName);
      
              // console.log(questions);
              worksheet.columns = [
                { key: '0', header: 'Responses / Questions' },
                { key: '1', header: questions[0].question[0].toString() },
                { key: '2', header: questions[0].question[1].toString() },
                { key: '3', header: questions[0].question[2].toString() },
                { key: '4', header: questions[0].question[3].toString() },
                { key: '5', header: questions[0].question[4].toString() },
              ];
      
              // console.log(responses);
              
              let newResponses: any = [];
              let combineArrResponses: any = [];
              
              for (let count = 0; count < responses.length; count++) 
              {
                  newResponses[0] = count + 1;
                  combineArrResponses = newResponses.concat(responses[count].response);      
                  // console.log(combineArrResponses);              

                  //worksheet.addRow(responses[count].response);
                  worksheet.addRow(combineArrResponses);
                
              }

              worksheet.columns.forEach((sheetColumn) => {
                  sheetColumn.font = {
                    size: 12,
                  };
                  sheetColumn.width = 30;
              });
              
              worksheet.getRow(1).font = {
                  bold: true,
                  size: 13,
              };

              //let filename = sheetName + '.xlsx';
              let exportPath = path.resolve('', "file.xlsx"); //filename);        
              workbook.xlsx.writeFile(exportPath);        
            } 
          
          exportSurveyStats();          
          res.redirect('/statistics/'+ id);
        });
    
    });        
  }); 
}


export function DownloadXlsxFile(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {  
    // const file = `${process.cwd()}\\file.xlsx`;  //local
    const file = `${process.cwd()}//file.xlsx`; //for heroku
    console.log(process.cwd());
    setTimeout(function(){res.download(file)},2000); // Set disposition and send it.
}  

export default router;
