"use strict";
/**
 * File: CodeGen/Api/entities.template.ts. See the tutorial for instructions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const csharp_1 = require("@yellicode/csharp");
const ef = require("./lib/entity-framework");
const utils = require("./lib/utils");
const outputDirectory = '../../api/data';
const options = { outputFile: `${outputDirectory}/Entities.cs` };
templating_1.Generator.generateFromModel(options, (textWriter, model) => {
    const writer = new csharp_1.CSharpWriter(textWriter);
    const classOptions = { implements: ['IEntity'] }; // implement our custom IEntity interface 
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXRpZXMudGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbnRpdGllcy50ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBSUgsc0RBQWtEO0FBQ2xELDhDQUFpRDtBQUNqRCw2Q0FBNkM7QUFDN0MscUNBQXFDO0FBRXJDLE1BQU0sZUFBZSxHQUFHLGdCQUFnQixDQUFDO0FBQ3pDLE1BQU0sT0FBTyxHQUFHLEVBQUUsVUFBVSxFQUFFLEdBQUcsZUFBZSxjQUFjLEVBQUUsQ0FBQztBQUVqRSxzQkFBUyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQXNCLEVBQUUsS0FBcUIsRUFBRSxFQUFFO0lBQ25GLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1QyxNQUFNLFlBQVksR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUEsQ0FBQywwQ0FBMEM7SUFDM0YsS0FBSyxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztJQUNwRSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxzQkFBc0I7SUFDMUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLEVBQUUsR0FBRyxFQUFFO1FBQzVELEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRTtnQkFDM0IsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQzVCLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3BDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDdkIsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFakIsZ0RBQWdEO1lBQ2hELENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNsRSxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9