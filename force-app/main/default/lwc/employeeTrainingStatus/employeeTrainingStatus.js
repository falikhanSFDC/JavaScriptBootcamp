import { LightningElement, wire, api, track } from 'lwc';
import getEmployeePlan from '@salesforce/apex/EmployeeTrainingController.getEmployeeTraining';

export default class EmployeeTrainingStatus extends LightningElement {
    @api recordId;
    loaded = false;
    @track planName;
    @track startDate;
    @track endDate;
    @track status;
    @track aheadBehind;
    @track weekNo;
    @track achieved;
    @track target;
    @track currentStage;
    @track progress;
    @track planStages = [];

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
            /*this.aheadBehind = data.aheadBehind;
            this.weekNo = data.weekNo;
            this.achieved = data.achieved;*/
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

    get isFarBehind() {
        return this.status == 'Far Behind' ? true : false;
    }
    get isSlightlyBehind() {
        return this.status == 'Slightly Behind' ? true : false;
    }
    get isOnPace() {
        return this.status == 'On Pace' ? true : false;
    }
    get isAheadOfPace() {
        return this.status == 'Ahead of Pace' ? true : false;
    }
}