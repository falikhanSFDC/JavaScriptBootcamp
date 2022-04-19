import { LightningElement, wire, api, track } from 'lwc';
import getEmployeeTraining from '@salesforce/apex/EmployeeTrainingController.getEmployeeTraining';

export default class EmployeeTrainingStatus extends LightningElement {
    @api recordId;
    loaded = false;
    // planName;
    // startDate;
    // endDate;
    // status;
    // aheadBehind;
    // weekNo;
    // achieved;
    // target;
    // currentStage;
    // progress;
    // @track planStages = [];

    isRendered = false;
    renderedCallback() {
        if (!this.isRendered) {
            this.retrieveEmployeeTrainingData();
            this.isRendered = true;
        }
    }

    @track employeeTraining = {};
    async retrieveEmployeeTrainingData() {

        try {
            const data = await getEmployeeTraining({recordId: this.recordId});
            if (data && data.length > 0) {
                console.log('' + JSON.stringify(data[0]));
                this.employeeTraining = data[0];
            }
        } catch (e) {
            console.warn(e);
        } finally {
            this.loaded = true;
        }
    }

    /*
    @wire(getEmployeePlan, {recordId: '$recordId'})
    wiredPlan({ error, data }) {
        if (data) {
            this.loaded = true;
            console.log(data);
            this.planName = data[0].Name;
            var planStartDate = new Date(data[0].Start_Date__c);
            var planStartDay = planStartDate.getDate() + 1;
            var planStartMonth = planStartDate.getMonth() + 1;
            this.startDate = planStartMonth + '/' + planStartDay + '/' + planStartDate.getFullYear();
            var planEndDate = new Date(data[0].End_Date__c);
            var planEndDay = planEndDate.getDate() + 1;
            var planEndMonth = planEndDate.getMonth() + 1;
            this.endDate = planEndMonth + '/' + planEndDay + '/' + planStartDate.getFullYear();
            this.status = data[0].Status__c;
            // this.aheadBehind = data.aheadBehind;
            // this.weekNo = data.weekNo;
            // this.achieved = data.achieved;
            this.target = data[0].Total_Minutes__c;
            //this.currentStage = data.currentStage;
            if (data[0].Total_Minutes__c == 0) {
                this.progress = 0;
            } else {
                var progressTmp = (data.achieved / data.target) * 100;
                this.progress = progressTmp.toFixed(0);
            }
            //this.planStages = data.planStages;
            this.error = undefined;
            
        } else if (error) {
            this.error = error;
            this.planName = undefined;
        }
    }
    */

    get startDate() {
        if (this.employeeTraining && this.employeeTraining.Start_Date__c) {
            const trainingStartDate = new Date(this.employeeTraining.Start_Date__c);
            return `${trainingStartDate.getMonth() + 1}/${trainingStartDate.getDate() + 1}/${trainingStartDate.getFullYear()}`;
        } else {
            return '';
        }
    }

    get endDate() {
        if (this.employeeTraining && this.employeeTraining.End_Date__c) {
            const trainingEndDate = new Date(this.employeeTraining.End_Date__c);
            return `${trainingEndDate.getMonth() + 1}/${trainingEndDate.getDate() + 1}/${trainingEndDate.getFullYear()}`;
        } else {
            return '';
        }
    }

    get trainingProgress() {
        if (this.employeeTraining.Total_Minutes__c == 0) {
            return 0;
        } else {
            return ((this.employeeTraining.Achieved__c / this.employeeTraining.Target_Minutes__c) * 100).toFixed(2);
        }
    }

    get statusClass() {
        if (this.employeeTraining) {
            switch (this.employeeTraining.Status__c) {
                case 'Ahead of Pace':
                    return 'plan-status-aheadofpace';
                case 'On Pace':
                    return 'plan-status-onpace';
                case 'Slightly Behind':
                    return 'plan-status-slightlybehind';
                case 'Far Behind':
                    return 'plan-status-farbehind';
                default:
                    break;
            }
        } else {
            return '';
        }
    }
}
