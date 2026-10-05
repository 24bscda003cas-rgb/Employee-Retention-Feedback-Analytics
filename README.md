# Employee Retention & Feedback Analytics System

## Project Objective
A web-based analytics system that collects employee feedback and analyzes factors related to employee retention and attrition.

## Main Modules
1. Employee feedback collection
2. PostgreSQL database storage
3. CSV dataset for analytics/ML
4. Pandas-based data cleaning and analysis
5. Scikit-learn attrition prediction
6. Django web application
7. Chart.js analytics dashboard

## Technology Stack
Python, Django, PostgreSQL, Pandas, NumPy, Scikit-learn, Chart.js, Bootstrap, HTML/CSS, Git/GitHub.

## Folder Structure
- `data/` - CSV dataset
- `analysis/` - Pandas analysis scripts
- `ml/` - machine learning training and prediction scripts
- `employees/` - Django application
- `retention_project/` - Django project configuration
- `templates/` - web pages
- `requirements.txt` - Python packages

## Setup
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## PostgreSQL
Create a database named `employee_retention`, then update `retention_project/settings.py` with your PostgreSQL username and password.

## Run Pandas Analysis
```bash
python analysis/analyze_data.py
```

The script reads `data/employee_feedback_sample.csv`, cleans the data, prints summary statistics, and saves analysis outputs to `analysis/output/`.

## Train ML Model
```bash
python ml/train_model.py
```

The trained model is saved in `ml/models/`.

## Important
The sample data is fictional/demo data. For a real company deployment, use authorized employee data, appropriate access controls, privacy protections, and secure authentication.
