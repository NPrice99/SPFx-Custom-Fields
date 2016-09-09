/**
 * @file CustomFieldsWebPartWebPart.ts
 * Custom field implementation sample for the SharePoint Framework (SPfx)
 *
 * @copyright 2016 Olivier Carpentier
 * Released under MIT licence
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField
} from '@microsoft/sp-client-preview';
import * as strings from 'customFieldsWebPartStrings';
import CustomFieldsWebPart, { ICustomFieldsWebPartProps } from './components/CustomFieldsWebPart';
import { ICustomFieldsWebPartWebPartProps } from './ICustomFieldsWebPartWebPartProps';
//Include the PropertyFieldDatePicker component
import { PropertyFieldDatePicker } from './controls/PropertyFieldDatePicker';
//Include the PropertyFieldPeoplePicker component
import { PropertyFieldPeoplePicker } from './controls/PropertyFieldPeoplePicker';

export default class CustomFieldsWebPartWebPart extends BaseClientSideWebPart<ICustomFieldsWebPartWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  public render(): void {
    const element: React.ReactElement<ICustomFieldsWebPartProps> = React.createElement(CustomFieldsWebPart, {
      description: this.properties.description,
      date: this.properties.date,
      date2: this.properties.date2,
      people: this.properties.people
    });

    ReactDom.render(element, this.domElement);
  }

	protected get disableReactivePropertyChanges(): boolean {
		return false;
	}

  private formatDateIso(date: Date): string {
    //example for ISO date formatting
    return date.toISOString();
  }

  private getTodaysDate(): string {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        var mydd='0'+dd
    }

    if(mm<10) {
        var mymm='0'+mm
    }

    var mytoday = yyyy+ '-'+mymm+ '-' + mydd;

    return mytoday;
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyFieldDatePicker('date', {
                  label: strings.DateFieldLabel,
 /*                 initialDate: this.properties.date,  */
                  initialDate: this.getTodaysDate(),
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldDatePicker('date2', {
                  label: strings.DateFieldLabel,
                  initialDate: this.properties.date2,
                  formatDate: this.formatDateIso,
                  onPropertyChange: this.onPropertyChange
                }),
                PropertyFieldPeoplePicker('people', {
                  label: strings.PeopleFieldLabel,
                  initialData: this.properties.people,
                  allowDuplicate: true,
                  onPropertyChange: this.onPropertyChange,
                  context: this.context
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
