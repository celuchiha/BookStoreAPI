import * as elements from '@yellicode/elements';
import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { CSharpWriter } from '@yellicode/csharp';
import * as ef from './lib/entity-framework';
import * as utils from './lib/utils';

const outputDirectory = '../../api/data';
const options = { outputFile: `${outputDirectory}/BookStoreModelConfiguration.cs` };

Generator.generateFromModel(options, (textWriter: TextWriter, model: elements.Model) => {
    const writer = new CSharpWriter(textWriter);
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