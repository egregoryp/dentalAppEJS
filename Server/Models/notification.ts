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
const NotificationSchema = new Schema
({
    Subject: String,
    Body: String,
    Notification_Date: 
    {
        type: Date,
        default: Date.now()
    },
    contact_id: String 
},
{
  collection: "notification"
});

//function to generate id Object
// export function setId(){    
//   let id = new mongoose.Types.ObjectId();
//   return id;
// }

const Model = mongoose.model('Notification', NotificationSchema);
export default Model;
