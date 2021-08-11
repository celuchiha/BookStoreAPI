/**
 * File: CodeGen/Api/entities.template.ts. See the tutorial for instructions.
 */
 
import * as elements from '@yellicode/elements';
import { TextWriter } from '@yellicode/core';  
import { Generator } from '@yellicode/templating';  
import { CSharpWriter } from '@yellicode/csharp';
import * as ef from './lib/entity-framework';
import * as utils from './lib/utils';

const outputDirectory = '../../api/data';
const options = { outputFile: `${outputDirectory}/Entities.cs` };

Generator.generateFromModel(options, (textWriter: TextWriter, model: elements.Model) => {
    const writer = new CSharpWriter(textWriter);
    const classOptions = { implements: ['IEntity'] } // implement our custom IEntity interface 
    utils.writeCodeGenerationWarning(writer);
    writer.writeUsingDirectives('System', 'System.Collections.Generic');
    writer.writeLine(); // insert a blank line
    writer.writeNamespaceBlock({ name: 'Bookstore.Api.Data' }, () => {
        model.getAllClasses().forEach(c => {
            writer.writeLine();
            writer.writeClassBlock(c, () => {
                c.ownedAttributes.forEach(att => {
                    ef.writeEntityProperty(writer, att);
                    writer.writeLine();
                });
            }, classOptions);

            // Create join tables for many-to-many-relations
            c.ownedAttributes.filter(att => ef.isManyToMany(att)).forEach((att) => {
                ef.writeJoinTable(writer, att);
            });
        });
    });
});