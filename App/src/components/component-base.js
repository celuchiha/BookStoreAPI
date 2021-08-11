"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComponentBase = /** @class */ (function () {
    function ComponentBase() {
    }
    /**
     * Use this function as [compareWith] function for options Angular templates:
     * [compareWith]="compareOptions". We need this so that Angular correctly syncs
     * the selected option with the options in the component.
     * See https://github.com/angular/angular/pull/13349
     */
    ComponentBase.prototype.compareOptions = function (optionOne, optionTwo) {
        if (!optionOne || !optionTwo)
            return true;
        return optionOne.id === optionTwo.id;
    };
    return ComponentBase;
}());
exports.ComponentBase = ComponentBase;
//# sourceMappingURL=component-base.js.map