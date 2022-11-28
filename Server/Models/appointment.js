"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const AppointmentSchema = new Schema({
    Name: String,
    Owner: String,
    OwnerUserName: String,
    isActive: Boolean,
    type: String,
    Start_Date: {
        type: Date,
        default: Date.now()
    },
    End_Date: Date
}, {
    collection: "appointment"
});
const Model = mongoose_1.default.model('Appointment', AppointmentSchema);
exports.default = Model;
//# sourceMappingURL=appointment.js.map