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

import { DisplayAddProfilePage, ProcessAddProfilePage } from "../Controllers/profile";

// GET the Profile Details page in order to edit an existing Profile
router.get('/profile', AuthGuard, DisplayAddProfilePage);

// POST the Profile Details page in order to edit an existing Profile
router.post('/profile', AuthGuard, ProcessAddProfilePage);




// router.post('/:id', AuthGuard, DisplayEditProfilePage);

// GET to download the file
// router.get('/', AuthGuard, DownloadXlsxFile);
