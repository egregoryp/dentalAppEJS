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

import appointment from "../Models/appointment";

import { UserDisplayName, UserName, getFormattedDate, getEDTDate, convertUTCEDTDate, TypeOfUser } from "../Util";

export function DisplayDentistAppointments(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    

    res.render("appointment/dentistAppointment", {
      title: "Appointments",
      page: "appointment",
      displayName: UserDisplayName(req),
      userType: TypeOfUser(req)
      
    });


    console.log(TypeOfUser(req));
  }


  export function DisplayUserAppointments(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    

    res.render("appointment/userAppointment", {
      title: "Appointments",
      page: "userAppointment",
      displayName: UserDisplayName(req),
      userType: TypeOfUser(req)
  
    });
    console.log(TypeOfUser(req));
  }
  