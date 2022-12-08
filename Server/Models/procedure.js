"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ProcedureSchema = new Schema({
    Procedure_Name: String,
    Procedure_Price: Number,
    Procedure_Description: String
}, {
    collection: "procedure"
});
const Model = mongoose_1.default.model('Procedure', ProcedureSchema);
exports.default = Model;
//# sourceMappingURL=procedure.js.map