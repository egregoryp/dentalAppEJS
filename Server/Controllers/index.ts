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

import { UserDisplayName, UserName } from "../Util";

import sgMail from "@sendgrid/mail";

export function DisplayHomePage(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.render("content/index", {
    title: "Home",
    page: "home",
    displayName: UserDisplayName(req),
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
    subject: "Mega Survey by Mantis Dev - Contact Email: "+contactMe.subject,
    text: contactMe.msg,
    html: "<h1><strong>Mega Survey by Mantis Dev - Contact Email</strong></h1>"+
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
