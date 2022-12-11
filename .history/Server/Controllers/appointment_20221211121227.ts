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

import appointment from "../Models/appointment";
import User from "../Models/user";
import patient from "../Models/patient";
import dentist from "../Models/dentist";

import { UserDisplayName, UserName, getFormattedDate, getEDTDate, convertUTCEDTDate, TypeOfUser, UserID } from "../Util";

export function DisplayDentistAppointments(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {

    let id = UserID(req);
    
    User.findOne({_id: id }, function (err:CallbackError, docs:any) {
      if (err){
      console.log(err)
      }
        if (docs.typeOfUser =='D') {
          

          dentist.findOne({user_id: docs.id }, function (err:CallbackError, dent:any)
           {
            if (dent.id === null)
            {
              res.redirect("/profile");
            }
            appointment.find({Dentist_ID: dent.id }, function(err: CallbackError, appointments: Collection){
              if (err) {
                return console.error(err);
              } else {
              res.render("appointment/dentistAppointment", {
                title: "Appointments",
                page: "appointment",
                displayName: UserDisplayName(req),
                userType: TypeOfUser(req),
                appointmentList: appointments
              })
              
            }  

          })
              
          });
        } else {

          patient.findOne( {user_id: docs.id }, function (err:CallbackError, pat:any)
          {
            console.log(pat.id)
            if (pat.id === null)
            {
              res.redirect("/profile");
            }
            else{
              appointment.find({Patient_ID: pat.id}, function(err: CallbackError, appointments: Collection){
                console.log(appointments);
                if (err) {
                  return console.error(err);
                } else {
                  res.render("appointment/userAppointment", {
                    title: "Appointments",
                    page: "userAppointment",
                    displayName: UserDisplayName(req),
                    userType: TypeOfUser(req),
                  appointmentList: appointments
                  })
                
                }            
              });
            }
           
          })

        
        }
    });
  }


  export function DisplayBookAppointment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    appointment.find({ isActive: true }).lean().exec((err, dentists) => {
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
  
        res.render("appointment/bookAppointments", {
          title: "appointments",
          page: "appointments",
          displayName: UserDisplayName(req),
          typeUser: TypeOfUser(req),
          user: UserName(req),
          userID: UserID(req),
          dentist: dentists,
        });               
        
      }
    });
  }

  export function ProcessBookAppointment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {

    let dentist_id = req.params.id;

    let u_id = UserID(req);

    //res.send({
    //  'id': dentist_id
  //  });    
    
  patient.findOne({user_id: u_id }, function (err:CallbackError, pat:any) {
    if (err){
    console.log(err)
    }

    if (pat.id === null)
    {
      res.redirect("/profile");
    }

    dentist.findOne({_id: dentist_id }, function (err:CallbackError, dent:any)
    {
      if (err){
        console.log(err)
        }

    let d_u_id =dent.user_id;
    User.findOne( {_id: d_u_id }, function (err:CallbackError, dentuser:any)
      {

        let appointment_date = new Date(req.body.appointmentDate);   
        let edtappointmentDate  = convertUTCEDTDate(appointment_date);
  
        let newAppointment = new appointment({
          Subject: req.body.subject,
          Dentist_ID: dentist_id, 
          Dentist_name: dentuser.username,
          Patient_ID: pat.id,
          Patient_Name: UserDisplayName(req),
          type: '',       
          Appointment_Date: edtappointmentDate,
          Description: req.body.description,
        });
       
        //console.log(newAppointment); 
  
        appointment.create(newAppointment, function (err: CallbackError) {
          if (err) {
            console.error(err);
            res.end(err);
          }
        });
        res.redirect("/appointment");
        
      });

    })         

  }) 
}

export function ProcessDeletePage(req: express.Request, res: express.Response, next: express.NextFunction): void 
{
  let id = req.params.id;

  console.log(id);

  // pass the id to the database and delete the client
  appointment.remove({_id: id}, function(err: CallbackError)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }
 
    // delete was successful
    res.redirect('/appointment');
  });
}


export function DisplayDetailsAppointment(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {

  let id = req.params.id;

  appointment.findById(id, {}, {}, function(err, appointmentDetais)
  {
    if(err)
    {
      console.error(err);
      res.end(err);
    }

    // show the edit view with the data
    res.render("appointment/appointmentDetails",
    { title: 'appointmentdetails', 
    page: 'details', 
    appointment: appointmentDetais, 
    displayName:  UserDisplayName(req)
   })
      
  });

}
  
export function ProcessDetailsAppointment(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {

  let id = req.params.id;


  appointment.findOne( {_id: id }, function (err:CallbackError, app:any)
    {
      let appointment_date = new Date(req.body.appointmentDate);   
      let edtappointmentDate  = convertUTCEDTDate(appointment_date);

      let newAppointment = new appointment({
        "_id": app.id,
        Subject: req.body.subject,
        Dentist_ID: app.Dentist_ID, 
        Dentist_name:app.dentist_name,
        Patient_ID: app.Patient_ID,
        Patient_Name: app.Patient_Name,
        type: '',       
        Appointment_Date: edtappointmentDate,
        Description: req.body.description,
      });
     
      //console.log(newAppointment); 

      appointment.updateOne({_id: id}, newAppointment, function (err: CallbackError) {
        if (err) {
          console.error(err);
          res.end(err);
        }
      });
      res.redirect("/appointment");
      
    });

 
}
