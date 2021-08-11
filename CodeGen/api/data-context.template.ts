import * as elements from '@yellicode/elements';
import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { CSharpWriter } from '@yellicode/csharp';
import * as utils from './lib/utils';

const outputDirectory = '../../api/data';

Generator.generateFromModel({ outputFile: `${outputDirectory}/BookstoreContext.cs` }, (textWriter: TextWriter, model: elements.Model) => {
    const writer = new CSharpWriter(textWriter);
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
        })
    });
});