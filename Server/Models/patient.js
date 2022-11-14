"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const PatientSchema = new Schema({
    user_id: Object,
    fullName: String,
    EmailAddress: String,
    dateOfBirth: Date,
    sex: String,
    address: String,
    city: String,
    province_state: String,
    postalcode: String,
    country: String,
    phoneNumber: String,
    comments: String,
    specialConsiderations: String,
    Created: {
        type: Date,
        default: Date.now()
    },
    Updated: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: "patient"
});
const Model = mongoose_1.default.model('Patient', PatientSchema);
exports.default = Model;
//# sourceMappingURL=patient.js.map