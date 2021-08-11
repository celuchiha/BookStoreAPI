/**
 * File: CodeGen/Api/resources.template.ts. See the tutorial for instructions.
 */
 import * as elements from '@yellicode/elements';
import { TextWriter } from '@yellicode/core';  
import { Generator } from '@yellicode/templating';  
import { SuffixingTransform, RenameTargets } from '@yellicode/elements';
import { CSharpWriter } from '@yellicode/csharp';
import * as utils from './lib/utils';

const outputDirectory = '../../api/resources';

/**
 * Writes all properties of a REST resource. 
 */
const resourcePropertiesTemplate = (writer: CSharpWriter, c: elements.Class): void => {
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
}

// Add a 'Resource' suffix to each class in the model
const transform = new SuffixingTransform(RenameTargets.classes, 'Resource');
const options = { outputFile: `${outputDirectory}/Resources.cs`, modelTransform: transform };

Generator.generateFromModel(options, (textWriter: TextWriter, model: elements.Model) => {
    const writer = new CSharpWriter(textWriter);
    utils.writeCodeGenerationWarning(writer);
    writer.writeUsingDirectives('System', 'System.Collections.Generic');
    writer.writeLine();
    writer.writeNamespaceBlock({ name: 'Bookstore.Api.Resources' }, () => {
        model.getAllClasses().forEach(c => {
            writer.writeClassBlock(c, () => {
                resourcePropertiesTemplate(writer, c);
            })
            writer.writeLine();
        });
    });
});