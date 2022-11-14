"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayAddProfilePage = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = __importDefault(require("../Models/user"));
const Util_1 = require("../Util");
const set_tz_1 = __importDefault(require("set-tz"));
(0, set_tz_1.default)('America/Toronto');
function DisplayAddProfilePage(req, res, next) {
    let id = '63717c3f0d605d8fc6d50ed4';
    user_1.default.findById(id, function (err, userCollection) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        res.render("profile/profile", {
            title: "Complete Profile",
            page: "profile",
            users: userCollection,
            displayName: (0, Util_1.UserDisplayName)(req),
            user: (0, Util_1.UserName)(req)
        });
    });
}
exports.DisplayAddProfilePage = DisplayAddProfilePage;
exports.default = router;
//# sourceMappingURL=profile.js.map