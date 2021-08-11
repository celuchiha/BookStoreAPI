import * as elements from '@yellicode/elements'; 
import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { PathUtility } from '../path-utility';

const outputDirectory = '../../app/src/services';

/**
 * The root URL of the REST API. You would normally configure this and inject it into the data service.
 */
const API_BASE_URL = 'http://localhost:5000/api';

const getAllFunctionTemplate = (writer: TextWriter, c: elements.Class) => {     
    writer.writeLine(`public getAll(): Promise<resources.${c.name}[]> {`);
    writer.increaseIndent();
    writer.writeLine(`const url = this.baseUrl;`); 
    writer.writeLine(`return this.getJson(url);`);
    writer.decreaseIndent();        
    writer.writeLine(`}`);
}

const getAllOptionsFunctionTemplate = (writer: TextWriter, c: elements.Class) => {     
    writer.writeLine(`public getAllOptions(): Promise<ResourceInfo[]> {`);
    writer.increaseIndent();
    writer.writeLine(`const url = this.baseUrl + '/options';`); 
    writer.writeLine(`return this.getJson(url);`);
    writer.decreaseIndent();        
    writer.writeLine(`}`);
}

const getSingleFunctionTemplate = (writer: TextWriter, c: elements.Class) => {     
    writer.writeLine(`public getSingle(id: number): Promise<resources.${c.name}> {`);
    writer.increaseIndent();
    writer.writeLine(`const url = this.baseUrl + '/' + id;`); 
    writer.writeLine(`return this.getJson(url);`);
    writer.decreaseIndent();        
    writer.writeLine(`}`);
}

const saveFunctionTemplate = (writer: TextWriter, c: elements.Class) => {    
    writer.writeLine(`public save(resource: resources.${c.name}): Promise<void> {`);    
    writer.writeLineIndented(`return (resource.id > 0) ? this.putJson(this.baseUrl + '/' + resource.id, resource) : this.postJson(this.baseUrl, resource);`);         
    writer.writeLine(`}`);
}

const deleteFunctionTemplate = (writer: TextWriter, c: elements.Class) => {    
    writer.writeLine(`public delete(id: number): Promise<void> {`);    
    writer.writeLineIndented(`return this.deleteResource(this.baseUrl + '/'+ id);`);         
    writer.writeLine(`}`);
}

const dataServiceTemplate = (writer: TextWriter, c: elements.Class) => {
    writer.writeLine(`import { Injectable } from '@angular/core';`);
    writer.writeLine(`import { Http } from '@angular/http';`);
    writer.writeLine(`import { DataServiceBase } from './data-service-base';`);
    writer.writeLine(`import { ResourceInfo } from './resource-info';`);
    writer.writeLine(`import * as resources from './resources';`);
    writer.writeLine();
    writer.writeLine(`@Injectable()`);
    writer.writeLine(`export class ${c.name}DataService extends DataServiceBase {`);
    writer.increaseIndent();
    writer.writeLine(`private baseUrl: string = "${API_BASE_URL}/${PathUtility.createPathSegment(c)}";`);
    // constructor
    writer.writeLine();    
    writer.writeLine('constructor(http: Http) { super (http); }');  
    // getAll
    writer.writeLine();    
    getAllFunctionTemplate(writer, c);
    // getAllOptions
    writer.writeLine();
    getAllOptionsFunctionTemplate(writer, c);
    // getSingle
    writer.writeLine();
    getSingleFunctionTemplate(writer, c);
    // save
    writer.writeLine();
    saveFunctionTemplate(writer, c);
    // delete
    writer.writeLine();
    deleteFunctionTemplate(writer, c);
    // End of the service
    writer.decreaseIndent();
    writer.writeLine(`}`);
}

Generator.getModel().then((model: elements.Model) => {
    model.getAllClasses().forEach(c => {
        Generator.generate({outputFile: `${outputDirectory}/${PathUtility.createPathSegment(c)}-data.service.ts`}, (textWriter: TextWriter) => {            
             dataServiceTemplate(textWriter, c);
        })        
    });
});