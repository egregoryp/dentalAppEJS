// <!--COMP229 Web Application Development - Mantis Developers Team
//   --Developers's :
//   ---Name: Ricardo Lopez Tuiran           ---Student ID: 301167302 
//   ---Name: Elias Pena Evertz              ---Student ID: 301166037
//   ---Name: Silvana Gjini                  ---Student ID: 301201477
//   ---Name: Bhupinder Dabb                 ---Student ID: 301187371
//   --Web App name: Mega-Survey
//   --Description: Users will be able to create surveys, answer the surveys, and owners will be able to edit and/or delete their surveys

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
