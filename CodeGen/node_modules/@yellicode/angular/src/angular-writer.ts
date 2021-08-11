import { ComponentConfig, ChangeDetectionStrategy, ViewEncapsulation } from './directive-config';
import { ModuleConfig } from './module-config';
import { TextWriter } from '@yellicode/core';
import { TypeScriptWriter } from '@yellicode/typescript';


/**
 * Provides utility functions for generating Angular 2+ application code.
 */
export class AngularWriter {

  /**
  * Writes a full Angular '@Component' class decorator using the provided configuration.   
  */
  public static writeComponentDecorator(writer: TypeScriptWriter, config: ComponentConfig): void {
    writer.writeDecoratorCodeBlock('Component', () => {
      AngularWriter.writeComponentConfig(writer, config);
    });
  }

  /**
   * Writes Angular component configuration that can be used inside a component class decorator.
   * Use writeComponentDecorator() to write a full '@Component' class decorator.
   */
  public static writeComponentConfig(writer: TextWriter, config: ComponentConfig): void {
    const keys = Object.keys(config);
    keys.forEach((key, index) => {
      writer.writeIndent();
      const value = config[key];
      writer.write(`${key}: ${AngularWriter.stringifyComponentProperty(key, value)}`);
      if (index < keys.length - 1) writer.write(',');
      writer.writeEndOfLine();
    });
  }

  /**
  * Writes a full Angular '@NgModule' class decorator using the provided configuration.   
  */
  public static writeModuleDecorator(writer: TypeScriptWriter, config: ModuleConfig): void {
    writer.writeDecoratorCodeBlock('NgModule', () => {
      AngularWriter.writeComponentConfig(writer, config);
    });
  }

  /**
   * Writes Angular module configuration that can be used inside a module class decorator.
   * Use writeModuleDecorator() to write a full '@NgModule' class decorator.
   */
  public static writeModuleConfig(writer: TextWriter, config: ModuleConfig): void {
    const keys = Object.keys(config);
    keys.forEach((key, index) => {
      writer.writeIndent();
      const value = config[key];
      writer.write(`${key}: ${AngularWriter.stringifyModuleProperty(key, value)}`);
      if (index < keys.length - 1) writer.write(',');
      writer.writeEndOfLine();
    });
  }

  /**
  * Writes a route configuration for the specified component, with the specified route path.
  */
  public static writeRoute(writer: TextWriter, route: { path: string, componentName: string }) {
    writer.writeLine('{');
    writer.increaseIndent();
    writer.writeLine(`path: '${route.path}',`);
    writer.writeLine(`component: ${route.componentName}`);
    writer.decreaseIndent();
    writer.writeLine('},');
  }

  private static stringifyModuleProperty(key: string, value: any): string {
    switch (key) {
      case 'bootstrap':
      case 'declarations':
      case 'entryComponents':
      case 'imports':
      case 'exports':
      case 'providers':
      case 'schemas':
        return AngularWriter.stringifyObjectArray(value);
      default: break;
    }
    if (typeof (value) == typeof (true)) {
      return value ? 'true' : 'false';
    }
    return `'${value}'`;
  }

  private static stringifyComponentProperty(key: string, value: any): string {
    switch (key) {
      case 'changeDetection':
        return `ChangeDetectionStrategy.${ChangeDetectionStrategy[value]}`;
      case 'encapsulation':
        return `ViewEncapsulation.${ViewEncapsulation[value]}`;
      case 'entryComponents':
      case 'providers':
      case 'viewProviders':
        return AngularWriter.stringifyObjectArray(value);
      case 'host':
        return AngularWriter.stringifyKeyValuePair(value);
      default:
        break;
    }
    if (typeof (value) == typeof (true)) {
      return value ? 'true' : 'false';
    }
    if (value instanceof Array) {
      return AngularWriter.stringifyStringArray(value);
    }
    // The value is a string
    else return `'${value}'`;
  }

  private static stringifyObjectArray(arr: any[]): string {
    if (!arr.length) return '[]';
    return `[${arr.join(', ')}]`;
  }

  private static stringifyStringArray(arr: any[]): string {
    if (!arr.length) return '[]';
    return `[${arr.map(item => `'${item}'`).join(', ')}]`;
  }

  private static stringifyKeyValuePair(value: { [key: string]: string; }): string {
    // {'key1': 'value1', 'key2': 'value2'}
    const keys = Object.keys(value);
    return `{ ${keys.map(k => `'${k}': '${value[k]}'`).join(', ')} }`;
  } 
}