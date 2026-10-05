from django.db import models

class EmployeeFeedback(models.Model):
    employee_id = models.CharField(max_length=30, unique=True)
    department = models.CharField(max_length=100)
    job_role = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    years_at_company = models.FloatField()
    salary_satisfaction = models.PositiveSmallIntegerField(default=3)
    job_satisfaction = models.PositiveSmallIntegerField(default=3)
    workload = models.CharField(max_length=30)
    work_life_balance = models.PositiveSmallIntegerField(default=3)
    promotion = models.BooleanField(default=False)
    manager_support = models.PositiveSmallIntegerField(default=3)
    feedback = models.TextField(blank=True)
    attrition = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.employee_id
