"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessLogoutPage = exports.ProcessEditUserPage = exports.ProcessRegisterPage = exports.ProcessLoginPage = exports.DisplayEditUserPage = exports.DisplayRegisterPage = exports.DisplayLoginPage = void 0;
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../Models/user"));
const Util_1 = require("../Util");
function DisplayLoginPage(req, res, next) {
    if (!req.user) {
        return res.render('content/login', { title: 'Login', page: 'login', messages: req.flash('loginMessage'), displayName: (0, Util_1.UserDisplayName)(req), userID: (0, Util_1.UserID)(req) });
    }
    return res.redirect("/dentist");
}
exports.DisplayLoginPage = DisplayLoginPage;
function DisplayRegisterPage(req, res, next) {
    if (!req.user) {
        return res.render('content/register', { title: 'Register', page: 'register', messages: req.flash('registerMessage'), displayName: (0, Util_1.UserDisplayName)(req), userID: (0, Util_1.UserID)(req) });
    }
    if ((0, Util_1.TypeOfUser)(req) === null || (0, Util_1.TypeOfUser)(req) === "") {
        return res.render('/dentist');
    }
}
exports.DisplayRegisterPage = DisplayRegisterPage;
function DisplayEditUserPage(req, res, next) {
    if (req.user) {
        return res.render('content/edituser', { title: 'Edit User', page: 'edituser', messages: req.flash('registerMessage'), displayName: (0, Util_1.UserDisplayName)(req), userName: (0, Util_1.UserName)(req), userEmail: (0, Util_1.UserEmail)(req), userID: (0, Util_1.UserID)(req), typeOfUser: (0, Util_1.TypeOfUser)(req) });
    }
    else {
        return res.redirect("/dentist");
    }
}
exports.DisplayEditUserPage = DisplayEditUserPage;
function ProcessLoginPage(req, res, next) {
    passport_1.default.authenticate('local', function (err, user, info) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Error!');
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                console.error(err);
                res.end(err);
            }
            if (user.typeOfUser == null || user.typeOfUser === "") {
                return res.redirect("/edituser");
            }
            else {
                return res.redirect("/dentist");
            }
        });
    })(req, res, next);
}
exports.ProcessLoginPage = ProcessLoginPage;
function ProcessRegisterPage(req, res, next) {
    let newUser = new user_1.default({
        username: req.body.username,
        EmailAddress: req.body.emailAddress,
        DisplayName: req.body.firstName + " " + req.body.lastName,
        typeOfUser: ""
    });
    user_1.default.register(newUser, req.body.password, function (err) {
        if (err) {
            if (err.name == "UserExistsError") {
                console.error('ERROR: User Already Exists!');
                req.flash('registerMessage', 'Registration Error!');
            }
            else {
                console.error(err.name);
                req.flash('registerMessage', 'Server Error');
            }
            return res.redirect('/register');
        }
        return passport_1.default.authenticate('local')(req, res, function () {
            return res.redirect("/edituser");
        });
    });
}
exports.ProcessRegisterPage = ProcessRegisterPage;
function ProcessEditUserPage(req, res, next) {
    let userName = (0, Util_1.UserName)(req);
    let editUser;
    user_1.default.findOneAndRemove({ username: userName }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            editUser = new user_1.default({
                _id: docs._id,
                username: userName ?? docs.username,
                EmailAddress: req.body.emailAddress ?? docs.EmailAddress,
                DisplayName: req.body.editName.join(" ").trim() ?? docs.DisplayName,
                typeOfUser: docs.typeOfUser ?? ''
            });
            console.log("Removed User : ", docs);
            user_1.default.register(editUser, req.body.password, function (err) {
                if (err) {
                    console.error(err.name);
                    req.flash('registerMessage', 'Server Error');
                    throw err;
                }
                else {
                    console.log("New User : ", editUser);
                    console.log("User Recreation Successfully.");
                }
                return res.redirect('/dentist');
            });
        }
    });
}
exports.ProcessEditUserPage = ProcessEditUserPage;
function ProcessLogoutPage(req, res, next) {
    req.logOut(function (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        console.log("User Logged Out");
    });
    res.redirect('/login');
}
exports.ProcessLogoutPage = ProcessLogoutPage;
function foreach() {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=auth.js.map