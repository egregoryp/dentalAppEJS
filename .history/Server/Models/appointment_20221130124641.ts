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

import mongoose from 'mongoose';
const Schema = mongoose.Schema; // Schema alias

// create a model class
const AppointmentSchema = new Schema
({
    Name: String,
    Owner: String,
    OwnerUserName: String,
    // Dentist_ID: Number, //using default object id created by mongodb
    isActive: Boolean,
    type: String,         //--TF (True / False) --R (Range) --T (Text)
    Start_Date: 
    {
      type: Date,
      default: Date.now()
  },
  End_Date: Date
  //,question: Array      //moved to question model
},
{
  collection: "appointment"
});

const Model = mongoose.model('Appointment', AppointmentSchema);
export default Model;
