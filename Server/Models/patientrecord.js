"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const PatientRecordSchema = new Schema({
    patient_id: Object,
    dentist_id: Object,
    appointment_id: Object,
    procedure_id: Object,
    description: String,
    underTreatment: Boolean,
    start_date: {
        type: Date,
        default: Date.now()
    },
    end_date: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: "patientrecord"
});
const Model = mongoose_1.default.model('PatientRecord', PatientRecordSchema);
exports.default = Model;
//# sourceMappingURL=patientrecord.js.map