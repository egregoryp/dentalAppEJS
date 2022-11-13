"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadXlsxFile = exports.ProcessStatisticsSurveyPage = exports.DisplayStatisticsSurveyPage = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mongoose_1 = __importDefault(require("mongoose"));
const dentist_1 = __importDefault(require("../Models/dentist"));
const question_1 = __importDefault(require("../Models/question"));
const response_1 = __importDefault(require("../Models/response"));
const Util_1 = require("../Util");
function DisplayStatisticsSurveyPage(req, res, next) {
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
            response_1.default.find({ Survey_ID: id }, function (err, responses) {
                if (err) {
                    console.log(err);
                    res.end(err);
                }
                res.render("statistics/statistics", {
                    title: "Survey Statistics",
                    page: "statistics",
                    surveys: surveys,
                    displayName: (0, Util_1.UserDisplayName)(req),
                    questions: questions,
                    responses: responses
                });
            });
        });
    });
}
exports.DisplayStatisticsSurveyPage = DisplayStatisticsSurveyPage;
function ProcessStatisticsSurveyPage(req, res, next) {
    let id = req.params.id;
    dentist_1.default.findById({ _id: id }).lean().exec((err, surveys) => {
        if (err) {
            console.log(err);
            res.end(err);
        }
        let qId = new mongoose_1.default.Types.ObjectId(id);
        question_1.default.find({ Survey_ID: qId }).lean().exec((err, questions) => {
            if (err) {
                console.log(err);
                res.end(err);
            }
            response_1.default.find({ Survey_ID: id }).lean().exec((err, responses) => {
                if (err) {
                    console.log(err);
                    res.end(err);
                }
                const exportSurveyStats = async () => {
                    const workbook = new exceljs_1.default.Workbook();
                    let sheetName;
                    if (surveys.Name != null) {
                        sheetName = surveys.Name.replace(' ', '');
                    }
                    const worksheet = workbook.addWorksheet(sheetName);
                    worksheet.columns = [
                        { key: '0', header: 'Responses / Questions' },
                        { key: '1', header: questions[0].question[0].toString() },
                        { key: '2', header: questions[0].question[1].toString() },
                        { key: '3', header: questions[0].question[2].toString() },
                        { key: '4', header: questions[0].question[3].toString() },
                        { key: '5', header: questions[0].question[4].toString() },
                    ];
                    let newResponses = [];
                    let combineArrResponses = [];
                    for (let count = 0; count < responses.length; count++) {
                        newResponses[0] = count + 1;
                        combineArrResponses = newResponses.concat(responses[count].response);
                        worksheet.addRow(combineArrResponses);
                    }
                    worksheet.columns.forEach((sheetColumn) => {
                        sheetColumn.font = {
                            size: 12,
                        };
                        sheetColumn.width = 30;
                    });
                    worksheet.getRow(1).font = {
                        bold: true,
                        size: 13,
                    };
                    let exportPath = path_1.default.resolve('', "file.xlsx");
                    workbook.xlsx.writeFile(exportPath);
                };
                exportSurveyStats();
                res.redirect('/statistics/' + id);
            });
        });
    });
}
exports.ProcessStatisticsSurveyPage = ProcessStatisticsSurveyPage;
function DownloadXlsxFile(req, res, next) {
    const file = `${process.cwd()}//file.xlsx`;
    console.log(process.cwd());
    setTimeout(function () { res.download(file); }, 2000);
}
exports.DownloadXlsxFile = DownloadXlsxFile;
exports.default = router;
//# sourceMappingURL=statistics.js.map