"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const csharp_1 = require("@yellicode/csharp");
const ef = require("./lib/entity-framework");
const utils = require("./lib/utils");
const outputDirectory = '../../api/data';
const options = { outputFile: `${outputDirectory}/BookStoreModelConfiguration.cs` };
templating_1.Generator.generateFromModel(options, (textWriter, model) => {
    const writer = new csharp_1.CSharpWriter(textWriter);
    utils.writeCodeGenerationWarning(writer);
    writer.writeUsingDirectives('Microsoft.EntityFrameworkCore');
    writer.writeLine();
    writer.writeNamespaceBlock({ name: 'Bookstore.Api.Data' }, () => {
        writer.writeLine('public partial class BookStoreModelConfiguration');
        writer.writeCodeBlock(() => {
            writer.writeLine('static partial void OnBuildModel(ModelBuilder modelBuilder)');
            writer.writeCodeBlock(() => {
                model.getAllClasses().forEach(c => {
                    ef.writeFluentConfiguration(writer, c);
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwtY29uZmlndXJhdGlvbi50ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vZGVsLWNvbmZpZ3VyYXRpb24udGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxzREFBa0Q7QUFDbEQsOENBQWlEO0FBQ2pELDZDQUE2QztBQUM3QyxxQ0FBcUM7QUFFckMsTUFBTSxlQUFlLEdBQUcsZ0JBQWdCLENBQUM7QUFDekMsTUFBTSxPQUFPLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxlQUFlLGlDQUFpQyxFQUFFLENBQUM7QUFFcEYsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxVQUFzQixFQUFFLEtBQXFCLEVBQUUsRUFBRTtJQUNuRixNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQzdELE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixNQUFNLENBQUMsbUJBQW1CLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxHQUFHLEVBQUU7UUFDNUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO1lBQ3ZCLE1BQU0sQ0FBQyxTQUFTLENBQUMsNkRBQTZELENBQUMsQ0FBQztZQUNoRixNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDOUIsRUFBRSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9