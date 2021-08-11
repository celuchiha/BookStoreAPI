"use strict";
/**
 * This file contains utility code for generating Entity Framework code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeIncludeRelatedEntitiesQuery = exports.writeFluentConfiguration = exports.writeJoinTable = exports.writeEntityProperty = exports.isManyToMany = exports.getJoinPropertyName = exports.getJoinTableName = void 0;
const elements = require("@yellicode/elements");
function getJoinTableName(attribute) {
    const owner = attribute.owner;
    return `${owner.name}${attribute.getTypeName()}`;
}
exports.getJoinTableName = getJoinTableName;
function getJoinPropertyName(attribute) {
    return attribute.name;
}
exports.getJoinPropertyName = getJoinPropertyName;
function isManyToMany(attribute) {
    return elements.isClass(attribute.type) && attribute.aggregation === elements.AggregationKind.shared && attribute.isMultivalued();
}
exports.isManyToMany = isManyToMany;
function writeEntityProperty(writer, att) {
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
    else {
        // The attribute is a one-to-one or one-to-many relation or a primitive type. Just create a C# auto property.
        writer.writeAutoProperty(att, { virtual: isComplexType });
    }
}
exports.writeEntityProperty = writeEntityProperty;
function writeJoinTable(writer, att) {
    const dependent = att.owner;
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
exports.writeJoinTable = writeJoinTable;
function writeFluentConfiguration(writer, c) {
    // Build configuration for may-to-many relations
    c.ownedAttributes.filter(att => isManyToMany(att)).forEach((att) => {
        const joinTableName = getJoinTableName(att);
        const thisTypName = c.name;
        const foreignTypeName = att.type.name;
        writer.writeLine(`modelBuilder.Entity<${joinTableName}>()`);
        writer.writeLineIndented(`.HasKey(bc => new { bc.${thisTypName}Id, bc.${foreignTypeName}Id});`);
        writer.writeLine();
        writer.writeLine(`modelBuilder.Entity<${joinTableName}>()`);
        writer.increaseIndent();
        writer.writeLine(`.HasOne(bc => bc.${thisTypName})`);
        writer.writeLine(`.WithMany(b => b.${att.name})`);
        writer.writeLine(`.HasForeignKey(bc => bc.${thisTypName}Id);`);
        writer.decreaseIndent();
    });
}
exports.writeFluentConfiguration = writeFluentConfiguration;
/**
 * Writes 0 or more Include calls that cause Entity Framework to eager-load related entities.
 */
function writeIncludeRelatedEntitiesQuery(writer, c) {
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
exports.writeIncludeRelatedEntitiesQuery = writeIncludeRelatedEntitiesQuery;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50aXR5LWZyYW1ld29yay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudGl0eS1mcmFtZXdvcmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOzs7QUFFSCxnREFBZ0Q7QUFHaEQsU0FBZ0IsZ0JBQWdCLENBQUMsU0FBNEI7SUFDekQsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQThCLENBQUM7SUFDdkQsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7QUFDckQsQ0FBQztBQUhELDRDQUdDO0FBRUQsU0FBZ0IsbUJBQW1CLENBQUMsU0FBNEI7SUFDNUQsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDO0FBQzFCLENBQUM7QUFGRCxrREFFQztBQUVELFNBQWdCLFlBQVksQ0FBQyxTQUE0QjtJQUNyRCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxXQUFXLEtBQUssUUFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3RJLENBQUM7QUFGRCxvQ0FFQztBQUVELFNBQWdCLG1CQUFtQixDQUFDLE1BQW9CLEVBQUUsR0FBc0I7SUFDNUUsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakQsSUFBSSxhQUFhLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEVBQUU7UUFDdkMsMEZBQTBGO1FBQzFGLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsMEJBQTBCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDaEYsTUFB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