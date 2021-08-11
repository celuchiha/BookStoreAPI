import { NameUtility } from '@yellicode/core';
import * as elements from '@yellicode/elements';

export class PathUtility {
    /**
     * Creates a hyphenated string to be used as part of a file path or URL.     
     */
    public static createPathSegment(element: elements.NamedElement) {
        return NameUtility.camelToKebabCase(element.name);
    }
}