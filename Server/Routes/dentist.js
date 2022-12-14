"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.default = router;
const dentist_list_1 = require("../Controllers/dentist-list");
router.get('/', dentist_list_1.DisplayDentistList);
router.get('/home', dentist_list_1.DisplayDentistList);
//# sourceMappingURL=dentist.js.map