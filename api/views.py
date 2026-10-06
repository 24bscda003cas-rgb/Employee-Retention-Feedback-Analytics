import json
import os

import joblib
import pandas as pd

from django.conf import settings
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import EmployeeFeedback


# =========================================================
# ML MODEL
# =========================================================

def get_ml_model():
    model_path = os.path.join(
        settings.BASE_DIR,
        "ml",
        "retention_model.pkl"
    )

    if not os.path.exists(model_path):
        return None

    return joblib.load(model_path)


# =========================================================
# CREATE ML INPUT
# =========================================================

def create_ml_input(data):
    return pd.DataFrame([{
        "Age": int(data["age"]),
        "Department": data["department"],
        "Job_Role": data["job_role"],
        "Salary": float(data["salary"]),
        "Years_At_Company": float(data["years_at_company"]),
        "Overtime": data["overtime"],
        "Job_Satisfaction": int(data["job_satisfaction"]),
        "Work_Life_Balance": int(data["work_life_balance"]),
        "Promotion": data["promotion"],
        "Manager_Support": int(data["manager_support"]),
        "Salary_Satisfaction": int(data["salary_satisfaction"]),
        "Workload": data["workload"],
    }])


# =========================================================
# GENERATE ML PREDICTION
# =========================================================

def generate_prediction(model, ml_input):

    prediction = model.predict(ml_input)[0]

    probability = model.predict_proba(ml_input)[0][1] * 100

    prediction_label = (
        "Yes" if int(prediction) == 1 else "No"
    )

    if probability < 34:
        risk = "Low"
    elif probability < 67:
        risk = "Medium"
    else:
        risk = "High"

    return (
        prediction_label,
        round(probability, 2),
        risk
    )


# =========================================================
# LOGIN
# =========================================================

@csrf_exempt
def login_user(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST request is allowed"
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        username = data.get("username", "").strip()
        password = data.get("password", "")
        role = data.get("role", "Employee")

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not username or not password:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Username and password are required"
                },
                status=400
            )

        # -------------------------------------------------
        # FIND USER DIRECTLY
        # -------------------------------------------------

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:

            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid username or password"
                },
                status=401
            )

        # -------------------------------------------------
        # CHECK PASSWORD DIRECTLY
        # -------------------------------------------------

        if not user.check_password(password):

            return JsonResponse(
                {
                    "success": False,
                    "message": "Invalid username or password"
                },
                status=401
            )

        # -------------------------------------------------
        # CHECK ACTIVE ACCOUNT
        # -------------------------------------------------

        if not user.is_active:

            return JsonResponse(
                {
                    "success": False,
                    "message": "This account is inactive"
                },
                status=403
            )

        # -------------------------------------------------
        # ADMIN LOGIN
        # -------------------------------------------------

        if role == "Admin":

            if not user.is_staff:

                return JsonResponse(
                    {
                        "success": False,
                        "message": "This account is not an Admin account"
                    },
                    status=403
                )

        # -------------------------------------------------
        # EMPLOYEE LOGIN
        # -------------------------------------------------

        else:

            if user.is_staff:

                return JsonResponse(
                    {
                        "success": False,
                        "message": "Please login as Admin"
                    },
                    status=403
                )

        # -------------------------------------------------
        # SUCCESS RESPONSE
        # -------------------------------------------------

        return JsonResponse(
            {
                "success": True,
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": (
                        "Admin"
                        if user.is_staff
                        else "Employee"
                    )
                }
            }
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON data"
            },
            status=400
        )

    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "message": str(e)
            },
            status=500
        )


# =========================================================
# REGISTER EMPLOYEE
# =========================================================

