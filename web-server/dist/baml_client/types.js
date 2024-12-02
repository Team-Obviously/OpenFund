"use strict";
/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.all_succeeded = all_succeeded;
exports.get_checks = get_checks;
function all_succeeded(checks) {
    return get_checks(checks).every(check => check.status === "succeeded");
}
function get_checks(checks) {
    return Object.values(checks);
}
//# sourceMappingURL=types.js.map