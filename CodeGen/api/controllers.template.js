"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const csharp_1 = require("@yellicode/csharp");
const path_utility_1 = require("../path-utility");
const ef = require("./lib/entity-framework");
const utils = require("./lib/utils");
const outputDirectory = '../../api/controllers';
const DATA_CONTEXT_NAME = 'BookstoreContext';
const getAllActionTemplate = (writer, c) => {
    writer.writeLine(`[HttpGet]`);
    writer.writeLine(`public IEnumerable<${c.name}Resource> GetAll()`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`return _dbContext.${c.name}Set`);
        ef.writeIncludeRelatedEntitiesQuery(writer, c);
        writer.writeLineIndented(`.Select(_resourceMapper.To${c.name}Resource)`);
        writer.writeLineIndented(`.ToList();`);
    });
};
const getAllOptionsActionTemplate = (writer, c) => {
    writer.writeLine(`[HttpGet("options")]`);
    writer.writeLine(`public IEnumerable<ResourceInfo> GetAllOptions()`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`return _dbContext.${c.name}Set`);
        writer.writeLineIndented(`.Select(e => new ResourceInfo(e.Id, e.GetDisplayName()))`);
        writer.writeLineIndented(`.ToList();`);
    });
};
const getByIdActionTemplate = (writer, c) => {
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
};
const createActionTemplate = (writer, c) => {
    writer.writeLine(`[HttpPost]`);
    writer.writeLine(`public IActionResult Create([FromBody] ${c.name}Resource resource)`);
    writer.writeCodeBlock(() => {
        writer.writeLine(`if (resource == null) { return BadRequest(); }`);
        writer.writeLine(`var entity = _resourceMapper.To${c.name}(resource);`);
        writer.writeLine(`_dbContext.${c.name}Set.Add(entity);`);
        writer.writeLine(`_dbContext.SaveChanges();`);
        writer.writeLine(`return CreatedAtRoute("Get${c.name}", new { id = entity.Id }, resource);`);
    });
};
const updateActionTemplate = (writer, c) => {
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
};
const deleteActionTemplate = (writer, c) => {
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
};
const controllerTemplate = (writer, c) => {
    const className = `${c.name}Controller`;
    writer.writeUsingDirectives('System', 'System.Collections.Generic', 'System.Linq', 'System.Threading.Tasks', 'Microsoft.AspNetCore.Mvc', 'Microsoft.EntityFrameworkCore');
    writer.writeLine();
    writer.writeUsingDirectives('Bookstore.Api.Data', 'Bookstore.Api.Resources');
    writer.writeLine();
    writer.writeNamespaceBlock({ name: 'Bookstore.Api.Controllers' }, () => {
        writer.writeLine(`[Route("api/${path_utility_1.PathUtility.createPathSegment(c)}")]`);
        writer.writeLine(`public partial class ${className} : Controller`);
        writer.writeCodeBlock(() => {
            // Create a variable to hold the data context and ResourceMapper
            writer.writeLine(`private readonly ${DATA_CONTEXT_NAME} _dbContext;`);
            writer.writeLine(`private readonly ResourceMapper _resourceMapper;`);
            writer.writeLine();
            // Create a constructor
            writer.writeLine(`public ${className}(${DATA_CONTEXT_NAME} dbContext)`);
            writer.writeCodeBlock(() => {
                writer.writeLine('_dbContext = dbContext;');
                writer.writeLine('_resourceMapper = new ResourceMapper(dbContext);');
            });
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
        });
    });
};
templating_1.Generator.getModel().then((model) => {
    model.getAllClasses().forEach(c => {
        templating_1.Generator.generate({ outputFile: `${outputDirectory}/${c.name}Controller.cs` }, (textWriter) => {
            const writer = new csharp_1.CSharpWriter(textWriter);
            utils.writeCodeGenerationWarning(writer);
            controllerTemplate(writer, c);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlcnMudGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb250cm9sbGVycy50ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHNEQUFrRDtBQUNsRCw4Q0FBaUQ7QUFFakQsa0RBQThDO0FBQzlDLDZDQUE2QztBQUM3QyxxQ0FBcUM7QUFFckMsTUFBTSxlQUFlLEdBQUcsdUJBQXVCLENBQUM7QUFDaEQsTUFBTSxpQkFBaUIsR0FBRyxrQkFBa0IsQ0FBQztBQUU3QyxNQUFNLG9CQUFvQixHQUFHLENBQUMsTUFBb0IsRUFBRSxDQUFpQixFQUFFLEVBQUU7SUFDckUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO1FBQ3ZCLE1BQU0sQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxnQ0FBZ0MsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLGlCQUFpQixDQUFDLDZCQUE2QixDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQztRQUN6RSxNQUFNLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFFRCxNQUFNLDJCQUEyQixHQUFHLENBQUMsTUFBb0IsRUFBRSxDQUFpQixFQUFFLEVBQUU7SUFDNUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0RBQWtELENBQUMsQ0FBQztJQUNyRSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRTtRQUN2QixNQUFN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