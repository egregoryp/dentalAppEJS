"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Util_1 = require("../Util");
const router = express_1.default.Router();
exports.default = router;
const survey_list_1 = require("../Controllers/survey-list");
router.get('/', survey_list_1.DisplaySurveyList);
router.get('/home', survey_list_1.DisplaySurveyList);
router.get('/add', Util_1.AuthGuard, survey_list_1.DisplayAddSurveyList);
router.post('/add', Util_1.AuthGuard, survey_list_1.ProcessAddSurveyPage);
router.get('/:id', Util_1.AuthGuardEditDelete, survey_list_1.DisplayEditSurveyPage);
router.post('/:id', Util_1.AuthGuardEditDelete, survey_list_1.ProcessEditSurveyPage);
router.get('/delete/:id', Util_1.AuthGuardEditDelete, survey_list_1.ProcessDeleteSurveyPage);
//# sourceMappingURL=survey.js.map