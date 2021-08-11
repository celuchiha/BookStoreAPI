"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathUtility = void 0;
const core_1 = require("@yellicode/core");
class PathUtility {
    /**
     * Creates a hyphenated string to be used as part of a file path or URL.
     */
    static createPathSegment(element) {
        return core_1.NameUtility.camelToKebabCase(element.name);
    }
}
exports.PathUtility = PathUtility;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC11dGlsaXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGF0aC11dGlsaXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBDQUE4QztBQUc5QyxNQUFhLFdBQVc7SUFDcEI7O09BRUc7SUFDSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBOEI7UUFDMUQsT0FBTyxrQkFBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RCxDQUFDO0NBQ0o7QUFQRCxrQ0FPQyJ9