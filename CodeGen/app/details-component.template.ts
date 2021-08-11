import * as elements from '@yellicode/elements'; 
import { TypeScriptWriter, ClassDefinition } from '@yellicode/typescript';
import { PathUtility } from '../path-utility';
import { AngularWriter } from '@yellicode/angular';

const importsTemplate = (writer: TypeScriptWriter, c: elements.Class, complexAttributes: elements.Property[]) => {        
    writer.writeImports('@angular/core', ['Component', 'Injector']);        
    writer.writeImports('@angular/router', ['Router', 'ActivatedRoute']);        
    writer.writeImports('../services/resource-info', ['ResourceInfo']);       
    writer.writeImports('../services/resources', 'resources');        
    writer.writeImports('./component-base', ['ComponentBase']);            
    writer.writeImports(`../services/${PathUtility.createPathSegment(c)}-data.service`, [`${c.name}DataService`]);    

    complexAttributes.forEach((att) => {
        writer.writeLine(`import { ${att.type.name}DataService } from '../services/${PathUtility.createPathSegment(att.type)}-data.service';`);
    });
}

const componentDeclarationTemplate = (writer: TypeScriptWriter, c: elements.Class, complexAttributes: elements.Property[]) => {    
    const providers = [`${c.name}DataService`];
    complexAttributes.forEach((att) => {
        providers.push(`${att.type.name}DataService`);
    });

    // Write the @Component tag
    AngularWriter.writeComponentDecorator(writer, {  
        selector: `${c.name.toLowerCase()}-details`, 
        templateUrl: `/src/components/${c.name.toLowerCase()}-details.html`,
        providers: providers
    });
}

const saveFunctionTemplate = (writer: TypeScriptWriter, c: elements.Class) => {    
    const indexPathSegment = PathUtility.createPathSegment(c); // redirect to the IndexComponent when done
    writer.writeLine(`public save(): void {`);
    writer.writeLineIndented(`this.dataService.save(this.model).then(() => {this.injector.get(Router).navigateByUrl('/${indexPathSegment}')});`)    
    writer.writeLine(`}`);  
}

const deleteFunctionTemplate = (writer: TypeScriptWriter, c: elements.Class) => {    
    const indexPathSegment = PathUtility.createPathSegment(c); // redirect to the IndexComponent when done
    writer.writeLine(`public delete(): void {`);
    writer.writeLineIndented(`if (!confirm('${c.name} "' + this.model.displayName + '" will be deleted. Are you sure?')) return;`);
    writer.writeLineIndented(`this.dataService.delete(this.model.id).then(() => {this.injector.get(Router).navigateByUrl('/${indexPathSegment}')});`)    
    writer.writeLine(`}`);  
}

const onInitFunctionTemplate = (writer: TypeScriptWriter, c: elements.Class, complexAttributes: elements.Property[]) => {    
    writer.writeLine('public ngOnInit(): void {');  
    writer.increaseIndent();    
    // Request options 
    complexAttributes.forEach((att) => {
        writer.writeLine(`this.injector.get(${att.type.name}DataService).getAllOptions().then(opt => this.${att.name}Options = opt);`);                
    });
    writer.writeLine();        
    // Subscribe to the changes in the id parameter  
    writer.writeLine('this.paramSubscription = this.route.params.subscribe(params => {')
    writer.increaseIndent();
    writer.writeLine(`const id = +params['id']; // (+) converts string 'id' to a number`);
    writer.writeLine('if (id) {')
    writer.writeLineIndented(`this.dataService.getSingle(id).then(result => this.model = result);`);    
    writer.writeLine(`}`);  
    writer.writeLine(`else this.model = {displayName: 'New ${c.name}'} as resources.${c.name};`)
    writer.decreaseIndent();
    writer.writeLine(`});`);        
    writer.decreaseIndent();
    writer.writeLine(`}`);  
}

export const detailsComponentTemplate = (writer: TypeScriptWriter, c: elements.Class) => {    
    // Get a list of all attributes that have another resource as their type, we need to
    // create some extra logic for these at some places.
    const complexAttributes = c.getAllAttributes().filter(att => elements.isClass(att.type));

    importsTemplate(writer, c, complexAttributes); 
    writer.writeLine();

    componentDeclarationTemplate(writer, c, complexAttributes);
    const componentClass: ClassDefinition = {
        name: `${c.name}DetailsComponent`,
        extends: ['ComponentBase'],
        export: true
    }

    writer.writeClassBlock(componentClass, () => {
        writer.writeLine(`private paramSubscription: any;`); 
        writer.writeLine(`public model: resources.${c.name};`); 
        // Write option fields for selecting related entities
        complexAttributes.forEach((att) => {
            writer.writeLine(`public ${att.name}Options: ResourceInfo[];`); 
        });
        // constructor
        writer.writeLine();    
        writer.writeLine(`constructor(private route: ActivatedRoute, private injector: Injector, private dataService : ${c.name}DataService) {super()}`);    
        
        // ngOnInit
        writer.writeLine();    
        onInitFunctionTemplate(writer, c, complexAttributes);
    
        // save
        writer.writeLine();    
        saveFunctionTemplate(writer, c);
    
        // delete
        writer.writeLine();    
        deleteFunctionTemplate(writer, c);
    
        // ngOnDestroy
        writer.writeLine();    
        writer.writeLine('public ngOnDestroy(): void {')
        writer.writeLineIndented('this.paramSubscription.unsubscribe();');
        writer.writeLine(`}`);    
    });        
}
