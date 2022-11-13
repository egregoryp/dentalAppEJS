// <!--COMP229 Web Application Development - Mantis Developers Team
//   --Developers's : 
//   ---Name: Ricardo Lopez Tuiran           ---Student ID:301167302 
//   ---Name: Elias Pena Evertz              ---Student ID: 301166037
//   ---Name: Silvana Gjini                  ---Student ID: 301201477
//   ---Name: Paul Kamau                     ---Student ID: 301198424
//   ---Name: Johan Lema Farinango           ---Student ID: 301216096
//   ---Name: Bhupinder Dabb                 ---Student ID: 301187371
//   --Web App name: Mega-Survey
//   --Description: Users will be able to create surveys, answer the surveys, and owners will be able to edit and/or delete their surveys

import express from 'express';
import survey from "../Models/surveys";

import { CallbackError, Collection } from 'mongoose';

import setTZ from 'set-tz';
setTZ('America/Toronto');

// convenience function to return the DisplayName of the User
export function UserDisplayName(req: express.Request): string
{
    if(req.user)
    {
        let user = req.user as UserDocument
        return user.DisplayName.toString();
    }
    return '';
}

// convenience function to return the user Name
export function UserName(req: express.Request): string
{
    if(req.user)
    {
        let user = req.user as UserDocument
        return user.username.toString();
    }
    return '';
}

// convenience function to return the all User Info
export function UserEmail(req: express.Request): string
{
    if(req.user)
    {
        let user = req.user as UserDocument
        return user.EmailAddress.toString();
    }
    return '';
}

// helper middleware function for guarding secure locations
export function AuthGuard(req: express.Request, res: express.Response, next: express.NextFunction): void
{
    let user = req.user as UserDocument;
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    } 
    next();
}

// helper middleware function for guarding secure locations
export function AuthGuardEditDelete(req: express.Request, res: express.Response, next: express.NextFunction): void
{
    let user = req.user as UserDocument;
    let id = req.params.id;      

    survey.findOne({_id:id}).lean().exec((err, doc) => {
        if (err) {
            console.log(err);
            res.end(err);
          }    
        
          //console.log(doc.OwnerUserName);    

        if(!req.isAuthenticated())
        {
            return res.redirect('/login');
        } else if (user.username.toString() != doc!.OwnerUserName) {
            return res.redirect('/surveys');
        }
        next();
    });    
}

export function getFormattedDate(inputDate: Date, fullDate: Boolean=false): string {    

  // console.log(fullDate);

  const dateFromServer = new Date(inputDate);

  const localOffset = new Date().getTimezoneOffset(); // in minutes
  const localOffsetMillis = 60 * 1000 * localOffset;

  const inputDateF = new Date(dateFromServer.getTime() + localOffsetMillis);

  let hoursAMPM;
  let vAMPM;
  let date_return;
    
  if (inputDateF.getHours() > 12){
    hoursAMPM = inputDateF.getHours() - 12;
    vAMPM = "PM";
  } else {
    hoursAMPM = inputDateF.getHours();
    vAMPM = "AM";
  }  

  if (fullDate){
    date_return =
    ("0" + (inputDateF.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + inputDateF.getDate()).slice(-2) +
    "-" +
    inputDateF.getFullYear() +
    " " +
    ("0" + hoursAMPM).slice(-2) +
    ":" +
    ("0" + inputDateF.getMinutes()).slice(-2) +
    ":" +
    ("0" + inputDateF.getSeconds()).slice(-2)+" "+vAMPM;
  } else {
    date_return =
    ("0" + (inputDateF.getMonth() + 1)).slice(-2) + "-" +
    ("0" + inputDateF.getDate()).slice(-2) + "-" +
    inputDateF.getFullYear();
  }

  return date_return;
}

export function getEDTDate(lastHour:boolean):any 
{
  const dateFromServer = new Date(); 
  
  const localOffset = new Date().getTimezoneOffset(); // in minutes
  const localOffsetMillis = 60 * 1000 * localOffset;
  
  const edtDate = new Date(dateFromServer.getTime() - localOffsetMillis);     
    
  if (lastHour){
    edtDate.setHours(0);
    edtDate.setHours(19);
    edtDate.setMinutes(59);
    edtDate.setSeconds(59); 
  }
  return edtDate;
}

export function convertUTCEDTDate(utcDate:Date):any 
{
  const dateFromServer = utcDate; 
  
  const localOffset = new Date().getTimezoneOffset(); // in minutes
  const localOffsetMillis = 60 * 1000 * localOffset;
  
  const edtDate = new Date(dateFromServer.getTime() - localOffsetMillis);         
  
  return edtDate;
}