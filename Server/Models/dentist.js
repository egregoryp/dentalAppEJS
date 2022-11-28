"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const DentistSchema = new Schema({
    user_id: Object,
    dateOfBirth: Date,
    sex: String,
    address: String,
    city: String,
    province_state: String,
    postalcode: String,
    country: String,
    phoneNumber: String,
    comments: String,
    specialty: String,
    Created: {
        type: Date,
        default: Date.now()
    },
    Updated: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: "dentist"
});
const Model = mongoose_1.default.model('Dentist', DentistSchema);
exports.default = Model;
//# sourceMappingURL=dentist.js.map