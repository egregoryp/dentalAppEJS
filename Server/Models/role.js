"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const RoleSchema = new Schema({
    Role_Name: String,
    Role_Description: String
}, {
    collection: "role"
});
const Model = mongoose_1.default.model('Role', RoleSchema);
exports.default = Model;
//# sourceMappingURL=role.js.map