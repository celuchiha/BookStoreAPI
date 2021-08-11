"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elements = require("@yellicode/elements");
const templating_1 = require("@yellicode/templating");
const csharp_1 = require("@yellicode/csharp");
const ef = require("./lib/entity-framework");
const outputDirectory = '../../api/resources';
const DATA_CONTEXT_NAME = 'BookstoreContext';
/**
 * Generates a method that maps an entity to a resource.
 * Example: public AuthorResource ToAuthorResource(Author entity)
 */
const mapToResourceTemplate = (writer, c) => {
    writer.writeXmlDocSummary(`Creates a new ${c.name}Resource from a ${c.name} entity.`);
    writer.writeLine(`public ${c.name}Resource To${c.name}Resource(${c.name} entity)`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`var resource = new ${c.name}Resource();`);
        // Assign the generated DisplayName (from an extension method)        
        writer.writeLine(`resource.DisplayName = entity.GetDisplayName();`);
        // Assign model properties
        c.ownedAttributes.forEach(att => {
            if (!elements.isClass(att.type)) {
                writer.writeLine(`resource.${att.name} = entity.${att.name};`);
                return;
            }
            if (ef.isManyToMany(att)) {
                const attTypeName = att.getTypeName();
                const joinPropertyName = ef.getJoinPropertyName(att);
                writer.writeLine(`resource.${att.name} = entity.${joinPropertyName}?.Select(e => new ResourceInfo(e.${attTypeName}.Id, e.${attTypeName}.GetDisplayName())).ToList();`);
            }
            else if (att.isMultivalued()) {
                writer.writeLine(`resource.${att.name} = entity.${att.name}?.Select(e => new ResourceInfo(e.Id, e.GetDisplayName())).ToList();`);
            }
            else
                writer.writeLine(`resource.${att.name} = entity.${att.name} != null ? new ResourceInfo(entity.${att.name}.Id, entity.${att.name}.GetDisplayName()) : null;`);
        });
        writer.writeLine(`return resource;`);
    });
};
/**
 * Generates two methods that map a resource to an entity.
 * Example:
 * public void ToAuthor(Author entity, AuthorResource resource)
 * public Author ToAuthor(AuthorResource resource)
 */
const mapToEntityTemplate = (writer, c) => {
    // overload 1
    writer.writeXmlDocSummary(`Fills an ${c.name} instance from a ${c.name}Resource entity.`);
    writer.writeLine(`public void To${c.name}(${c.name} entity, ${c.name}Resource resource)`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`entity.Id = resource.Id;`);
        c.getAllAttributes().forEach(att => {
            if (!elements.isClass(att.type)) {
                // A primitive attribute: just assign
                writer.writeLine(`entity.${att.name} = resource.${att.name};`);
                return;
            }
            // The attribute is a complex type. In the Resource, the other entity is linked using the ResourceInfo entity (or a collection of it).
            // In the entity, the attribute type depends on the relationship.
            let attTypeName = att.getTypeName();
            if (ef.isManyToMany(att)) {
                // Many to many: the attribute points to a join table
                const joinTableName = ef.getJoinTableName(att);
                writer.writeLine(`entity.${att.name} = resource.${att.name}?.Select(r => new ${joinTableName}(){ ${attTypeName}Id = r.Id }).ToList();`);
            }
            else if (att.isMultivalued()) {
                // Collection: use a utility method for updating using a collection of ids
                writer.writeLine(`entity.${att.name} = EntityUpdateUtility.UpdateRelatedChildren<${DATA_CONTEXT_NAME}, ${attTypeName}>(_dbContext.${attTypeName}Set, entity.${att.name}, resource.${att.name}?.Select(r => r.Id).ToList());`);
            }
            else {
                // A complex type, single-valued: assign the foreign key
                writer.writeLine(`entity.${att.name}Id = resource.${att.name}?.Id ?? 0;`);
            }
        });
    });
    // overload 2
    writer.writeLine();
    writer.writeXmlDocSummary(`Creates a new ${c.name} from a ${c.name}Resource instance.`);
    writer.writeLine(`public ${c.name} To${c.name}(${c.name}Resource resource)`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`var entity = new ${c.name}();`);
        writer.writeLine(`this.To${c.name}(entity, resource);`);
        writer.writeLine(`return entity;`);
    });
};
templating_1.Generator.generateFromModel({ outputFile: `${outputDirectory}/ResourceMapper.cs` }, (textWriter, model) => {
    const writer = new csharp_1.CSharpWriter(textWriter);
    writer.writeDelimitedCommentParagraph([
        "This code was generated by a Yellicode template.",
        "",
        "Changes to this file may cause incorrect behavior and will be lost if the code is regenerated."
    ]);
    writer.writeUsingDirectives('System', 'System.Collections.Generic', 'System.Linq', 'Bookstore.Api.Data');
    writer.writeLine();
    writer.writeNamespaceBlock({ name: 'Bookstore.Api.Resources' }, () => {
        writer.writeXmlDocSummary('A mapper class for conversion between REST resources and Entity Framework entities.');
        writer.writeLine(`public partial class ResourceMapper`);
        writer.writeCodeBlock(() => {
            writer.writeLine('private readonly BookstoreContext _dbContext;');
            // Constructor
            writer.writeLine();
            writer.writeLine('public ResourceMapper(BookstoreContext dbContext)');
            writer.writeCodeBlock(() => {
                writer.writeLine('_dbContext = dbContext;');
            });
            // Mapper methods
            model.getAllClasses().forEach(c => {
                writer.writeLine();
                mapToResourceTemplate(writer, c);
                writer.writeLine();
                mapToEntityTemplate(writer, c);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UtbWFwcGVyLnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVzb3VyY2UtbWFwcGVyLnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQWdEO0FBRWhELHNEQUFrRDtBQUNsRCw4Q0FBaUQ7QUFDakQsNkNBQTZDO0FBRTdDLE1BQU0sZUFBZSxHQUFHLHFCQUFxQixDQUFDO0FBQzlDLE1BQU0saUJBQWlCLEdBQUcsa0JBQWtCLENBQUM7QUFFN0M7OztHQUdHO0FBQ0gsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLE1BQW9CLEVBQUUsQ0FBaUIsRUFBRSxFQUFFO0lBQ3RFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksbUJBQW1CLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFBO0lBQ3JGLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLENBQUM7SUFDbkYsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUU7UUFDdkIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUM7UUFDNUQsc0VBQXNFO1FBQ3RFLE1BQU0sQ0FBQyxTQUFTLENBQUMsaURBQWlELENBQUMsQ0FBQztRQUNwRSwwQkFBMEI7UUFDMUIsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM3QixNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksYUFBYSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztnQkFDL0QsT0FBTzthQUNWO1lBQ0QsSUFBSSxFQUFF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