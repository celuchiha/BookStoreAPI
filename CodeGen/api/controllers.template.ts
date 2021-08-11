import * as elements from '@yellicode/elements';
import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { CSharpWriter } from '@yellicode/csharp';

import { PathUtility } from '../path-utility';
import * as ef from './lib/entity-framework';
import * as utils from './lib/utils';

const outputDirectory = '../../api/controllers';
const DATA_CONTEXT_NAME = 'BookstoreContext';

const getAllActionTemplate = (writer: CSharpWriter, c: elements.Class) => {
    writer.writeLine(`[HttpGet]`);
    writer.writeLine(`public IEnumerable<${c.name}Resource> GetAll()`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`return _dbContext.${c.name}Set`);
        ef.writeIncludeRelatedEntitiesQuery(writer, c);
        writer.writeLineIndented(`.Select(_resourceMapper.To${c.name}Resource)`);
        writer.writeLineIndented(`.ToList();`);
    });
}

const getAllOptionsActionTemplate = (writer: CSharpWriter, c: elements.Class) => {
    writer.writeLine(`[HttpGet("options")]`);
    writer.writeLine(`public IEnumerable<ResourceInfo> GetAllOptions()`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`return _dbContext.${c.name}Set`);
        writer.writeLineIndented(`.Select(e => new ResourceInfo(e.Id, e.GetDisplayName()))`);
        writer.writeLineIndented(`.ToList();`);
    });
}

const getByIdActionTemplate = (writer: CSharpWriter, c: elements.Class) => {
    writer.writeLine(`[HttpGet("{id}", Name = "Get${c.name}")]`);
    writer.writeLine(`public IActionResult GetById(int id)`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`var entity = _dbContext.${c.name}Set`);
        ef.writeIncludeRelatedEntitiesQuery(writer, c);
        writer.writeLineIndented(`.FirstOrDefault(e => e.Id == id);`);
        writer.writeLine();
        writer.writeLine(`if (entity == null) { return NotFound(); }`);
        writer.writeLine(`return new ObjectResult(_resourceMapper.To${c.name}Resource(entity));`);
    });
}

const createActionTemplate = (writer: CSharpWriter, c: elements.Class) => {
    writer.writeLine(`[HttpPost]`);
    writer.writeLine(`public IActionResult Create([FromBody] ${c.name}Resource resource)`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`if (resource == null) { return BadRequest(); }`);
        writer.writeLine(`var entity = _resourceMapper.To${c.name}(resource);`);
        writer.writeLine(`_dbContext.${c.name}Set.Add(entity);`);
        writer.writeLine(`_dbContext.SaveChanges();`);
        writer.writeLine(`return CreatedAtRoute("Get${c.name}", new { id = entity.Id }, resource);`);
    });
}

const updateActionTemplate = (writer: CSharpWriter, c: elements.Class) => {
    writer.writeLine(`[HttpPut("{id}")]`);
    writer.writeLine(`public IActionResult Update(int id, [FromBody] ${c.name}Resource resource)`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`if (resource == null || resource.Id != id) { return BadRequest(); }`);
        writer.writeLine(`var entity = _dbContext.${c.name}Set`);
        ef.writeIncludeRelatedEntitiesQuery(writer, c);
        writer.writeLineIndented(`.FirstOrDefault(e => e.Id == id);`);
        writer.writeLine();
        writer.writeLine(`if (entity == null) { return NotFound(); }`);
        writer.writeLine();
        writer.writeLine(`_resourceMapper.To${c.name}(entity, resource);`);
        writer.writeLine();
        writer.writeLine(`_dbContext.${c.name}Set.Update(entity);`);
        writer.writeLine(`_dbContext.SaveChanges();`);
        writer.writeLine(`return new NoContentResult();`);
    });
}

const deleteActionTemplate = (writer: CSharpWriter, c: elements.Class) => {
    writer.writeLine(`[HttpDelete("{id}")]`);
    writer.writeLine(`public IActionResult Delete(int id)`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`var entity = _dbContext.${c.name}Set.FirstOrDefault(e => e.Id == id);`);
        writer.writeLine(`if (entity == null) { return NotFound(); }`);
        writer.writeLine();
        writer.writeLine(`_dbContext.${c.name}Set.Remove(entity);`);
        writer.writeLine(`_dbContext.SaveChanges();`);
        writer.writeLine(`return new NoContentResult();`);
    });
}

const controllerTemplate = (writer: CSharpWriter, c: elements.Class) => {
    const className = `${c.name}Controller`;
    writer.writeUsingDirectives('System', 'System.Collections.Generic', 'System.Linq', 'System.Threading.Tasks', 'Microsoft.AspNetCore.Mvc', 'Microsoft.EntityFrameworkCore');
    writer.writeLine();
    writer.writeUsingDirectives('Bookstore.Api.Data', 'Bookstore.Api.Resources');
    writer.writeLine();
    writer.writeNamespaceBlock({ name: 'Bookstore.Api.Controllers' }, () => {
        writer.writeLine(`[Route("api/${PathUtility.createPathSegment(c)}")]`);
        writer.writeLine(`public partial class ${className} : Controller`);
        writer.writeCodeBlock(() => {
            // Create a variable to hold the data context and ResourceMapper
            writer.writeLine(`private readonly ${DATA_CONTEXT_NAME} _dbContext;`)
            writer.writeLine(`private readonly ResourceMapper _resourceMapper;`)
            writer.writeLine();
            // Create a constructor
            writer.writeLine(`public ${className}(${DATA_CONTEXT_NAME} dbContext)`);
            writer.writeCodeBlock(() => {
                writer.writeLine('_dbContext = dbContext;')
                writer.writeLine('_resourceMapper = new ResourceMapper(dbContext);')
            })
            writer.writeLine();
            // Create the basic CRUD actions
            getAllActionTemplate(writer, c);
            writer.writeLine();
            getAllOptionsActionTemplate(writer, c);
            writer.writeLine();
            getByIdActionTemplate(writer, c);
            writer.writeLine();
            createActionTemplate(writer, c);
            writer.writeLine();
            updateActionTemplate(writer, c);
            writer.writeLine();
            deleteActionTemplate(writer, c);
        })
    })
}

Generator.getModel().then((model: elements.Model) => {
    model.getAllClasses().forEach(c => {
        Generator.generate({ outputFile: `${outputDirectory}/${c.name}Controller.cs` }, (textWriter: TextWriter) => {
            const writer = new CSharpWriter(textWriter);
            utils.writeCodeGenerationWarning(writer);
            controllerTemplate(writer, c);
        })
    });
});