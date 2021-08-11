"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * File: CodeGen/Api/resources.template.ts. See the tutorial for instructions.
 */
const elements = require("@yellicode/elements");
const templating_1 = require("@yellicode/templating");
const elements_1 = require("@yellicode/elements");
const csharp_1 = require("@yellicode/csharp");
const utils = require("./lib/utils");
const outputDirectory = '../../api/resources';
/**
 * Writes all properties of a REST resource.
 */
const resourcePropertiesTemplate = (writer, c) => {
    // Write a property for each attribute. It depends on the original attribute type what to write here.
    c.ownedAttributes.forEach(att => {
        writer.writeLine();
        if (!elements.isClass(att.type)) {
            // A primitive type: write the property as-is.
            writer.writeAutoProperty(att);
        }
        else if (!att.isMultivalued()) {
            // A complex type, single-valued, create a foreign key (ResourceInfo) property instead.
            const optionalModifier = att.isOptional() ? '?' : '';
            writer.writeXmlDocSummary(att);
            writer.writeLine(`public ResourceInfo ${att.name} {get; set;}`);
        }
        else {
            // A complex type, multi-valued, create a foreign key (ResourceInfo) collection property instead.
            writer.writeXmlDocSummary(att);
            writer.writeLine(`public ICollection ${att.name} {get; set;}`);
        }
    });
    // Add a custom DisplayName property. We will use this property in the front-end.
    writer.writeXmlDocSummary(`Gets the display name of this ${c.name}. This property is generated.`);
    writer.writeLine(`public string DisplayName {get; set;}`);
};
// Add a 'Resource' suffix to each class in the model
const transform = new elements_1.SuffixingTransform(elements_1.RenameTargets.classes, 'Resource');
const options = { outputFile: `${outputDirectory}/Resources.cs`, modelTransform: transform };
templating_1.Generator.generateFromModel(options, (textWriter, model) => {
    const writer = new csharp_1.CSharpWriter(textWriter);
    utils.writeCodeGenerationWarning(writer);
    writer.writeUsingDirectives('System', 'System.Collections.Generic');
    writer.writeLine();
    writer.writeNamespaceBlock({ name: 'Bookstore.Api.Resources' }, () => {
        model.getAllClasses().forEach(c => {
            writer.writeClassBlock(c, () => {
                resourcePropertiesTemplate(writer, c);
            });
            writer.writeLine();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VzLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVzb3VyY2VzLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDRixnREFBZ0Q7QUFFakQsc0RBQWtEO0FBQ2xELGtEQUF3RTtBQUN4RSw4Q0FBaUQ7QUFDakQscUNBQXFDO0FBRXJDLE1BQU0sZUFBZSxHQUFHLHFCQUFxQixDQUFDO0FBRTlDOztHQUVHO0FBQ0gsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLE1BQW9CLEVBQUUsQ0FBaUIsRUFBUSxFQUFFO0lBQ2pGLHFHQUFxRztJQUNyRyxDQUFDLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM1QixNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdCLDhDQUE4QztZQUM5QyxNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDakM7YUFDSSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQzNCLHVGQUF1RjtZQUN2RixNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDckQsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDO1NBQ25FO2FBQ0k7WUFDRCxpR0FBaUc7WUFDakcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxTQUFTLENBQUMsc0JBQXNCLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDO1NBQ2xFO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxpRkFBaUY7SUFDakYsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGlDQUFpQyxDQUFDLENBQUMsSUFBSSwrQkFBK0IsQ0FBQyxDQUFDO0lBQ2xHLE1BQU0sQ0FBQyxTQUFTLENBQUMsdUNBQXVDLENBQUMsQ0FBQztBQUM5RCxDQUFDLENBQUE7QUFFRCxxREFBcUQ7QUFDckQsTUFBTSxTQUFTLEdBQUcsSUFBSSw2QkFBa0IsQ0FBQyx3QkFBYSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM1RSxNQUFNLE9BQU8sR0FBRyxFQUFFLFVBQVUsRUFBRSxHQUFHLGVBQWUsZUFBZSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsQ0FBQztBQUU3RixzQkFBUyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQXNCLEVBQUUsS0FBcUIsRUFBRSxFQUFFO0lBQ25GLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0lBQ3BFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUUsRUFBRSxHQUFHLEVBQUU7UUFDakUsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM5QixNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUU7Z0JBQzNCLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQTtZQUNGLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==