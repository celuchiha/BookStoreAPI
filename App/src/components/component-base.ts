import { ResourceInfo } from "../services/resource-info";

export class ComponentBase {
    /**
     * Use this function as [compareWith] function for options Angular templates:
     * [compareWith]="compareOptions". We need this so that Angular correctly syncs
     * the selected option with the options in the component. 
     * See https://github.com/angular/angular/pull/13349
     */
    public compareOptions(optionOne: ResourceInfo, optionTwo: ResourceInfo): boolean {        
        if (!optionOne || !optionTwo) return true;
        return optionOne.id === optionTwo.id;
    }
}