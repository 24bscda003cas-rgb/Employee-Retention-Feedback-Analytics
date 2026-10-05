from django.contrib import admin
from .models import EmployeeFeedback

@admin.register(EmployeeFeedback)
class EmployeeFeedbackAdmin(admin.ModelAdmin):
    list_display = ("employee_id", "department", "job_role", "job_satisfaction", "attrition")
    search_fields = ("employee_id", "department", "job_role")
    list_filter = ("department", "attrition", "promotion")
