"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUTCEDTDate = exports.getEDTDate = exports.getFormattedDate = exports.AuthGuardEditDelete = exports.AuthGuard = exports.TypeOfUserID = exports.TypeOfUser = exports.UserID = exports.UserEmail = exports.UserName = exports.UserDisplayName = void 0;
const appointment_1 = __importDefault(require("../Models/appointment"));
const user_1 = __importDefault(require("../Models/user"));
const set_tz_1 = __importDefault(require("set-tz"));
(0, set_tz_1.default)('America/Toronto');
function UserDisplayName(req) {
    if (req.user) {
        let user = req.user;
        return user.DisplayName.toString();
    }
    return '';
}
exports.UserDisplayName = UserDisplayName;
function UserName(req) {
    if (req.user) {
        let user = req.user;
        return user.username.toString();
    }
    return '';
}
exports.UserName = UserName;
function UserEmail(req) {
    if (req.user) {
        let user = req.user;
        return user.EmailAddress.toString();
    }
    return '';
}
exports.UserEmail = UserEmail;
function UserID(req) {
    if (req.user) {
        let user = req.user;
        return user._id.toString();
    }
    return '';
}
exports.UserID = UserID;
function TypeOfUser(req) {
    if (req.user) {
        let user = req.user;
        if (user.typeOfUser) {
            return user.typeOfUser.toString();
        }
    }
    return '';
}
exports.TypeOfUser = TypeOfUser;
function TypeOfUserID(userID) {
    user_1.default.findById(userID, function (err, doc) {
        if (err) {
            console.log(err);
        }
        console.log(doc.typeOfUser);
        return doc.typeOfUser;
    });
    return '';
}
exports.TypeOfUserID = TypeOfUserID;
function AuthGuard(req, res, next) {
    let user = req.user;
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
exports.AuthGuard = AuthGuard;
function AuthGuardEditDelete(req, res, next) {
    let user = req.user;
    let id = req.params.id;
    appointment_1.default.findOne({ _id: id }).lean().exec((err, doc) => {
        if (err) {
            console.log(err);
            res.end(err);
        }
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }
        else {
            return res.redirect('/dentist');
        }
        next();
    });
}
exports.AuthGuardEditDelete = AuthGuardEditDelete;
function getFormattedDate(inputDate, fullDate = 0) {
    const dateFromServer = new Date(inputDate);
    const localOffset = new Date().getTimezoneOffset();
    const localOffsetMillis = 60 * 1000 * localOffset;
    const inputDateF = new Date(dateFromServer.getTime() + localOffsetMillis);
    let hoursAMPM;
    let hoursAMPMilitar;
    let vAMPM;
    let date_return = "";
    hoursAMPMilitar = inputDateF.getHours();
    if (inputDateF.getHours() > 12) {
        hoursAMPM = inputDateF.getHours() - 12;
        vAMPM = "PM";
    }
    else {
        hoursAMPM = inputDateF.getHours();
        vAMPM = "AM";
    }
    if (fullDate == 1) {
        date_return =
            inputDateF.getFullYear() +
                "-" +
                ("0" + (inputDateF.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + inputDateF.getDate()).slice(-2) +
                " " +
                ("0" + hoursAMPM).slice(-2) +
                ":" +
                ("0" + inputDateF.getMinutes()).slice(-2) +
                ":" +
                ("0" + inputDateF.getSeconds()).slice(-2) + " " + vAMPM;
    }
    else if (fullDate == 2) {
        date_return =
            ("0" + hoursAMPM).slice(-2) +
                ":" +
                ("0" + inputDateF.getMinutes()).slice(-2) +
                ":" +
                ("0" + inputDateF.getSeconds()).slice(-2) + " " + vAMPM;
    }
    else if (fullDate == 3) {
        console.log(hoursAMPMilitar);
        date_return =
            inputDateF.getFullYear() +
                "-" +
                ("0" + (inputDateF.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + inputDateF.getDate()).slice(-2) +
                "T" +
                hoursAMPMilitar +
                ":" +
                ("0" + inputDateF.getMinutes()).slice(-2);
    }
    else if (fullDate == 0) {
        date_return =
            inputDateF.getFullYear() + "-" +
                ("0" + (inputDateF.getMonth() + 1)).slice(-2) + "-" +
                ("0" + inputDateF.getDate()).slice(-2);
    }
    return date_return;
}
exports.getFormattedDate = getFormattedDate;
function getEDTDate(lastHour) {
    const dateFromServer = new Date();
    const localOffset = new Date().getTimezoneOffset();
    const localOffsetMillis = 60 * 1000 * localOffset;
    const edtDate = new Date(dateFromServer.getTime() - localOffsetMillis);
    if (lastHour) {
        edtDate.setHours(0);
        edtDate.setHours(19);
        edtDate.setMinutes(59);
        edtDate.setSeconds(59);
    }
    return edtDate;
}
exports.getEDTDate = getEDTDate;
function convertUTCEDTDate(utcDate) {
    const dateFromServer = utcDate;
    const localOffset = new Date().getTimezoneOffset();
    const localOffsetMillis = 60 * 1000 * localOffset;
    const edtDate = new Date(dateFromServer.getTime() - localOffsetMillis);
    return edtDate;
}
exports.convertUTCEDTDate = convertUTCEDTDate;
//# sourceMappingURL=index.js.map