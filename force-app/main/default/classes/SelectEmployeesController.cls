public with sharing class SelectEmployeesController {

    @AuraEnabled
    public static List<Employee__c> getEmployees(){
        try {
            return [
                SELECT Id, Name, Employee_User__r.Manager.Name, Employee_User__r.Primary_Role__c, Employee_User__r.UserRole.Name
                FROM Employee__c
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createEmployeeTrainingRecords(List<Employee_Training__c> employeeTrainingRecords){
        try {
            insert employeeTrainingRecords; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}