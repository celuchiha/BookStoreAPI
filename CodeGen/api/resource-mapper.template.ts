import * as elements from '@yellicode/elements';
import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { CSharpWriter } from '@yellicode/csharp';
import * as ef from './lib/entity-framework';

const outputDirectory = '../../api/resources';
const DATA_CONTEXT_NAME = 'BookstoreContext';

/**
 * Generates a method that maps an entity to a resource.
 * Example: public AuthorResource ToAuthorResource(Author entity) 
 */
const mapToResourceTemplate = (writer: CSharpWriter, c: elements.Class) => {
    writer.writeXmlDocSummary(`Creates a new ${c.name}Resource from a ${c.name} entity.`)
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
            else writer.writeLine(`resource.${att.name} = entity.${att.name} != null ? new ResourceInfo(entity.${att.name}.Id, entity.${att.name}.GetDisplayName()) : null;`);
        });
        writer.writeLine(`return resource;`);
    });
}

/**
 * Generates two methods that map a resource to an entity.
 * Example: 
 * public void ToAuthor(Author entity, AuthorResource resource)  
 * public Author ToAuthor(AuthorResource resource) 
 */
const mapToEntityTemplate = (writer: CSharpWriter, c: elements.Class) => {
    // overload 1
    writer.writeXmlDocSummary(`Fills an ${c.name} instance from a ${c.name}Resource entity.`)
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
    })
    // overload 2
    writer.writeLine();
    writer.writeXmlDocSummary(`Creates a new ${c.name} from a ${c.name}Resource instance.`)
    writer.writeLine(`public ${c.name} To${c.name}(${c.name}Resource resource)`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`var entity = new ${c.name}();`)
        writer.writeLine(`this.To${c.name}(entity, resource);`);
        writer.writeLine(`return entity;`)
    });
}

Generator.generateFromModel({ outputFile: `${outputDirectory}/ResourceMapper.cs` }, (textWriter: TextWriter, model: elements.Model) => {
    const writer = new CSharpWriter(textWriter);
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
        })
    });
});