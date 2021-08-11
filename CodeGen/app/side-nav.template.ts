import * as elements from '@yellicode/elements';
import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '@yellicode/typescript';
import { HtmlWriter } from '@yellicode/html';
import { AngularWriter } from '@yellicode/angular';
import { PathUtility } from '../path-utility';

const outputDirectory = '../../app/src/components';
const htmlTemplateOptions = { outputFile: `${outputDirectory}/side-nav.html` };
const componentTemplateOptions = { outputFile: `${outputDirectory}/side-nav.component.ts` };

// Generate the HTML
Generator.generateFromModel(htmlTemplateOptions, (textWriter: TextWriter, model: elements.Model) => {
    const writer = new HtmlWriter(textWriter);
    writer.writeElement('nav', { classNames: 'col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar' }, () => {
        writer.writeElement('ul', { classNames: 'nav nav-pills flex-column' }, () => {
            model.getAllClasses().forEach(c => {
                writer.writeElement('li', { classNames: 'nav-item' }, () => {
                    writer.writeElement('a', {
                        classNames: 'nav-link',
                        attributes: { href: '#', routerLink: PathUtility.createPathSegment(c) }
                    },
                        c.name);
                })
            });
        });
    });
});

// Generate the component (although it is pretty static right now)
Generator.generate(componentTemplateOptions, (textWriter: TextWriter) => {
    const writer = new TypeScriptWriter(textWriter);
    writer.writeLine(`import { Component } from '@angular/core';`);
    AngularWriter.writeComponentDecorator(writer, { selector: 'side-nav', templateUrl: '/src/components/side-nav.html' });
    writer.writeLine('export class SideNavComponent {}');
});