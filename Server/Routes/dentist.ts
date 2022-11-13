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

// modules required for routing
import express from 'express';

import { AuthGuard, AuthGuardEditDelete } from '../Util';

const router = express.Router();
export default router;

import { DisplaySurveyList, DisplayAddSurveyList, ProcessAddSurveyPage, DisplayEditSurveyPage, ProcessEditSurveyPage, ProcessDeleteSurveyPage } from "../Controllers/survey-list";

/* GET books List page. READ */
router.get('/', DisplaySurveyList);
router.get('/home', DisplaySurveyList);

//  GET the Survey Details page in order to add a new survey
router.get('/add', AuthGuard, DisplayAddSurveyList);

// POST process the Book Details page and create a new survey - CREATE
router.post('/add', AuthGuard, ProcessAddSurveyPage);

// GET the Book Details page in order to edit an existing Book
router.get('/:id', AuthGuardEditDelete, DisplayEditSurveyPage);

// POST - process the information passed from the details form and update the document
router.post('/:id', AuthGuardEditDelete, ProcessEditSurveyPage);

// GET - process the delete by user id
router.get('/delete/:id', AuthGuardEditDelete, ProcessDeleteSurveyPage);

//module.exports = router;
