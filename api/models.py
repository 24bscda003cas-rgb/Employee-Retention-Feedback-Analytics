from django.db import models


class EmployeeFeedback(models.Model):

    employee_name = models.CharField(max_length=150)

    age = models.IntegerField()

    department = models.CharField(max_length=100)

    job_role = models.CharField(max_length=100)

    salary = models.FloatField()

    years_at_company = models.FloatField()

    overtime = models.CharField(max_length=10)

    job_satisfaction = models.IntegerField()

    work_life_balance = models.IntegerField()

    promotion = models.CharField(max_length=10)

    manager_support = models.IntegerField()

    salary_satisfaction = models.IntegerField()

    workload = models.CharField(max_length=20)

    feedback = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    # ML result — admin side-la use pannuvom
    attrition_prediction = models.CharField(
        max_length=10,
        blank=True,
        null=True
    )

    attrition_probability = models.FloatField(
        blank=True,
        null=True
    )

    retention_risk = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.employee_name