from django.urls import path

from .views import (
    login_user,
    register_employee,
    predict_retention,
    submit_feedback,
    get_employees,
    get_feedbacks,
)

urlpatterns = [
    path("login/", login_user, name="login_user"),
    path("register/", register_employee, name="register_employee"),
    path("predict/", predict_retention, name="predict_retention"),
    path("feedback/", submit_feedback, name="submit_feedback"),
    path("employees/", get_employees, name="get_employees"),
    path("feedbacks/", get_feedbacks, name="get_feedbacks"),
]