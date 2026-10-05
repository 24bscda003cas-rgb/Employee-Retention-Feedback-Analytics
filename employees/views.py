from django.shortcuts import render, redirect
from .models import EmployeeFeedback

def home(request):
    return render(request, "home.html")

def feedback(request):
    if request.method == "POST":
        EmployeeFeedback.objects.create(
            employee_id=request.POST["employee_id"],
            department=request.POST["department"],
            job_role=request.POST["job_role"],
            age=request.POST["age"],
            years_at_company=request.POST["years_at_company"],
            salary_satisfaction=request.POST["salary_satisfaction"],
            job_satisfaction=request.POST["job_satisfaction"],
            workload=request.POST["workload"],
            work_life_balance=request.POST["work_life_balance"],
            promotion="promotion" in request.POST,
            manager_support=request.POST["manager_support"],
            feedback=request.POST.get("feedback", ""),
        )
        return redirect("dashboard")
    return render(request, "feedback.html")

def dashboard(request):
    qs = EmployeeFeedback.objects.all()
    total = qs.count()
    attrition = qs.filter(attrition=True).count()
    return render(request, "dashboard.html", {
        "total": total,
        "attrition": attrition,
        "continue_count": total - attrition,
    })
