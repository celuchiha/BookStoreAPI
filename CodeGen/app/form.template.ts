/**
 * This file contains a template to generate a standardised Angular + Bootstrap form from a Class.
 */

import { NameUtility } from '@yellicode/core';
import * as elements from '@yellicode/elements'; 
import { HtmlWriter } from '@yellicode/html';

const formGroupTemplate = (writer: HtmlWriter, att: elements.Property) => {
    const htmlInputId = NameUtility.camelToKebabCase(att.name);     
    const isRequired = att.isRequiredAndSinglevalued();

    // Common attributes
    const htmlAttributes = {
        id: htmlInputId,
        name: att.name, // for Angular validation to work correctly, the element name must match the name in the viewmodel    
        '[(ngModel)]': `model.${att.name}`,
        required: isRequired
    };

    // Label 
    writer.writeElement('label', { attributes: { for: htmlInputId } }, att.name);

    // Input
    if (!elements.isClass(att.type)) {
        // The input is for a simple primitive type
        let htmlInputType: string;
        if (elements.isPrimitiveBoolean(att.type)) {
            htmlInputType = 'checkbox';
        }
        else if (elements.isPrimitiveInteger(att.type)) {
            htmlInputType = 'number';
        }
        else htmlInputType = 'text'; // todo: use tagged values to distinguish single-line from multi-line
        htmlAttributes['type'] = htmlInputType;
        writer.writeElement('input', {classNames: 'form-control', attributes: htmlAttributes});
    }
    else {
        // The input is for a complex type, so make a <select> for selecting the relation. 
        // E.g. if a Book has a Language, the BookDetailsComponent will contain a languageOptions member that the <select> is bound to.
        htmlAttributes['[compareWith]'] = 'compareOptions'; // a ComponentBase function to support Angular in two-way binding. 
        htmlAttributes['multiple'] = att.isMultivalued(); // make a multi-select (I know, not always the best option UX wise but that's left as an exercise)
        writer.writeElement('select', { classNames: 'form-control', attributes: htmlAttributes }, () => {
            writer.writeElement('option', { attributes: { '*ngFor': `let opt of ${att.name}Options`, '[ngValue]': 'opt' } }, '{{opt.displayName}}');
        });
    } 
}

export const formTemplate = (writer: HtmlWriter, c: elements.Class) => {
    const allAttributes = c.ownedAttributes;
    const formId = `${NameUtility.upperToLowerCamelCase(c.name)}Form`;
    writer.writeElement('form', {attributes: {'#theForm': 'ngForm'} }, () => { // give the form a name, we use it below
        allAttributes.forEach((att) => {  
            writer.writeElement('div', { classNames: 'form-group' }, () => {
                formGroupTemplate(writer, att);
            });
        }); 

        // Action buttons, disabling the Save button is the form is not valid and disabling the Delete button in 'Create' mode.
        writer.writeElement('button', {
            classNames: 'btn btn-primary float-right',
            attributes: {
                type: 'submit',
                '(click)': 'save()',
                '[disabled]': '!theForm.valid'
            }
        },
        'Save');

        writer.writeElement('button', {
            classNames: 'btn btn-danger',
            attributes: {
                type: 'submit',
                '(click)': 'delete()',
                '[disabled]': '!model.id'
            }
        },
        'Delete');
    });
}