public with sharing class EmployeeTrainingController {

     
    @AuraEnabled(cacheable=true)
    public static  List<Employee_Training__c> getEmployeeTraining (String recordId) {
        return [SELECT Id, Name, Start_Date__c, End_Date__c, Status__c, Total_Minutes__c
                FROM Employee_Training__c WHERE Id = :recordId];
        /*
        Onboarding_Plan__c plan = [
            SELECT Id, Name, Start_Date__c, End_Date__c, Status__c, 
            Ahead_Behind__c, Week_No__c, Achieved__c, Target__c
            FROM Onboarding_Plan__c WHERE ID =: recordId
        ];

        
        achieved = total

        Add:
        ahead_behind__c
        target mintues

        */
    }
}