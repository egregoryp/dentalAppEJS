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

import mongoose from 'mongoose';
const Schema = mongoose.Schema; // Schema alias

// create a model class
const SurveySchema = new Schema
({
    Name: String,
    Owner: String,
    OwnerUserName: String,
    // Survey_ID: Number, //using default object id created by mongodb
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
  collection: "survey"
});

//function to generate id Object
// export function setId(){    
//   let id = new mongoose.Types.ObjectId();
//   return id;
// }

const Model = mongoose.model('Survey', SurveySchema);
export default Model;
