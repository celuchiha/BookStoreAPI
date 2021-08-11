import * as elements from '@yellicode/elements';
import { TypeScriptWriter, ClassDefinition } from '@yellicode/typescript';
import { PathUtility } from '../path-utility';
import { AngularWriter } from '@yellicode/angular';

export const indexComponentTemplate = (writer: TypeScriptWriter, c: elements.Class, itemsPropertyName: string) => {    
    writer.writeImports('@angular/core', ['Component', 'OnInit']);    
    writer.writeImports(`../services/${PathUtility.createPathSegment(c)}-data.service`, [`${c.name}DataService`]);    
    writer.writeImports('./component-base', ['ComponentBase']);        
    writer.writeImports('../services/resources', 'resources');    
    writer.writeLine();

    // Write the @Component tag
    AngularWriter.writeComponentDecorator(writer,  {
        selector: `${c.name.toLowerCase()}-index`,
        templateUrl: `/src/components/${c.name.toLowerCase()}-index.html`,
        providers: [`${c.name}DataService`]
    })
    const componentClass: ClassDefinition = {
        name: `${c.name}IndexComponent`,
        extends: ['ComponentBase'],
        export: true
    }
    writer.writeClassBlock(componentClass, () => {
        writer.writeLine(`public ${itemsPropertyName}: resources.${c.name}[] = [];`); 
        // constructor
        writer.writeLine();    
        writer.writeLine(`constructor(private dataService : ${c.name}DataService) {super()}`);    
        // ngOnInit
        writer.writeLine();        
        writer.writeLine('ngOnInit(): void {');  
        writer.writeLineIndented(`this.dataService.getAll().then(result => this.${itemsPropertyName} = result);`);    
        writer.writeLine(`}`);        
    })     
}
