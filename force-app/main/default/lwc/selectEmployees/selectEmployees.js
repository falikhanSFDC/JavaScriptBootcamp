import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getEmployees from '@salesforce/apex/SelectEmployeesController.getEmployees';
import createEmployeeTrainingRecords from '@salesforce/apex/SelectEmployeesController.createEmployeeTrainingRecords';

export default class SelectEmployees extends LightningElement {
    @api recordId;

    modalShown = false;
    selectedEmployees = [];
    startDate;
    duration;

    managers = new Set();
    roles = new Set();

    managerOptions = [];
    roleOptions = [];

    columns = [
        { label: 'Name', fieldName: 'name' },
        { label: 'Role', fieldName: 'role' },
        { label: 'Manager', fieldName: 'manager' },
    ];

    employees = [];
    data = [];

    // perform any operations that need to happen when the component renders
    connectedCallback() {
        this.retrieveEmployeeData();
    }

    // call apex method to retrieve employee data, and format it to be displayed in the table
    retrieveEmployeeData() {
        getEmployees()
            .then(employees => {
                this.employees = employees;
                console.log(employees);

                this.employees = employees.map(employee => {
                    this.roles.add(employee.Employee_User__r.UserRole.Name); 
                    this.managers.add(employee.Employee_User__r.Manager.Name);

                    return {
                        Id: employee.Id,
                        name: employee.Name,
                        role: employee.Employee_User__r.UserRole.Name,
                        manager: employee.Employee_User__r.Manager.Name,
                    };
                });

                this.data = this.employees;
            })
            .then(() => {
                this.roleOptions = [''].concat(Array.from(this.roles).map(filterMap));
                this.managerOptions = [''].concat(Array.from(this.managers).map(filterMap));
            })
            .catch(e => {
                console.warn(e);
            });

        function filterMap(option) {
            return {
                value: option,
                label: option
            };
        }
    }

    // event handler for selecting multiple rows in the datatable
    getSelectedRows(event) {
        this.selectedEmployees = event.detail.selectedRows;
    }

    // dynamically determines whether there are any selected rows
    get noRowsSelected() {
        return this.selectedEmployees.length === 0;
    }

    // manipulate selected employee data into SObject form, and call apex method to insert them
    submitAssignments() {
        const employeeAssignments = this.selectedEmployees.map(employee => {
            return {
                sobjectType: 'Employee_Training__c',
                Name: employee.Name,
                Start_Date__c: this.startDate,
                Employee__c: employee.Id,
                Training__c: this.recordId
            }
        });

        createEmployeeTrainingRecords({ employeeTrainingRecords: employeeAssignments })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!',
                    message: 'Training assigned to employees.',
                    variant: 'success'
                }));

                this.toggleModal();
            })
            .catch(error => {
                console.warn(error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'There was an issue assigning training.',
                    variant: 'error'
                }));
            });
    }

    // event handler to hide and show rows based on role filter
    filterRoles(event) {
        if(event.detail.value) {
            this.data = this.employees.filter(employee => {
                return employee.role === event.detail.value;
            });
        }
        else {
            this.data = this.employees;
        }
    }

    // event handler to hide and show rows based on manager filter
    filterManagers(event) {
        if(event.detail.value) {
            this.data = this.employees.filter(employee => {
                return employee.manager === event.detail.value;
            });
        }
        else {
            this.data = this.employees;
        }
    }

    // hide and show the modal
    toggleModal() {
        this.modalShown = !this.modalShown;
    }
}