"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.default = router;
const appointment_1 = require("../Controllers/appointment");
router.get('/', appointment_1.DisplayDentistAppointments);
router.get('/home', appointment_1.DisplayDentistAppointments);
router.get('/user', appointment_1.DisplayUserAppointments);
//# sourceMappingURL=appointment.js.map