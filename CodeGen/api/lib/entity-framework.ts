/**
 * This file contains utility code for generating Entity Framework code.
 */

import * as elements from '@yellicode/elements'; 
import { CSharpWriter} from '@yellicode/csharp';

export function getJoinTableName(attribute: elements.Property) {
    const owner = attribute.owner as elements.NamedElement;
    return `${owner.name}${attribute.getTypeName()}`;
}

export function getJoinPropertyName(attribute: elements.Property) {    
    return attribute.name;    
}

export function isManyToMany(attribute: elements.Property): boolean {
    return elements.isClass(attribute.type) && attribute.aggregation === elements.AggregationKind.shared && attribute.isMultivalued();
}

export function writeEntityProperty(writer: CSharpWriter, att: elements.Property): void {
    const isComplexType = elements.isClass(att.type);
    if (isComplexType && !att.isMultivalued()) {
        // The attribute is complex, add a foreign key 'Id' property, e.g. CategoryId             
        const optionalModifier = att.isOptional() ? '?' : '';
        writer.writeXmlDocSummary(`The foreign key to the ${att.getTypeName()} table.`);
        writer.writeLine(`public int${optionalModifier} ${att.name}Id {get; set;}`);
        writer.writeLine();                
    }
    // Then write the actual property
    if (isManyToMany(att)) {
        // Special case for many-to-many: refer to the join table instead of to the principal directly
        // Ex: public ICollection<BookAuthor> Authors {get; set;}
        const joinTableName = getJoinTableName(att);
        const joinPropertyName = getJoinPropertyName(att);            
        writer.writeXmlDocSummary(att);            
        writer.writeLine(`public virtual ICollection<${joinTableName}> ${joinPropertyName} {get; set;}`);
    }
    else
    {
        // The attribute is a one-to-one or one-to-many relation or a primitive type. Just create a C# auto property.
        writer.writeAutoProperty(att, {virtual: isComplexType}); 
    }     
}

export function writeJoinTable(writer: CSharpWriter, att: elements.Property): void {
    const dependent = att.owner as elements.NamedElement;
    const principal = att.getTypeName();
    writer.writeLine(); 
    writer.writeXmlDocSummary(`A join table for creating many-to-many relations between ${dependent.name} and ${principal}. 
        This entity is not part of the model, but EF core does not support many-to-many relationships yet, see https://github.com/aspnet/EntityFrameworkCore/issues/10508.`);
    writer.writeLine(`public class ${getJoinTableName(att)}`); 
    writer.writeCodeBlock(() => {
        writer.writeLine(`public int ${dependent.name}Id {get; set;}`);
        writer.writeLine(`public ${dependent.name} ${dependent.name} {get; set;}`);
        writer.writeLine(`public int ${principal}Id {get; set;}`); 
        writer.writeLine(`public ${principal} ${principal} {get; set;}`);
    });
}

export function writeFluentConfiguration(writer: CSharpWriter, c: elements.Class): void {
 // Build configuration for may-to-many relations
 c.ownedAttributes.filter(att => isManyToMany(att)).forEach((att) => {        
    const joinTableName = getJoinTableName(att);
    const thisTypName = c.name;
    const foreignTypeName = att.type.name;

    writer.writeLine(`modelBuilder.Entity<${joinTableName}>()`)
    writer.writeLineIndented(`.HasKey(bc => new { bc.${thisTypName}Id, bc.${foreignTypeName}Id});`)
    writer.writeLine();
    writer.writeLine(`modelBuilder.Entity<${joinTableName}>()`);
    writer.increaseIndent();        
    writer.writeLine(`.HasOne(bc => bc.${thisTypName})`);
    writer.writeLine(`.WithMany(b => b.${att.name})`);
    writer.writeLine(`.HasForeignKey(bc => bc.${thisTypName}Id);`);
    writer.decreaseIndent();          
});
}

/**
 * Writes 0 or more Include calls that cause Entity Framework to eager-load related entities. 
 */
export function writeIncludeRelatedEntitiesQuery(writer: CSharpWriter, c: elements.Class) {
    writer.increaseIndent();
    c.getAllAttributes().filter(att => elements.isClass(att.type)).forEach((att) => {
        writer.writeIndent();
        writer.write(`.Include(e => e.${att.name})`);        
        // If the relationship is a using a join table (many-to-many), include the joined entity too
        if (isManyToMany(att)) {
            writer.write(`.ThenInclude(j => j.${att.getTypeName()})`);                    
        }
        writer.writeLine();
    }); 
    writer.decreaseIndent();
}