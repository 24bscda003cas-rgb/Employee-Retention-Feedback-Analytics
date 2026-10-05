from django.urls import path
from . import views
urlpatterns = [
    path("", views.home, name="home"),
    path("feedback/", views.feedback, name="feedback"),
    path("dashboard/", views.dashboard, name="dashboard"),
]
