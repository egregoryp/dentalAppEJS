"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ContactusSchema = new Schema({
    Name: String,
    Subject: String,
    EmailAddress: String,
    Comments: String
}, {
    collection: "contactus"
});
const Model = mongoose_1.default.model('Contactus', ContactusSchema);
exports.default = Model;
//# sourceMappingURL=contactus.js.map