@csrf_exempt
def register_employee(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST request is allowed"
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not username:

            return JsonResponse(
                {
                    "success": False,
                    "message": "Username is required"
                },
                status=400
            )

        if not email:

            return JsonResponse(
                {
                    "success": False,
                    "message": "Email is required"
                },
                status=400
            )

        if not password:

            return JsonResponse(
                {
                    "success": False,
                    "message": "Password is required"
                },
                status=400
            )

        if len(password) < 6:

            return JsonResponse(
                {
                    "success": False,
                    "message": "Password must contain at least 6 characters"
                },
                status=400
            )

        # -------------------------------------------------
        # CHECK USERNAME
        # -------------------------------------------------

        if User.objects.filter(username=username).exists():

            return JsonResponse(
                {
                    "success": False,
                    "message": "Username already exists"
                },
                status=400
            )

        # -------------------------------------------------
        # CHECK EMAIL
        # -------------------------------------------------

        if User.objects.filter(email=email).exists():

            return JsonResponse(
                {
                    "success": False,
                    "message": "Email already registered"
                },
                status=400
            )

        # -------------------------------------------------
        # CREATE EMPLOYEE
        # -------------------------------------------------

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        user.is_staff = False
        user.is_superuser = False

        user.save()

        return JsonResponse(
            {
                "success": True,
                "message": "Employee registered successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": "Employee"
                }
            }
        )

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON data"
            },
            status=400
        )

    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "message": str(e)
            },
            status=500
        )


# =========================================================
# PREDICT RETENTION
# =========================================================

@csrf_exempt
def predict_retention(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "success": False,
                "message": "Only POST request is allowed"
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        model = get_ml_model()

        if model is None:

            return JsonResponse(
                {
                    "success": False,
                    "message": "ML model not found"
                },
                status=500
            )

        ml_input = create_ml_input(data)

        prediction, probability, risk = generate_prediction(
            model,
            ml_input
        )

        return JsonResponse(
            {
                "success": True,
                "attrition_prediction": prediction,
                "attrition_probability": probability,
                "retention_risk": risk
            }
        )

    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "message": str(e)
            },
            status=400
        )


# =========================================================
# SUBMIT EMPLOYEE FEEDBACK
# =========================================================

@csrf_exempt
def submit_feedback(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "success": False,
                "message": "Only POST request is allowed"
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        required_fields = [
            "employee_name",
            "age",
            "department",
            "job_role",
            "salary",
            "years_at_company",
            "overtime",
            "job_satisfaction",
            "work_life_balance",
            "promotion",
            "manager_support",
            "salary_satisfaction",
            "workload",
            "feedback"
        ]

        # -------------------------------------------------
        # CHECK REQUIRED FIELDS
        # -------------------------------------------------

        for field in required_fields:

            if field not in data:

                return JsonResponse(
                    {
                        "success": False,
                        "message": f"{field} is required"
                    },
                    status=400
                )

        # -------------------------------------------------
        # ML PREDICTION
        # -------------------------------------------------

        model = get_ml_model()

        prediction = None
        probability = None
        risk = None

        if model is not None:

            ml_input = create_ml_input(data)

            prediction, probability, risk = generate_prediction(
                model,
                ml_input
            )

        # -------------------------------------------------
        # SAVE FEEDBACK
        # -------------------------------------------------

        feedback = EmployeeFeedback.objects.create(

            employee_name=data["employee_name"],

            age=int(data["age"]),

            department=data["department"],

            job_role=data["job_role"],

            salary=float(data["salary"]),

            years_at_company=float(
                data["years_at_company"]
            ),

            overtime=data["overtime"],

            job_satisfaction=int(
                data["job_satisfaction"]
            ),

            work_life_balance=int(
                data["work_life_balance"]
            ),

            promotion=data["promotion"],

            manager_support=int(
                data["manager_support"]
            ),

            salary_satisfaction=int(
                data["salary_satisfaction"]
            ),

            workload=data["workload"],

            feedback=data["feedback"],

            attrition_prediction=prediction,

            attrition_probability=probability,

            retention_risk=risk
        )

        # -------------------------------------------------
        # EMPLOYEE DOES NOT RECEIVE ML RESULT
        # -------------------------------------------------

        return JsonResponse(
            {
                "success": True,
                "message": "Feedback submitted successfully",
                "feedback_id": feedback.id
            }
        )

    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "message": str(e)
            },
            status=400
        )


