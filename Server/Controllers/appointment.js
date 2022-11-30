"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayUserAppointments = exports.DisplayDentistAppointments = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Util_1 = require("../Util");
function DisplayDentistAppointments(req, res, next) {
    res.render("appointment/dentistAppointment", {
        title: "Appointments",
        page: "appointment",
        displayName: (0, Util_1.UserDisplayName)(req),
        userType: (0, Util_1.TypeOfUser)(req)
    });
    console.log((0, Util_1.TypeOfUser)(req));
}
exports.DisplayDentistAppointments = DisplayDentistAppointments;
function DisplayUserAppointments(req, res, next) {
    res.render("appointment/userAppointment", {
        title: "Appointments",
        page: "userAppointment",
        displayName: (0, Util_1.UserDisplayName)(req),
        userType: (0, Util_1.TypeOfUser)(req)
    });
    console.log((0, Util_1.TypeOfUser)(req));
}
exports.DisplayUserAppointments = DisplayUserAppointments;
//# sourceMappingURL=appointment.js.map