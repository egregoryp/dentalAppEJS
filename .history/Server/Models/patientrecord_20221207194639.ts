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
const PatientRecordSchema = new Schema
({
    patient_id: Object,   
    dentist_id: Object, 
    appointment_id: Object, 
    procedure_id: Object,
    description: String,
    underTreatment: Boolean,
    start_date: 
    {
        type: Date,
        default: Date.now()
    },
    end_date: 
    {
        type: Date,
        default: Date.now()
    }
},
{
  collection: "patientrecord"
});

const Model = mongoose.model('PatientRecord', PatientRecordSchema);
export default Model;
