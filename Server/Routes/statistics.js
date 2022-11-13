"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Util_1 = require("../Util");
const router = express_1.default.Router();
exports.default = router;
const statistics_1 = require("../Controllers/statistics");
router.get('/:id', Util_1.AuthGuard, statistics_1.DisplayStatisticsSurveyPage);
router.post('/:id', Util_1.AuthGuard, statistics_1.ProcessStatisticsSurveyPage);
router.get('/', Util_1.AuthGuard, statistics_1.DownloadXlsxFile);
//# sourceMappingURL=statistics.js.map