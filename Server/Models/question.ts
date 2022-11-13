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
const QuestionSchema = new Schema
({        
    Survey_ID: Object,
    question: Array    
},
{
  collection: "question"
});

const Model = mongoose.model('Question', QuestionSchema);
export default Model;
