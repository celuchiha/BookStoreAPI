/**
 * This file contains a template to generate a standardised Angular + Bootstrap table from a Class.
 */
import { NameUtility } from '@yellicode/core';
import * as elements from '@yellicode/elements';
import { HtmlWriter } from '@yellicode/html';
import { PathUtility } from '../path-utility';

export const tableTemplate = (writer: HtmlWriter, c: elements.Class, itemsPropertyName: string) => {
    // For simplicity, just get all attributes. We will customize this later using a profile.
    const allAttributes = c.getAllAttributes(); 

    writer.writeElement('div', { classNames: 'table-responsive' }, () => {
        writer.writeElement('table', { classNames: 'table table-striped' }, () => { 
            writer.writeElement('thead', null, () => { 
                writer.writeElement('tr', null, () => { 
                    writer.writeElement('th', {classNames: 'id'}, '#');
                    allAttributes.forEach(att => {
                        writer.writeElement('th', {classNames: NameUtility.camelToKebabCase(att.name)}, `${att.name}`);
                    });
                });
            });          
            writer.writeElement('tbody', {}, () => { 
                writer.writeElement('tr', { attributes: {'*ngFor': `let item of ${itemsPropertyName}`}}, () => {                      
                    writer.writeElement('td', { classNames: 'id'}, () => {
                        const detailsUrl = PathUtility.createPathSegment(c) + '/edit';                        
                        writer.writeElement("a", { attributes: {'[routerLink]': `['/${detailsUrl}', item.id]`} },`{{item.id}}`);
                    });
                    allAttributes.forEach(att => {
                        if (!elements.isClass(att.type)) {
                            writer.writeElement('td', {}, `{{item.${att.name}}}`); 
                        }
                        else writer.writeElement("td", {}, () => {
                            // The attribute points to another resource, meaning that is is a ResourceInfo object that has 
                            // the form {id: number, displayName: string}. Get the URL to the details page.
                            const childUrl = `${PathUtility.createPathSegment(att.type)}/edit`;
                            if (att.isMultivalued()) {
                                writer.writeElement("a", { attributes: { '*ngFor': `let c of item.${att.name}`, '[routerLink]': `['/${childUrl}', c.id]`}  },
                                    `{{c.displayName}}`
                                );
                            }
                            else {
                                writer.writeElement("a", { attributes: {'*ngIf': `item.${att.name}`, '[routerLink]': `['/${childUrl}', item.${att.name}.id]`} },
                                    `{{item.${att.name}.displayName}}`
                                );
                            }                            
                        });                      
                    });
                });
            });
        });
    });
}