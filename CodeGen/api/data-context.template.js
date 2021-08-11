"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const csharp_1 = require("@yellicode/csharp");
const utils = require("./lib/utils");
const outputDirectory = '../../api/data';
templating_1.Generator.generateFromModel({ outputFile: `${outputDirectory}/BookstoreContext.cs` }, (textWriter, model) => {
    const writer = new csharp_1.CSharpWriter(textWriter);
    utils.writeCodeGenerationWarning(writer);
    writer.writeUsingDirectives('Microsoft.EntityFrameworkCore');
    writer.writeLine();
    writer.writeNamespaceBlock({ name: 'Bookstore.Api.Data' }, () => {
        writer.writeLine('public partial class BookstoreContext');
        writer.writeCodeBlock(() => {
            // Generate a DbSet property for each model class.
            model.getAllClasses().forEach(c => {
                writer.writeLine(`public DbSet<${c.name}> ${c.name}Set { get; set; }`);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1jb250ZXh0LnRlbXBsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGF0YS1jb250ZXh0LnRlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsc0RBQWtEO0FBQ2xELDhDQUFpRDtBQUNqRCxxQ0FBcUM7QUFFckMsTUFBTSxlQUFlLEdBQUcsZ0JBQWdCLENBQUM7QUFFekMsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLGVBQWUsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLFVBQXNCLEVBQUUsS0FBcUIsRUFBRSxFQUFFO0lBQ3BJLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLCtCQUErQixDQUFDLENBQUM7SUFDN0QsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxFQUFFLEdBQUcsRUFBRTtRQUM1RCxNQUFNLENBQUMsU0FBUyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDMUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUU7WUFDdkIsa0RBQWtEO1lBQ2xELEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlCLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksbUJBQW1CLENBQUMsQ0FBQztZQUMzRSxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9