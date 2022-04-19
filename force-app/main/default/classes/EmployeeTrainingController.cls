public with sharing class EmployeeTrainingController {

    @AuraEnabled
    public static List<Employee_Training__c> getEmployeeTraining(String recordId){
        try {
            return [
                SELECT 
                    Id, Name, Start_Date__c, End_Date__c, Status__c, Duration__c, Days_in_Training__c,
                    Ahead_Behind__c, Actual_Minutes__c, Achieved__c, Target_Minutes__c, Total_Minutes__c
                FROM 
                    Employee_Training__c 
                WHERE 
                    Id = :recordId
            ];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
