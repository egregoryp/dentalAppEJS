// <!--COMP231 Web Application Development - Mantis Developers Team
// --Principal Developers's : 
// ---Name: Ricardo Lopez Tuiran           ---Student ID: 301167302 
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

import { UserDisplayName, TypeOfUser, UserID } from "../Util";

import appointment from "../Models/appointment";
import User from "../Models/user";
import patient from "../Models/patient";
import dentist from "../Models/dentist";

import sgMail from "@sendgrid/mail";

export function DisplayHomePage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {

  //console.log(req.user);
  res.render("content/index", {
    title: "Home",
    page: "home",
    displayName: UserDisplayName(req),
    userType: TypeOfUser(req),
    userID: UserID(req),
    surveys: "",
  });
}

export function DisplayAboutPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.render("content/about", {
    title: "About Us",
    page: "about",
    displayName: UserDisplayName(req),
    userType: TypeOfUser(req),
    userID: UserID(req),
    surveys: "",
  });
}

export function DisplayCalendarPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {

  let id = UserID(req);
  
  User.findOne({_id: id }, function (err:any, docs:any) {
    if (err){
    console.log(err)
    }
      if (docs.typeOfUser =='D') {

        dentist.findOne({user_id: docs.id }, function (err:any, dent:any)
         {

          dentist.countDocuments( {user_id: docs.id }, function (err:any, count:any) 
          {
            if (count<=0)
            {
              res.redirect("/edituser");
            }
            //appointment.find({Dentist_ID: dent.id }, { Subject: 1, Appointment_Date: 1, _id: 0}, function(err: any, appointments: any){
            appointment.aggregate([  
              {
                "$project":   {     
                  _id : 0 ,             
                  "title": {
                    "$toString": "$Subject"
                  },
                  "start": {
                    "$dateToString": { format: "%Y-%m-%d", date: "$Appointment_Date" }                     
                  }                  
                }
              }
              ]).exec((err, appointments) => {
              if (err) {
                return console.error(err);
              } else {
                let apCalendarArr = [];                
                  
                console.log(appointments);

                // appointments.forEach(function(value: any){
                //   console.log(value);     
                //   apCalendarArr.push(value);
                // })

                res.render("content/calendar", {
                  title: "Calendar",
                  page: "calendar",
                  displayName: UserDisplayName(req),
                  userType: TypeOfUser(req),
                  userID: UserID(req),
                  appointmentList: appointments
                });
              
            }
          })
        })
            
        });
      } else if (docs.typeOfUser =='P') {

        patient.findOne( {user_id: docs.id }, function (err:any, pat:any)
        {
          patient.countDocuments( {user_id: docs.id }, function (err:any, count:any) 
          {
            if (count<=0)
            {
              res.redirect("/edituser");
            }
            else{
              appointment.find({Patient_ID: pat.id}, { Subject: 1, Appointment_Date: 1, _id: 0}, function(err: any, appointments: any){
                console.log(appointments);
                if (err) {
                  return console.error(err);
                } else {
                  res.render("content/calendar", {
                    title: "Calendar",
                    page: "calendar",
                    displayName: UserDisplayName(req),
                    userType: TypeOfUser(req),
                    userID: UserID(req),
                    appointmentList: appointments
                  });
                
                }            
              }).sort( { Appointment_Date: -1 } );
            }
          })

        })
      }
  });
}

// export function DisplayCalendarPage(
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) {
//   res.render("content/calendar", {
//     title: "Calendar",
//     page: "calendar",
//     displayName: UserDisplayName(req),
//     userType: TypeOfUser(req),
//     userID: UserID(req),
//     surveys: "",
//   });
// }

export function DisplayServicesPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.render("content/services", {
    title: "Services",
    page: "services",
    displayName: UserDisplayName(req),
    userType: TypeOfUser(req),
    userID: UserID(req),
    surveys: "",
  });
}

export function DisplayContactPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.render("content/contact", {
    title: "Contact Us",
    page: "contact",
    displayName: UserDisplayName(req),
    userType: TypeOfUser(req),
    userID: UserID(req),
    surveys: "",
  });
}

export function ProcessContactPage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');

  let query = "?"+req.params.query;
  // console.log(query);
  const params = new URLSearchParams(query)  

  // Convert to native JS object
  const contactMe = Object.fromEntries(params)
  // console.log(contactMe)

  const msg = {
    to: 'epenaeve@my.centennialcollege.ca', 
    from: 'epenaeve@my.centennialcollege.ca',
    subject: "Dental Appointment App Book a'Smile by Mantis Dev - Contact Email: "+contactMe.subject,
    text: contactMe.msg,
    html: "<h1><strong>Dental Appointment App Book a'Smile by Mantis Dev - Contact Email</strong></h1>"+
          "<p>From: "+contactMe.name+"</p>"+
          "<p>Email: "+contactMe.email+"</p>"+
          "<p>Comments: </p>"+ contactMe.msg,
  };    

  sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
  
  // res.redirect('/contact');
}
