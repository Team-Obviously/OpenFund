"use strict";
/*************************************************************************************************

Welcome to Baml! To use this generated code, please run one of the following:

$ npm install @boundaryml/baml
$ yarn add @boundaryml/baml
$ pnpm add @boundaryml/baml

*************************************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
const type_builder_1 = require("@boundaryml/baml/type_builder");
class TypeBuilder {
    constructor() {
        this.tb = new type_builder_1.TypeBuilder({
            classes: new Set([
                "StakeComment",
            ]),
            enums: new Set([])
        });
    }
    __tb() {
        return this.tb._tb();
    }
    string() {
        return this.tb.string();
    }
    literalString(value) {
        return this.tb.literalString(value);
    }
    literalInt(value) {
        return this.tb.literalInt(value);
    }
    literalBool(value) {
        return this.tb.literalBool(value);
    }
    int() {
        return this.tb.int();
    }
    float() {
        return this.tb.float();
    }
    bool() {
        return this.tb.bool();
    }
    list(type) {
        return this.tb.list(type);
    }
    null() {
        return this.tb.null();
    }
    map(key, value) {
        return this.tb.map(key, value);
    }
    union(types) {
        return this.tb.union(types);
    }
    addClass(name) {
        return this.tb.addClass(name);
    }
    addEnum(name) {
        return this.tb.addEnum(name);
    }
}
exports.default = TypeBuilder;
//# sourceMappingURL=type_builder.js.map