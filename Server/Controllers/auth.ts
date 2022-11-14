import express from 'express';
import { CallbackError } from 'mongoose';

// need passport functionality
import passport from 'passport';

// need to include the User model for authentication functions
import User from '../Models/user';

// import the DisplayName Utility method
import { UserDisplayName, UserName, UserEmail, TypeOfUser } from '../Util';

// Display Functions
export function DisplayLoginPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    if(!req.user)
    {
        return res.render('content/login', { title: 'Login', page: 'login', messages: req.flash('loginMessage'), displayName: UserDisplayName(req)});
    }
    return res.redirect("/dentist");
    
}

export function DisplayRegisterPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    if(!req.user)
    {
        return res.render('content/register', { title: 'Register', page: 'register', messages: req.flash('registerMessage'), displayName: UserDisplayName(req)});
    }
    return res.redirect("content/profile");
}

export function DisplayEditUserPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    if(req.user)
    {
        return res.render('content/edituser', { title: 'Edit User', page: 'edituser', messages: req.flash('registerMessage'), displayName: UserDisplayName(req), userName: UserName(req), userEmail: UserEmail(req)});
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

        // console.log(TypeOfUser(req));
        // console.log(TypeOfUser(req) === null || TypeOfUser(req) === "");
        if (TypeOfUser(req) === null || TypeOfUser(req) === ""){
            return res.redirect("/profile");
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
            return res.redirect('/dentist');
        });
    });
}

export function ProcessEditUserPage(req: express.Request, res: express.Response, next: express.NextFunction)
{
    
    let user = UserName(req);

    // instantiate a new user object
    let editUser = new User
    ({
        username: user,
        EmailAddress: req.body.emailAddress,
        DisplayName: req.body.editName
    });
    console.log(user);    

    //Update user Info
    User.findOneAndRemove({username: user }, function (err:CallbackError, docs:any) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Removed User : ", docs);
            User.register(editUser, req.body.password, function(err: any)
            {
                if(err)
                {
                    console.error(err.name); // other error
                    req.flash('registerMessage', 'Server Error');            
                }

                console.log("User Recreation Successfully.");
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


