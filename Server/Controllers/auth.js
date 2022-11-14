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
        return res.render('content/login', { title: 'Login', page: 'login', messages: req.flash('loginMessage'), displayName: (0, Util_1.UserDisplayName)(req) });
    }
    return res.redirect("/dentist");
}
exports.DisplayLoginPage = DisplayLoginPage;
function DisplayRegisterPage(req, res, next) {
    if (!req.user) {
        return res.render('content/register', { title: 'Register', page: 'register', messages: req.flash('registerMessage'), displayName: (0, Util_1.UserDisplayName)(req) });
    }
    return res.redirect("content/profile");
}
exports.DisplayRegisterPage = DisplayRegisterPage;
function DisplayEditUserPage(req, res, next) {
    if (req.user) {
        return res.render('content/edituser', { title: 'Edit User', page: 'edituser', messages: req.flash('registerMessage'), displayName: (0, Util_1.UserDisplayName)(req), userName: (0, Util_1.UserName)(req), userEmail: (0, Util_1.UserEmail)(req) });
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
            if ((0, Util_1.TypeOfUser)(req) === null || (0, Util_1.TypeOfUser)(req) === "") {
                return res.redirect("/profile");
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
            return res.redirect('/dentist');
        });
    });
}
exports.ProcessRegisterPage = ProcessRegisterPage;
function ProcessEditUserPage(req, res, next) {
    let user = (0, Util_1.UserName)(req);
    let editUser = new user_1.default({
        username: user,
        EmailAddress: req.body.emailAddress,
        DisplayName: req.body.editName
    });
    console.log(user);
    user_1.default.findOneAndRemove({ username: user }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Removed User : ", docs);
            user_1.default.register(editUser, req.body.password, function (err) {
                if (err) {
                    console.error(err.name);
                    req.flash('registerMessage', 'Server Error');
                }
                console.log("User Recreation Successfully.");
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
//# sourceMappingURL=auth.js.map