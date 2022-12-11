"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Util_1 = require("../Util");
const router = express_1.default.Router();
exports.default = router;
const appointment_1 = require("../Controllers/appointment");
router.get('/', Util_1.AuthGuard, appointment_1.DisplayDentistAppointments);
router.get('/home', Util_1.AuthGuard, appointment_1.DisplayDentistAppointments);
router.get('/appointments/:id', Util_1.AuthGuard, appointment_1.DisplayBookAppointment);
router.post('/appointments/:id', Util_1.AuthGuard, appointment_1.ProcessBookAppointment);
router.get('/delete/:id', Util_1.AuthGuard, appointment_1.ProcessDeletePage);
router.get('/details/:id', Util_1.AuthGuard, appointment_1.DisplayDetailsAppointment);
router.post('/details/:id', Util_1.AuthGuard, appointment_1.ProcessDetailsAppointment);
//# sourceMappingURL=appointment.js.map