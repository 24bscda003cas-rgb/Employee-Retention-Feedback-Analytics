from pathlib import Path
import pandas as pd

BASE = Path(__file__).resolve().parents[1]
DATA = BASE / "data" / "employee_feedback_sample.csv"
OUT = BASE / "analysis" / "output"
OUT.mkdir(exist_ok=True)

df = pd.read_csv(DATA)

# Basic cleaning
df.columns = df.columns.str.strip()
df = df.drop_duplicates()
df["Attrition_Flag"] = df["Attrition"].map({"Yes": 1, "No": 0})

print("\n--- Dataset Shape ---")
print(df.shape)

print("\n--- Missing Values ---")
print(df.isnull().sum())

print("\n--- Department Summary ---")
department_summary = df.groupby("Department").agg(
    Employees=("Employee_ID", "count"),
    Avg_Salary=("Salary", "mean"),
    Avg_Satisfaction=("Job_Satisfaction", "mean"),
    Attrition_Rate=("Attrition_Flag", "mean"),
).reset_index()
department_summary["Attrition_Rate"] *= 100
print(department_summary)

print("\n--- Attrition Reasons / Feedback ---")
print(df.loc[df["Attrition"] == "Yes", ["Employee_ID", "Feedback"]])

print("\n--- Correlation ---")
numeric = df[[
    "Age", "Salary", "Years_At_Company", "Job_Satisfaction",
    "Work_Life_Balance", "Manager_Support", "Salary_Satisfaction",
    "Attrition_Flag"
]]
print(numeric.corr(numeric_only=True)["Attrition_Flag"].sort_values())

department_summary.to_csv(OUT / "department_summary.csv", index=False)
df[df["Attrition"] == "Yes"][["Employee_ID", "Department", "Feedback"]].to_csv(
    OUT / "attrition_feedback.csv", index=False
)

print(f"\nSaved outputs to: {OUT}")
