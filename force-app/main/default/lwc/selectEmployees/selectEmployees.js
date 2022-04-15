import { LightningElement } from 'lwc';

export default class SelectEmployees extends LightningElement {

    // perform any operations that need to happen when the component renders
    connectedCallback() {
    }

    // call apex method to retrieve employee data, and format it to be displayed in the table
    retrieveEmployeeData() {
    }

    // event handler for selecting multiple rows in the datatable
    getSelectedRows(event) {
    }

    // dynamically determines whether there are any selected rows
    get noRowsSelected() {
    }

    // manipulate selected employee data into SObject form, and call apex method to insert them
    submitAssignments() {
    }

    // event handler to hide and show rows based on role filter
    filterRoles(event) {
    }

    // event handler to hide and show rows based on manager filter
    filterManagers(event) {
    }

    // hide and show the modal
    toggleModal() {
    }
}