import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib

# Load CSV
df = pd.read_csv("data/employee_feedback_sample.csv")

# Input features
X = df[
    [
        "Age",
        "Department",
        "Job_Role",
        "Salary",
        "Years_At_Company",
        "Overtime",
        "Job_Satisfaction",
        "Work_Life_Balance",
        "Promotion",
        "Manager_Support",
        "Salary_Satisfaction",
        "Workload",
    ]
]

# Target
y = df["Attrition"].map({"Yes": 1, "No": 0})

# Categorical columns
categorical_columns = [
    "Department",
    "Job_Role",
    "Overtime",
    "Promotion",
    "Workload",
]

# Numerical columns
numerical_columns = [
    "Age",
    "Salary",
    "Years_At_Company",
    "Job_Satisfaction",
    "Work_Life_Balance",
    "Manager_Support",
    "Salary_Satisfaction",
]

# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_columns,
        )
    ],
    remainder="passthrough",
)

# Random Forest
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# Complete ML pipeline
pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model),
    ]
)

# Train model
pipeline.fit(X, y)

# Save model
joblib.dump(pipeline, "ml/retention_model.pkl")

print("Model trained successfully!")
print("Model saved as ml/retention_model.pkl")