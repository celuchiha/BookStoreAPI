# HTML extension for Yellicode
Generate HTML code using powerful TypeScript code generation templates! This extension contains a code writer and other utilities that make is easier to generate HTML code from a Yellicode template.

License: MIT

## About Yellicode
Yellicode lets you build your own code generation templates with TypeScript. It consists of a Node.js CLI and extensible APIs, making it easy for developers to create, share and re-use code generators for their favorite programming languages and frameworks.

Check out [our website](https://www.yellicode.com) for more.

## Using the HTML package
### Prerequisites
In order to run a code generation template, you must have the CLI installed (@yellicode/cli) globally and have a valid *codegenconfig.json* file in your working directory. Please refer to the [installation instructions](https://www.yellicode.com/docs/installation) and the [quick start](https://www.yellicode.com/docs/quickstart) for more.

### Installation
Open a terminal/command prompt in your working directory and install this package as a dev dependency:

```
npm install @yellicode/html --save-dev
```

### Sample template
This basic example generates a HTML file containing a Bootstrap form for each class in the model. For a more advanced example with Angular support, check out
the Yellicode [bookstore tutorial](https://www.yellicode.com/docs/tutorial/bookstore). In order to run this example, you should also have the *@yellicode/elements* package installed in your working directory:

```
npm install @yellicode/elements --save-dev
```

```ts
import * as elements from '@yellicode/elements';
import { Generator } from '@yellicode/templating';
import { TextWriter, NameUtility } from '@yellicode/core';
import { HtmlWriter } from '@yellicode/html';

/**
 * Generates the contents of a Bootstrap form-group for the provided property. 
 */
const formGroupTemplate  = (writer: HtmlWriter, att: elements.Property) => {
    const htmlInputId = NameUtility.camelToKebabCase(att.name);     
    const isRequired = att.isRequiredAndSinglevalued();

    // Common attributes
    const htmlAttributes = {
        id: htmlInputId,
        name: att.name,
        required: isRequired
    };

    // Label 
    writer.writeElement('label', { attributes: { for: htmlInputId } }, att.name);
    
    // Input
    let htmlInputType: string;
    if (elements.isPrimitiveBoolean(att.type)) {
        htmlInputType = 'checkbox';
    }
    else if (elements.isPrimitiveInteger(att.type)) {
        htmlInputType = 'number';
    }
    else htmlInputType = 'text'; 
    htmlAttributes['type'] = htmlInputType;

    writer.writeElement('input', {classNames: 'form-control', attributes: htmlAttributes});
}

/**
 * Generates a Bootstrap form for the provided model Class. 
 */
const formTemplate = (writer: HtmlWriter, c: elements.Class) => {
    const allAttributes = c.ownedAttributes;    
    writer.writeElement('form', {}, () => { 
        allAttributes.forEach((att) => {
            writer.writeElement('div', { classNames: 'form-group' }, () => {
                formGroupTemplate(writer, att);
            });
        });

        // Action buttons
        writer.writeElement('button', {
            classNames: 'btn btn-primary float-right',
            attributes: {
                type: 'submit'
            }
        }, 'Save');

        writer.writeElement('button', {
            classNames: 'btn btn-danger',
            attributes: {
                type: 'submit'
            }
        }, 'Delete');
    });
}

Generator.getModel().then((model: elements.Model) => {
    model.getAllClasses().forEach((eachClass) => {
        Generator.generate({ outputFile: `${eachClass.name}.html` }, (textWriter: TextWriter) => {
            const htmlWriter = new HtmlWriter(textWriter);
            formTemplate(htmlWriter, eachClass);
        });
    });
})
```

### API Documentation
For all HtmlWriter functions and options, check out the [API documentation](https://github.com/yellicode/yellicode-html/blob/master/docs/api.md).