"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const QuestionSchema = new Schema({
    Survey_ID: Object,
    question: Array
}, {
    collection: "question"
});
const Model = mongoose_1.default.model('Question', QuestionSchema);
exports.default = Model;
//# sourceMappingURL=question.js.map