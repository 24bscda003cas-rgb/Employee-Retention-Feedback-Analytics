import pandas as pd
import joblib

# Load trained model
model = joblib.load("ml/retention_model.pkl")

# Get employee details from user
age = int(input("Age: "))
department = input("Department: ")
job_role = input("Job Role: ")
salary = float(input("Salary: "))
years = float(input("Years At Company: "))
overtime = input("Overtime (Yes/No): ")
job_satisfaction = int(input("Job Satisfaction (1-5): "))
work_life_balance = int(input("Work Life Balance (1-5): "))
promotion = input("Promotion (Yes/No): ")
manager_support = int(input("Manager Support (1-5): "))
salary_satisfaction = int(input("Salary Satisfaction (1-5): "))
workload = input("Workload (Low/Medium/High): ")

# Create employee data
employee = pd.DataFrame([{
    "Age": age,
    "Department": department,
    "Job_Role": job_role,
    "Salary": salary,
    "Years_At_Company": years,
    "Overtime": overtime,
    "Job_Satisfaction": job_satisfaction,
    "Work_Life_Balance": work_life_balance,
    "Promotion": promotion,
    "Manager_Support": manager_support,
    "Salary_Satisfaction": salary_satisfaction,
    "Workload": workload
}])

# Prediction
prediction = model.predict(employee)[0]
probability = model.predict_proba(employee)[0]

attrition_probability = probability[1] * 100

# Risk level
if attrition_probability < 34:
    risk = "Low"
elif attrition_probability < 67:
    risk = "Medium"
else:
    risk = "High"

print("\n==============================")
print("EMPLOYEE RETENTION PREDICTION")
print("==============================")
print("Attrition Prediction:", "Yes" if prediction == 1 else "No")
print(f"Attrition Probability: {attrition_probability:.2f}%")
print("Retention Risk:", risk)
print("==============================")