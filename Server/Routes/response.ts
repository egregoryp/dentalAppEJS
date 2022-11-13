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

// modules required for routing
import express from 'express';

const router = express.Router();
export default router;

import { DisplayResponseSurveyPage , ProcessResponseSurveyPage } from "../Controllers/response";

// GET the Book Details page in order to edit an existing Book
router.get('/:id', DisplayResponseSurveyPage);

// POST - process the information passed from the details form and update the document
router.post('/:id', ProcessResponseSurveyPage);


