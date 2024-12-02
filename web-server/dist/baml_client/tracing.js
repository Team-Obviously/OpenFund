"use strict";
/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.onLogEvent = exports.flush = exports.setTags = exports.traceSync = exports.traceAsync = void 0;
const globals_1 = require("./globals");
const traceAsync = globals_1.DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX.traceFnAsync.bind(globals_1.DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX);
exports.traceAsync = traceAsync;
const traceSync = globals_1.DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX.traceFnSync.bind(globals_1.DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX);
exports.traceSync = traceSync;
const setTags = globals_1.DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX.upsertTags.bind(globals_1.DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX);
exports.setTags = setTags;
const flush = () => {
    globals_1.DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX.flush.bind(globals_1.DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX)();
};
exports.flush = flush;
const onLogEvent = (callback) => globals_1.DO_NOT_USE_DIRECTLY_UNLESS_YOU_KNOW_WHAT_YOURE_DOING_CTX.onLogEvent(callback);
exports.onLogEvent = onLogEvent;
//# sourceMappingURL=tracing.js.map