trigger EmployeeTrainingTrigger on Employee_Training__c (after insert) {

    EmployeeTrainingTriggerHandler handler = new EmployeeTrainingTriggerHandler();
    handler.CreateEmployeeActivities(Trigger.New);

}