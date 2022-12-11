import express from 'express';
import { CallbackError } from 'mongoose';

// need passport functionality
import passport from 'passport';

// need to include the User model for authentication functions
import User from '../Models/user';

// import the DisplayName Utility method
import { UserDisplayName, UserName, UserEmail, UserID, TypeOfUser } from '../Util';

// Display Functions
export function DisplayLoginPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    if(!req.user)
    {
        return res.render('content/login', { title: 'Login', page: 'login', messages: req.flash('loginMessage'), displayName: UserDisplayName(req), userID: UserID(req)});
    }
    return res.redirect("/dentist");
    
}

export function DisplayRegisterPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    if(!req.user)
    {
        return res.render('content/register', { title: 'Register', page: 'register', messages: req.flash('registerMessage'), displayName: UserDisplayName(req), userID: UserID(req)});
    } 
    
    if (TypeOfUser(req) === null || TypeOfUser(req) === ""){
        return res.render('/dentist');    
    }
}

export function DisplayEditUserPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    if(req.user)
    {
        //console.log(UserDisplayName(req));
        return res.render('content/edituser', { title: 'Edit User', page: 'edituser', messages: req.flash('registerMessage'), displayName: UserDisplayName(req), userName: UserName(req), userEmail: UserEmail(req), userID: UserID(req), typeOfUser: TypeOfUser(req)});
    } else {
        return res.redirect("/dentist");
    }

}

// Processing Functions
export function ProcessLoginPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
   passport.authenticate('local', function(err, user, info)
   {
    // are there server errors?
    if(err)
    {
        console.error(err);
        res.end(err);
    }

    // are there login errors?
    if(!user)
    {
        req.flash('loginMessage', 'Authentication Error!');
        return res.redirect('/login');
    }
    
    // no problems - we have a good username and password
    req.logIn(user, function(err)
    {
        // are there db errors?
        if(err)
        {
            console.error(err);
            res.end(err);
        }
        
        //console.log( (user.typeOfUser == null || user.typeOfUser === ""));

        if (user.typeOfUser == null || user.typeOfUser === ""){
            return res.redirect("/edituser");
            
            // return  res.render("profile/profile", { //NOT WORKING
            //     title: "Complete Profile",
            //     page: "profile",
            //     users: user,
            //     profiles: null,
            //     typeUserVal: user.typeOfUser,
            //     displayName: UserDisplayName(req),
            //     user: UserName(req)
            // });      

        } else {
            return res.redirect("/dentist");
        } 
    });    

   })(req, res, next);
}
 
export function ProcessRegisterPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    // instantiate a new user object
    let newUser = new User
    ({
        username: req.body.username,
        EmailAddress: req.body.emailAddress,
        DisplayName: req.body.firstName + " " + req.body.lastName,
        typeOfUser: ""
    });

    User.register(newUser, req.body.password, function(err: any)
    {
        if(err)
        {
            if(err.name == "UserExistsError")
            {
                console.error('ERROR: User Already Exists!');
                req.flash('registerMessage', 'Registration Error!');
            }
            else
            {
                console.error(err.name); // other error
                req.flash('registerMessage', 'Server Error');
            }
            return res.redirect('/register');            
        }

        // everything is ok - user has been registered

        // automatically login the user
        return passport.authenticate('local')(req, res, function()
        {
            //return res.redirect('/profile');
            return res.redirect("/edituser");
            
        });
    });
}

export function ProcessEditUserPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    
    let userName = UserName(req);

    // instantiate a new user object
    let editUser: {};        

    // console.log(userName);
    // console.log(req.body.emailAddress);
    // console.log(req.body.editName.join());

    // Update user Info
    User.findOneAndRemove({username: userName }, function (err:CallbackError, docs:any) {
        if(err){
            console.log(err) 
        }
        //if (err) throw err; 
        
        else{

            // instantiate a new user object, if text values are null will use collection saved values
            editUser = new User
            ({
                _id: docs._id,
                username: userName??docs.username,
                EmailAddress: req.body.emailAddress??docs.EmailAddress,
                DisplayName: req.body.editName.join(" ").trim()??docs.DisplayName,
                //DisplayName: req.body.editName??docs.DisplayName,
                typeOfUser: docs.typeOfUser??''
            });

            console.log("Removed User : ", docs);
            User.register(editUser, req.body.password, function(err: any)
            {
                if(err)
                {
                    console.error(err.name); // other error
                    req.flash('registerMessage', 'Server Error');            
                    throw err; 
                } else {
                    console.log("New User : ", editUser);
                    console.log("User Recreation Successfully.");
                }
                
                return res.redirect('/dentist');
            });
        }
    });
    

}

export function ProcessLogoutPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    req.logOut(function(err)
    {
        if(err)
        {
            console.error(err);
            res.end(err);
        }

        console.log("User Logged Out");
    });

    res.redirect('/login');
}


function foreach() {
    throw new Error('Function not implemented.');
}