# =========================================================
# GET EMPLOYEES
# =========================================================

@csrf_exempt
def get_employees(request):

    if request.method != "GET":

        return JsonResponse(
            {
                "success": False,
                "message": "Only GET request is allowed"
            },
            status=405
        )

    try:

        # -------------------------------------------------
        # ONLY NORMAL EMPLOYEES
        # -------------------------------------------------

        users = User.objects.filter(
            is_staff=False
        ).order_by("-date_joined")

        employee_list = []

        for user in users:

            employee_list.append(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": (
                        user.email
                        if user.email
                        else "-"
                    ),
                    "joined_date": user.date_joined.strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
                }
            )

        return JsonResponse(
            {
                "success": True,
                "count": len(employee_list),
                "employees": employee_list
            }
        )

    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "message": str(e)
            },
            status=500
        )


# =========================================================
# GET ALL FEEDBACKS
# =========================================================

@csrf_exempt
def get_feedbacks(request):

    if request.method != "GET":

        return JsonResponse(
            {
                "success": False,
                "message": "Only GET request is allowed"
            },
            status=405
        )

    try:

        feedbacks = EmployeeFeedback.objects.all().order_by(
            "-created_at"
        )

        model = get_ml_model()

        feedback_list = []

        for feedback in feedbacks:

            # -------------------------------------------------
            # GENERATE ML RESULT FOR OLD RECORDS
            # -------------------------------------------------

            if (
                not feedback.attrition_prediction
                or feedback.attrition_probability is None
                or not feedback.retention_risk
            ):

                if model is not None:

                    data = {
                        "age": feedback.age,
                        "department": feedback.department,
                        "job_role": feedback.job_role,
                        "salary": feedback.salary,
                        "years_at_company": feedback.years_at_company,
                        "overtime": feedback.overtime,
                        "job_satisfaction": feedback.job_satisfaction,
                        "work_life_balance": feedback.work_life_balance,
                        "promotion": feedback.promotion,
                        "manager_support": feedback.manager_support,
                        "salary_satisfaction": feedback.salary_satisfaction,
                        "workload": feedback.workload,
                    }

                    ml_input = create_ml_input(data)

                    prediction, probability, risk = generate_prediction(
                        model,
                        ml_input
                    )

                    feedback.attrition_prediction = prediction
                    feedback.attrition_probability = probability
                    feedback.retention_risk = risk

                    feedback.save(
                        update_fields=[
                            "attrition_prediction",
                            "attrition_probability",
                            "retention_risk"
                        ]
                    )

            # -------------------------------------------------
            # ADD FEEDBACK TO RESPONSE
            # -------------------------------------------------

            feedback_list.append(
                {
                    "id": feedback.id,
                    "employee_name": feedback.employee_name,
                    "age": feedback.age,
                    "department": feedback.department,
                    "job_role": feedback.job_role,
                    "salary": feedback.salary,
                    "years_at_company": feedback.years_at_company,
                    "overtime": feedback.overtime,
                    "job_satisfaction": feedback.job_satisfaction,
                    "work_life_balance": feedback.work_life_balance,
                    "promotion": feedback.promotion,
                    "manager_support": feedback.manager_support,
                    "salary_satisfaction": feedback.salary_satisfaction,
                    "workload": feedback.workload,
                    "feedback": feedback.feedback,
                    "attrition_prediction": feedback.attrition_prediction,
                    "attrition_probability": feedback.attrition_probability,
                    "retention_risk": feedback.retention_risk,
                    "created_at": feedback.created_at.strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
                }
            )

        return JsonResponse(
            {
                "success": True,
                "count": len(feedback_list),
                "feedbacks": feedback_list
            }
        )

    except Exception as e:

        return JsonResponse(
            {
                "success": False,
                "message": str(e)
            },
            status=500
        )