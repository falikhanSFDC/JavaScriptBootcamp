public inherited sharing class EmployeeTrainingTriggerHandler {

    private static final String EMPLOYEE_ACTTIVITY_DEFAULT_STATUS = 'To Do';

    /*
        When a new employee Contact is created, generate a set of Onboarding Activities for them.
    */
    public void CreateEmployeeActivities(List<Employee_Training__c> employeeTrainings) {

        // Gather the Ids of all Training__c records we will need
        // Use a set because multiple employeeTrainings might have same onboarding, but we only need to collect all unique Ids
        Set<ID> trainingIds = new Set<ID>();
        for (Employee_Training__c employeeTraining : employeeTrainings) {
            if (employeeTraining.Training__c != null)  {
                trainingIds.add(employeeTraining.Training__c);
            }
        }

        if (trainingIds.isEmpty()) {
            // None of the new employeeTrainings have an onboarding -- there's nothing further to do.
            return;
        }
        
        // Select all the Training__c records along with all their child Training_Activity__c records
        // Onboarding_Activities__r indicates a relationship where Training__c has related Training_Activity__c records
        // The map constructor will automatically map them by their ID
        Map<Id, Training__c> trainingMap = new Map<Id, Training__c>(
            [
                SELECT
                    Id,
                    (SELECT Id, Activity__c, Activity__r.Name, Activity__r.Total_Minutes__c FROM Training_Activities__r)
                FROM 
                    Training__c
                WHERE
                    Id IN :trainingIds
            ]
        );

        // Build out employeeActivities for each employeeTraining
        List<Employee_Activity__c> employeeActivities = new List<Employee_Activity__c>();
        for (Employee_Training__c employeeTraining : employeeTrainings) {
            if (employeeTraining.Training__c != null) {

                // Retrieve the training from the map
                Training__c training = trainingMap.get(employeeTraining.Training__c);

                // Add each assignment to list of new employeeActivities
                for (Training_Activity__c trainingActivity : training.Training_Activities__r) {
                    employeeActivities.add(
                        new Employee_Activity__c(
                            Name = trainingActivity.Activity__r.Name,
                            Activity__c = trainingActivity.Activity__c, 
                            Employee_Training__c = employeeTraining.Id,
                            Total_Minutes__c = trainingActivity.Activity__r.Total_Minutes__c,
                            Status__c = EMPLOYEE_ACTTIVITY_DEFAULT_STATUS));
                }
            }
        }

        // Insert the employeeActivities -- if there are any
        if (!employeeActivities.isEmpty()) {
            insert employeeActivities;
        }
    }

}