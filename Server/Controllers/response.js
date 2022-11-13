"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessResponseSurveyPage = exports.DisplayResponseSurveyPage = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mongoose_1 = __importDefault(require("mongoose"));
const dentist_1 = __importDefault(require("../Models/dentist"));
const question_1 = __importDefault(require("../Models/question"));
const response_1 = __importDefault(require("../Models/response"));
const Util_1 = require("../Util");
function DisplayResponseSurveyPage(req, res, next) {
    let id = req.params.id;
    dentist_1.default.findById(id, function (err, surveys) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        let qId = new mongoose_1.default.Types.ObjectId(id);
        question_1.default.find({ Survey_ID: qId }, function (err, questions) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            res.render("response/response", {
                title: "Answer Survey",
                page: "response",
                surveys: surveys,
                displayName: (0, Util_1.UserDisplayName)(req),
                questions: questions
            });
        });
    });
}
exports.DisplayResponseSurveyPage = DisplayResponseSurveyPage;
function ProcessResponseSurveyPage(req, res, next) {
    let id = req.params.id;
    dentist_1.default.findOne({ _id: id }).lean().exec((err, doc) => {
        if (err) {
            console.log(err);
            res.end(err);
        }
        let responseArr;
        if (doc.type == "T") {
            responseArr = [req.body.a1, req.body.a2, req.body.a3, req.body.a4, req.body.a5];
        }
        else if (doc.type == "TF") {
            let longResponse = [];
            if (req.body.a1TF == "T") {
                longResponse[0] = "True";
            }
            else {
                longResponse[0] = "False";
            }
            if (req.body.a2TF == "T") {
                longResponse[1] = "True";
            }
            else {
                longResponse[1] = "False";
            }
            if (req.body.a3TF == "T") {
                longResponse[2] = "True";
            }
            else {
                longResponse[2] = "False";
            }
            if (req.body.a4TF == "T") {
                longResponse[3] = "True";
            }
            else {
                longResponse[3] = "False";
            }
            if (req.body.a5TF == "T") {
                longResponse[4] = "True";
            }
            else {
                longResponse[4] = "False";
            }
            responseArr = [longResponse[0], longResponse[1], longResponse[2], longResponse[3], longResponse[4]];
        }
        else if (doc.type == "R") {
            let longResponse = [];
            if (req.body.a1R == "VU") {
                longResponse[0] = "Very Unsatisfied";
            }
            else if (req.body.a1R == "U") {
                longResponse[0] = "Unsatisfied";
            }
            else if (req.body.a1R == "S") {
                longResponse[0] = "Satisfied";
            }
            else if (req.body.a1R == "VS") {
                longResponse[0] = "Very Satisfied";
            }
            else {
                longResponse[0] = "Not Applicable";
            }
            if (req.body.a2R == "VU") {
                longResponse[1] = "Very Unsatisfied";
            }
            else if (req.body.a2R == "U") {
                longResponse[1] = "Unsatisfied";
            }
            else if (req.body.a2R == "S") {
                longResponse[1] = "Satisfied";
            }
            else if (req.body.a2R == "VS") {
                longResponse[1] = "Very Satisfied";
            }
            else {
                longResponse[1] = "Not Applicable";
            }
            if (req.body.a3R == "VU") {
                longResponse[2] = "Very Unsatisfied";
            }
            else if (req.body.a3R == "U") {
                longResponse[2] = "Unsatisfied";
            }
            else if (req.body.a3R == "S") {
                longResponse[2] = "Satisfied";
            }
            else if (req.body.a3R == "VS") {
                longResponse[2] = "Very Satisfied";
            }
            else {
                longResponse[2] = "Not Applicable";
            }
            if (req.body.a4R == "VU") {
                longResponse[3] = "Very Unsatisfied";
            }
            else if (req.body.a4R == "U") {
                longResponse[3] = "Unsatisfied";
            }
            else if (req.body.a4R == "S") {
                longResponse[3] = "Satisfied";
            }
            else if (req.body.a4R == "VS") {
                longResponse[3] = "Very Satisfied";
            }
            else {
                longResponse[3] = "Not Applicable";
            }
            if (req.body.a5R == "VU") {
                longResponse[4] = "Very Unsatisfied";
            }
            else if (req.body.a5R == "U") {
                longResponse[4] = "Unsatisfied";
            }
            else if (req.body.a5R == "S") {
                longResponse[4] = "Satisfied";
            }
            else if (req.body.a5R == "VS") {
                longResponse[4] = "Very Satisfied";
            }
            else {
                longResponse[4] = "Not Applicable";
            }
            responseArr = [longResponse[0], longResponse[1], longResponse[2], longResponse[3], longResponse[4]];
        }
        let responseFound = new response_1.default({
            Survey_ID: id,
            response: responseArr
        });
        response_1.default.create(responseFound, function (err) {
            if (err) {
                console.error(err);
                res.end(err);
            }
            res.redirect("/dentist");
        });
    });
}
exports.ProcessResponseSurveyPage = ProcessResponseSurveyPage;
exports.default = router;
//# sourceMappingURL=response.js.map