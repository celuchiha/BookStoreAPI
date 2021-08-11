# Angular extension for Yellicode
The extension is intended as an alternative for the Angular CLI and provides a starting point for your own Angular (2+) application code generator,
which you can extend to your needs. 

License: MIT

## About Yellicode
Yellicode lets you build your own code generation templates with TypeScript. It consists of a Node.js CLI and extensible APIs, making it easy for developers to create, share and re-use code generators for their favorite programming languages and frameworks.

Check out [our website](https://www.yellicode.com) for more.

## Using the Angular package
### Prerequisites
In order to run a code generation template, you must have the Yellicode CLI installed globally (`npm install -g @yellicode/cli`) and have a valid *codegenconfig.json* file in your working directory. Please refer to the [installation instructions](https://www.yellicode.com/docs/installation) and the [quick start](https://www.yellicode.com/docs/quickstart) for more.

### Installation
Open a terminal/command prompt in your working directory and install this package as a dev dependency:

```
npm install @yellicode/angular --save-dev
```

### Sample template
The following sample generates a simple Angular component file named *my-component*. For simplicity, the component name in this example is static.

For a more sophisticated example, check out the article [Build your own Angular code generator](https://www.yellicode.com/blog/build-your-own-angular-code-generator).

```ts
  import { TypeScriptWriter } from '@yellicode/typescript';
  import { AngularWriter, ComponentConfig } from '@yellicode/angular';

  const fileBaseName = 'my-component'; 
  const componentSubDir = '../app/components';

  Generator.generate({ outputFile: `${path.join(componentSubDir, fileBaseName)}.ts` }, (output) => {
    const writer = new TypeScriptWriter(output);

    // Import Angular components
    const angularCoreImports: string[] = ['Component']; // The default Angular imports that you need
    writer.writeImports('@angular/core', angularCoreImports);
    writer.writeLine();

    const componentConfig: ComponentConfig = {
      selector: kebabCaseComponentName,
      templateUrl: `./${fileBaseName}.html`,
      styleUrls: [`./${fileBaseName}.scss`]
    };

    // First write the @Component(...) class decorator with the configuration
    AngularWriter.writeComponentDecorator(writer, componentConfig);
    // Then write the class itself
    writer.writeClassBlock({ name: `${componentBaseName}Component`, export: true }, () => {
      // Class contents go here
    });
  });
 
```