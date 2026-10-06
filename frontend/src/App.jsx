import { useEffect, useState } from "react";
import "./App.css";

const API = "https://employee-retention-feedback-analytics.onrender.com/api";


// ======================================================
// LOGIN MODAL
// ======================================================

function LoginModal({ onClose, onLogin, onRegister }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        `${API}/login/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: username.trim(),
            password,
            role,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok || !data.success) {

        setError(
          data.message ||
          data.error ||
          "Invalid username or password."
        );

        return;
      }


      // IMPORTANT:
      // Backend returns user inside data.user
      onLogin(data);

    } catch (error) {

      setError(
        "Unable to connect to Django server."
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>


        <h2>Login</h2>

        <p className="modal-subtitle">
          Employee Retention Analytics
        </p>


        <form onSubmit={handleLogin}>

          <label>
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Enter username"
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            required
          />


          <label>
            Role
          </label>

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >
            <option value="Employee">
              Employee
            </option>

            <option value="Admin">
              Admin
            </option>
          </select>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          <button
            type="submit"
            className="primary-btn full-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p className="register-link">

          Don't have an account?{" "}

          <button
            className="link-btn"
            onClick={onRegister}
          >
            Register
          </button>

        </p>

      </div>

    </div>
  );
}


// ======================================================
// REGISTER MODAL
// ======================================================

function RegisterModal({ onClose, onLogin }) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] =
    useState(false);


  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    if (
      password !== confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        `${API}/register/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            username:
              username.trim(),

            email:
              email.trim(),

            password,

          }),
        }
      );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        setError(
          data.message ||
          data.error ||
          "Registration failed."
        );

        return;
      }


      setSuccess(
        "Registration successful! You can login now."
      );


      setTimeout(() => {

        onLogin();

      }, 1000);


    } catch (error) {

      setError(
        "Unable to connect to Django server."
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>


        <h2>
          Employee Registration
        </h2>


        <p className="modal-subtitle">
          Create your employee account
        </p>


        <form
          onSubmit={handleRegister}
        >

          <label>
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Enter username"
            required
          />


          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter email"
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Create password"
            required
          />


          <label>
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            placeholder="Confirm password"
            required
          />


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          {success && (
            <div className="success-message">
              {success}
            </div>
          )}


          <button
            type="submit"
            className="primary-btn full-btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Register"}
          </button>

        </form>

      </div>

    </div>
  );
}


// ======================================================
// NAVBAR
// ======================================================

function Navbar({
  user,
  onLogin,
  onLogout,
}) {

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        📊 Employee Retention Analytics
      </div>


      <div className="navbar-right">

        {user ? (

          <>

            <span className="welcome-user">
              👋 {user.username}
            </span>


            <button
              className="logout-btn"
              onClick={onLogout}
            >
              Logout
            </button>

          </>

        ) : (

          <button
            className="primary-btn"
            onClick={onLogin}
          >
            Login
          </button>

        )}

      </div>

    </nav>
  );
}


// ======================================================
// HOME PAGE
// ======================================================

function HomePage({
  onLogin,
  onRegister,
}) {

  return (
    <div className="home-page">

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-badge">
            🤖 AI Powered Employee Analytics
          </span>


          <h1>

            Employee Retention
            <br />

            Feedback Analytics

          </h1>


          <p>

            Collect employee feedback,
            analyze workplace factors and
            identify employee retention risks
            using Machine Learning.

          </p>


          <div className="hero-buttons">

            <button
              className="primary-btn large-btn"
              onClick={onLogin}
            >
              Login
            </button>


            <button
              className="secondary-btn large-btn"
              onClick={onRegister}
            >
              Register
            </button>

          </div>

        </div>

      </section>


      <section className="features-section">

        <div className="feature-card">

          <div className="feature-icon">
            📝
          </div>

          <h3>
            Employee Feedback
          </h3>

          <p>
            Employees can securely submit
            feedback about their workplace
            experience.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            🤖
          </div>

          <h3>
            Machine Learning
          </h3>

          <p>
            Random Forest analyzes employee
            factors and predicts attrition risk.
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            📊
          </div>

          <h3>
            Analytics Dashboard
          </h3>

          <p>
            Admin can monitor feedback,
            retention and risk analytics.
          </p>

        </div>

      </section>

    </div>
  );
}


// ======================================================
// EMPLOYEE DASHBOARD
// ======================================================

function EmployeeDashboard({
  user,
  activePage,
  setActivePage,
}) {

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>

          <h1>
            Employee Dashboard
          </h1>

          <p>
            Welcome, {user.username}
          </p>

        </div>

      </div>


      <div className="dashboard-cards">

        <div
          className="dashboard-card clickable"
          onClick={() =>
            setActivePage("feedback")
          }
        >

          <div className="card-icon">
            📝
          </div>

          <h3>
            Submit Feedback
          </h3>

          <p>
            Share your workplace experience
            and feedback.
          </p>

          <button className="primary-btn">
            Give Feedback
          </button>

        </div>


        <div
          className="dashboard-card clickable"
          onClick={() =>
            setActivePage("profile")
          }
        >

          <div className="card-icon">
            👤
          </div>

          <h3>
            My Profile
          </h3>

          <p>
            View your employee account
            information.
          </p>

          <button className="secondary-btn">
            View Profile
          </button>

        </div>


        <div
          className="dashboard-card clickable"
          onClick={() =>
            setActivePage("status")
          }
        >

          <div className="card-icon">
            📌
          </div>

          <h3>
            Feedback Status
          </h3>

          <p>
            Check your feedback submission
            status.
          </p>

          <button className="secondary-btn">
            View Status
          </button>

        </div>

      </div>


      {activePage === "feedback" && (

        <FeedbackForm
          user={user}
          onBack={() =>
            setActivePage("dashboard")
          }
        />

      )}


      {activePage === "profile" && (

        <EmployeeProfile
          user={user}
          onBack={() =>
            setActivePage("dashboard")
          }
        />

      )}


      {activePage === "status" && (

        <EmployeeStatus
          user={user}
          onBack={() =>
            setActivePage("dashboard")
          }
        />

      )}

    </div>
  );
}


// ======================================================
// EMPLOYEE PROFILE
// ======================================================

function EmployeeProfile({
  user,
  onBack,
}) {

  return (
    <div className="content-section">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back
      </button>


      <h2>
        My Profile
      </h2>


      <div className="profile-box">

        <div className="profile-row">

          <strong>
            Username
          </strong>

          <span>
            {user.username}
          </span>

        </div>


        <div className="profile-row">

          <strong>
            Email
          </strong>

          <span>
            {user.email || "-"}
          </span>

        </div>


        <div className="profile-row">

          <strong>
            Role
          </strong>

          <span>
            Employee
          </span>

        </div>


        <div className="profile-row">

          <strong>
            Account Status
          </strong>

          <span className="status-active">
            Active
          </span>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// EMPLOYEE STATUS
// ======================================================

function EmployeeStatus({
  onBack,
}) {

  return (
    <div className="content-section">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back
      </button>


      <h2>
        Feedback Status
      </h2>


      <div className="status-box">

        <div className="status-icon">
          ✅
        </div>


        <h3>
          Feedback system is active
        </h3>


        <p>
          Your submitted feedback is securely
          stored in the system.
        </p>


        <p>
          Retention prediction results are
          available only to authorized
          administrators.
        </p>

      </div>

    </div>
  );
}


// ======================================================
// FEEDBACK FORM
// ======================================================

function FeedbackForm({
  user,
  onBack,
}) {

  const initialForm = {

    employee_name:
      user.username,

    age: "",

    department:
      "IT",

    job_role:
      "Developer",

    salary: "",

    years_at_company:
      "",

    overtime:
      "No",

    job_satisfaction:
      "3",

    work_life_balance:
      "3",

    promotion:
      "No",

    manager_support:
      "3",

    salary_satisfaction:
      "3",

    workload:
      "Medium",

    feedback:
      "",
  };


  const [form, setForm] =
    useState(initialForm);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);


    try {

      const response =
        await fetch(
          `${API}/feedback/`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              ...form,

              age:
                Number(form.age),

              salary:
                Number(form.salary),

              years_at_company:
                Number(
                  form.years_at_company
                ),

              job_satisfaction:
                Number(
                  form.job_satisfaction
                ),

              work_life_balance:
                Number(
                  form.work_life_balance
                ),

              manager_support:
                Number(
                  form.manager_support
                ),

              salary_satisfaction:
                Number(
                  form.salary_satisfaction
                ),

            }),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        setError(
          data.message ||
          data.error ||
          "Feedback submission failed."
        );

        return;
      }


      setMessage(
        "Feedback submitted successfully!"
      );


      setForm(initialForm);


    } catch (error) {

      setError(
        "Unable to connect to Django server."
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="feedback-section">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back
      </button>


      <h2>
        Employee Feedback
      </h2>


      <p>
        Please provide your workplace
        experience honestly.
      </p>


      <form
        className="feedback-form"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">

          <div>

            <label>
              Employee Name
            </label>

            <input
              name="employee_name"
              value={form.employee_name}
              onChange={handleChange}
              required
            />

          </div>


          <div>

            <label>
              Age
            </label>

            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              min="18"
              required
            />

          </div>


          <div>

            <label>
              Department
            </label>

            <select
              name="department"
              value={form.department}
              onChange={handleChange}
            >

              <option>
                IT
              </option>

              <option>
                HR
              </option>

              <option>
                Finance
              </option>

              <option>
                Sales
              </option>

              <option>
                Marketing
              </option>

              <option>
                Operations
              </option>

            </select>

          </div>


          <div>

            <label>
              Job Role
            </label>

            <select
              name="job_role"
              value={form.job_role}
              onChange={handleChange}
            >

              <option>
                Developer
              </option>

              <option>
                Analyst
              </option>

              <option>
                Tester
              </option>

              <option>
                Manager
              </option>

              <option>
                Recruiter
              </option>

              <option>
                Executive
              </option>

              <option>
                Support
              </option>

            </select>

          </div>


          <div>

            <label>
              Salary
            </label>

            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="Enter salary"
              required
            />

          </div>


          <div>

            <label>
              Years at Company
            </label>

            <input
              type="number"
              step="0.1"
              name="years_at_company"
              value={
                form.years_at_company
              }
              onChange={handleChange}
              required
            />

          </div>


          <div>

            <label>
              Overtime
            </label>

            <select
              name="overtime"
              value={form.overtime}
              onChange={handleChange}
            >

              <option>
                Yes
              </option>

              <option>
                No
              </option>

            </select>

          </div>


          <div>

            <label>
              Job Satisfaction
            </label>

            <select
              name="job_satisfaction"
              value={
                form.job_satisfaction
              }
              onChange={handleChange}
            >

              <option value="1">
                1 - Very Low
              </option>

              <option value="2">
                2 - Low
              </option>

              <option value="3">
                3 - Average
              </option>

              <option value="4">
                4 - High
              </option>

              <option value="5">
                5 - Very High
              </option>

            </select>

          </div>


          <div>

            <label>
              Work Life Balance
            </label>

            <select
              name="work_life_balance"
              value={
                form.work_life_balance
              }
              onChange={handleChange}
            >

              <option value="1">
                1 - Very Low
              </option>

              <option value="2">
                2 - Low
              </option>

              <option value="3">
                3 - Average
              </option>

              <option value="4">
                4 - High
              </option>

              <option value="5">
                5 - Very High
              </option>

            </select>

          </div>


          <div>

            <label>
              Promotion
            </label>

            <select
              name="promotion"
              value={form.promotion}
              onChange={handleChange}
            >

              <option>
                Yes
              </option>

              <option>
                No
              </option>

            </select>

          </div>


          <div>

            <label>
              Manager Support
            </label>

            <select
              name="manager_support"
              value={
                form.manager_support
              }
              onChange={handleChange}
            >

              <option value="1">
                1 - Very Low
              </option>

              <option value="2">
                2 - Low
              </option>

              <option value="3">
                3 - Average
              </option>

              <option value="4">
                4 - High
              </option>

              <option value="5">
                5 - Very High
              </option>

            </select>

          </div>


          <div>

            <label>
              Salary Satisfaction
            </label>

            <select
              name="salary_satisfaction"
              value={
                form.salary_satisfaction
              }
              onChange={handleChange}
            >

              <option value="1">
                1 - Very Low
              </option>

              <option value="2">
                2 - Low
              </option>

              <option value="3">
                3 - Average
              </option>

              <option value="4">
                4 - High
              </option>

              <option value="5">
                5 - Very High
              </option>

            </select>

          </div>


          <div>

            <label>
              Workload
            </label>

            <select
              name="workload"
              value={form.workload}
              onChange={handleChange}
            >

              <option>
                Low
              </option>

              <option>
                Medium
              </option>

              <option>
                High
              </option>

            </select>

          </div>

        </div>


        <label>
          Feedback
        </label>


        <textarea
          name="feedback"
          value={form.feedback}
          onChange={handleChange}
          placeholder="Enter your feedback..."
          rows="5"
          required
        />


        {error && (

          <div className="error-message">
            {error}
          </div>

        )}


        {message && (

          <div className="success-message">
            {message}
          </div>

        )}


        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
        >

          {loading
            ? "Submitting..."
            : "Submit Feedback"}

        </button>

      </form>

    </div>
  );
}


// ======================================================
// ADMIN DASHBOARD
// ======================================================

function AdminDashboard({
  activePage,
  setActivePage,
}) {

  const [employees, setEmployees] =
    useState([]);

  const [feedbacks, setFeedbacks] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const loadEmployees = async () => {

    try {

      const response =
        await fetch(
          `${API}/employees/`
        );

      const data =
        await response.json();


      if (data.success) {

        setEmployees(
          data.employees || []
        );

      } else {

        setError(
          data.message ||
          "Unable to load employees."
        );

      }

    } catch (error) {

      setError(
        "Unable to load employees."
      );

    }
  };


  const loadFeedbacks = async () => {

    setLoading(true);
    setError("");


    try {

      const response =
        await fetch(
          `${API}/feedbacks/`
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        setError(
          data.message ||
          data.error ||
          "Unable to load feedback."
        );

        return;
      }


      setFeedbacks(
        data.feedbacks || []
      );


    } catch (error) {

      setError(
        "Unable to connect to Django server."
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    loadEmployees();
    loadFeedbacks();

  }, []);


  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Employee retention monitoring
            and analytics
          </p>

        </div>

      </div>


      <div className="admin-cards">

        <div className="admin-card">

          <div className="admin-card-icon">
            👥
          </div>

          <h3>
            Employee Management
          </h3>

          <p>
            View registered employees.
          </p>

          <button
            className="primary-btn"
            onClick={() =>
              setActivePage("employees")
            }
          >
            View Employees
          </button>

        </div>


        <div className="admin-card">

          <div className="admin-card-icon">
            📊
          </div>

          <h3>
            Feedback Analytics
          </h3>

          <p>
            Analyze employee feedback.
          </p>

          <button
            className="secondary-btn"
            onClick={() =>
              setActivePage("analytics")
            }
          >
            View Analytics
          </button>

        </div>


        <div className="admin-card">

          <div className="admin-card-icon">
            🤖
          </div>

          <h3>
            ML Predictions
          </h3>

          <p>
            View employee retention
            predictions.
          </p>

          <button
            className="secondary-btn"
            onClick={() =>
              setActivePage("predictions")
            }
          >
            View Predictions
          </button>

        </div>

      </div>


      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {loading && (

        <div className="loading-box">
          Loading analytics...
        </div>

      )}


      {activePage === "employees" && (

        <EmployeeManagement
          employees={employees}
          onBack={() =>
            setActivePage("dashboard")
          }
        />

      )}


      {activePage === "analytics" && (

        <AnalyticsDashboard
          feedbacks={feedbacks}
          onBack={() =>
            setActivePage("dashboard")
          }
        />

      )}


      {activePage === "predictions" && (

        <PredictionTable
          feedbacks={feedbacks}
          onBack={() =>
            setActivePage("dashboard")
          }
        />

      )}

    </div>
  );
}


// ======================================================
// EMPLOYEE MANAGEMENT
// ======================================================

function EmployeeManagement({
  employees,
  onBack,
}) {

  return (
    <div className="content-section">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back
      </button>


      <h2>
        Employee Management
      </h2>


      <p>
        Registered employee accounts
      </p>


      <div className="employee-count">

        Total Employees{" "}

        <strong>
          {employees.length}
        </strong>

      </div>


      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>
                ID
              </th>

              <th>
                Username
              </th>

              <th>
                Email
              </th>

              <th>
                Joined Date
              </th>

            </tr>

          </thead>


          <tbody>

            {employees.length === 0 ? (

              <tr>

                <td colSpan="4">
                  No employees registered.
                </td>

              </tr>

            ) : (

              employees.map(
                (employee) => (

                  <tr
                    key={employee.id}
                  >

                    <td>
                      {employee.id}
                    </td>


                    <td>
                      <strong>
                        {employee.username}
                      </strong>
                    </td>


                    <td>
                      {employee.email || "-"}
                    </td>


                    <td>
                      {employee.joined_date || "-"}
                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}


// ======================================================
// ANALYTICS DASHBOARD
// ======================================================

function AnalyticsDashboard({
  feedbacks,
  onBack,
}) {

  const total =
    feedbacks.length;


  const attritionYes =
    feedbacks.filter(
      (item) =>
        item.attrition_prediction ===
        "Yes"
    ).length;


  const attritionNo =
    feedbacks.filter(
      (item) =>
        item.attrition_prediction ===
        "No"
    ).length;


  const highRisk =
    feedbacks.filter(
      (item) =>
        item.retention_risk ===
        "High"
    ).length;


  const mediumRisk =
    feedbacks.filter(
      (item) =>
        item.retention_risk ===
        "Medium"
    ).length;


  const lowRisk =
    feedbacks.filter(
      (item) =>
        item.retention_risk ===
        "Low"
    ).length;


  const avgSatisfaction =
    total > 0
      ? (
          feedbacks.reduce(
            (sum, item) =>
              sum +
              Number(
                item.job_satisfaction ||
                0
              ),
            0
          ) / total
        ).toFixed(1)
      : "0.0";


  const overtimeYes =
    feedbacks.filter(
      (item) =>
        item.overtime === "Yes"
    ).length;


  const overtimeNo =
    feedbacks.filter(
      (item) =>
        item.overtime === "No"
    ).length;


  const departments = {};


  feedbacks.forEach(
    (item) => {

      const dept =
        item.department ||
        "Unknown";


      if (!departments[dept]) {

        departments[dept] = 0;

      }


      departments[dept]++;

    }
  );


  const satisfaction = {

    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,

  };


  feedbacks.forEach(
    (item) => {

      const value =
        Number(
          item.job_satisfaction
        );


      if (
        satisfaction[value] !==
        undefined
      ) {

        satisfaction[value]++;

      }

    }
  );


  const maxDepartment =
    Math.max(
      ...Object.values(
        departments
      ),
      1
    );


  const maxSatisfaction =
    Math.max(
      ...Object.values(
        satisfaction
      ),
      1
    );


  const riskPercentage = (
    count
  ) => {

    return total > 0
      ? Math.round(
          (count / total) *
            100
        )
      : 0;

  };


  return (
    <div className="analytics-dashboard">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to Dashboard
      </button>


      <div className="analytics-title">

        <h2>
          Employee Retention Analytics
        </h2>

        <p>
          Detailed analysis generated
          from actual employee feedback
          and machine-learning results.
        </p>

      </div>


      {/* SUMMARY */}

      <div className="analytics-cards">

        <div className="analytics-card">

          <span className="analytics-icon">
            👥
          </span>

          <div>

            <h3>
              {total}
            </h3>

            <p>
              Total Feedback
            </p>

          </div>

        </div>


        <div className="analytics-card">

          <span className="analytics-icon">
            🚨
          </span>

          <div>

            <h3>
              {highRisk}
            </h3>

            <p>
              High Risk
            </p>

            <small>
              {riskPercentage(highRisk)}%
              of records
            </small>

          </div>

        </div>


        <div className="analytics-card">

          <span className="analytics-icon">
            ⚠️
          </span>

          <div>

            <h3>
              {mediumRisk}
            </h3>

            <p>
              Medium Risk
            </p>

            <small>
              {riskPercentage(mediumRisk)}%
              of records
            </small>

          </div>

        </div>


        <div className="analytics-card">

          <span className="analytics-icon">
            🟢
          </span>

          <div>

            <h3>
              {lowRisk}
            </h3>

            <p>
              Low Risk
            </p>

            <small>
              {riskPercentage(lowRisk)}%
              of records
            </small>

          </div>

        </div>


        <div className="analytics-card">

          <span className="analytics-icon">
            ⭐
          </span>

          <div>

            <h3>
              {avgSatisfaction}/5
            </h3>

            <p>
              Job Satisfaction
            </p>

          </div>

        </div>

      </div>


      {/* AI INSIGHT */}

      <div className="ai-insight-card">

        <div className="ai-insight-icon">
          🤖
        </div>

        <div>

          <h3>
            AI RETENTION INSIGHT
          </h3>


          {mediumRisk > 0 ? (

            <p>

              💡 Monitor Medium-Risk
              Employees

              <br />

              {mediumRisk} employee
              {mediumRisk !== 1
                ? "s"
                : ""}{" "}
              {mediumRisk !== 1
                ? "are"
                : "is"}{" "}
              currently classified
              as Medium Risk. Regular
              feedback and manager
              support can help improve
              retention.

            </p>

          ) : highRisk > 0 ? (

            <p>

              🚨 Immediate attention
              recommended for{" "}
              {highRisk} high-risk
              employee
              {highRisk !== 1
                ? "s"
                : ""}.

            </p>

          ) : (

            <p>

              ✅ Current feedback records
              show no high or medium
              retention risk.

            </p>

          )}

        </div>

      </div>


      {/* ATTRITION + RISK */}

      <div className="analytics-grid">

        <div className="chart-card">

          <h3>
            Attrition Prediction
          </h3>


          <div className="bar-row">

            <span>
              🔴 Attrition Risk
            </span>

            <div className="bar-background">

              <div
                className="bar-fill"
                style={{
                  width:
                    total > 0
                      ? `${
                          (attritionYes /
                            total) *
                          100
                        }%`
                      : "0%",
                }}
              />

            </div>

            <strong>
              {attritionYes}
            </strong>

          </div>


          <div className="bar-row">

            <span>
              🟢 Retention
            </span>

            <div className="bar-background">

              <div
                className="bar-fill"
                style={{
                  width:
                    total > 0
                      ? `${
                          (attritionNo /
                            total) *
                          100
                        }%`
                      : "0%",
                }}
              />

            </div>

            <strong>
              {attritionNo}
            </strong>

          </div>

        </div>


        <div className="chart-card">

          <h3>
            Retention Risk
          </h3>


          <div className="risk-item">

            <span>
              🎯 High
            </span>

            <strong>
              {highRisk}{" "}
              ({riskPercentage(highRisk)}%)
            </strong>

          </div>


          <div className="risk-item">

            <span>
              ⚠️ Medium
            </span>

            <strong>
              {mediumRisk}{" "}
              ({riskPercentage(mediumRisk)}%)
            </strong>

          </div>


          <div className="risk-item">

            <span>
              🟢 Low
            </span>

            <strong>
              {lowRisk}{" "}
              ({riskPercentage(lowRisk)}%)
            </strong>

          </div>

        </div>

      </div>


      {/* WORKPLACE HEALTH */}

      <div className="chart-card full-chart">

        <h3>
          ❤️ Workplace Health
        </h3>


        <div className="wellbeing-grid">

          <div className="wellbeing-box">

            <span>
              ⭐ Job Satisfaction
            </span>

            <strong>
              {avgSatisfaction}/5
            </strong>

          </div>


          <div className="wellbeing-box">

            <span>
              ⚖️ Work-Life Balance
            </span>

            <strong>

              {total > 0
                ? (
                    feedbacks.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          item.work_life_balance ||
                          0
                        ),
                      0
                    ) / total
                  ).toFixed(1)
                : "0.0"}

              /5

            </strong>

          </div>


          <div className="wellbeing-box">

            <span>
              🤝 Manager Support
            </span>

            <strong>

              {total > 0
                ? (
                    feedbacks.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          item.manager_support ||
                          0
                        ),
                      0
                    ) / total
                  ).toFixed(1)
                : "0.0"}

              /5

            </strong>

          </div>

        </div>

      </div>


      {/* OVERTIME */}

      <div className="chart-card full-chart">

        <h3>
          ⏰ Overtime Analysis
        </h3>


        <div className="overtime-grid">

          <div className="overtime-box">

            <span>
              Overtime Yes
            </span>

            <strong>
              {overtimeYes}
            </strong>

            <small>

              {riskPercentage(
                overtimeYes
              )}%

            </small>

          </div>


          <div className="overtime-box">

            <span>
              Overtime No
            </span>

            <strong>
              {overtimeNo}
            </strong>

            <small>

              {riskPercentage(
                overtimeNo
              )}%

            </small>

          </div>

        </div>

      </div>


      {/* DEPARTMENT */}

      <div className="chart-card full-chart">

        <h3>
          🏢 Department-wise Feedback
        </h3>


        {Object.keys(departments)
          .length === 0 ? (

          <p>
            No department data available.
          </p>

        ) : (

          Object.entries(
            departments
          ).map(
            ([department, count]) => (

              <div
                className="bar-row"
                key={department}
              >

                <span>
                  • {department}
                </span>

                <div className="bar-background">

                  <div
                    className="bar-fill"
                    style={{
                      width:
                        `${
                          (count /
                            maxDepartment) *
                          100
                        }%`,
                    }}
                  />

                </div>

                <strong>
                  {count}
                </strong>

              </div>

            )
          )

        )}

      </div>


      {/* JOB SATISFACTION */}

      <div className="chart-card full-chart">

        <h3>
          ⭐ Job Satisfaction Distribution
        </h3>


        {[1, 2, 3, 4, 5].map(
          (rating) => (

            <div
              className="bar-row"
              key={rating}
            >

              <span>
                {rating}/5
              </span>

              <div className="bar-background">

                <div
                  className="bar-fill"
                  style={{
                    width:
                      `${
                        (satisfaction[
                          rating
                        ] /
                          maxSatisfaction) *
                        100
                      }%`,
                  }}
                />

              </div>

              <strong>
                {satisfaction[rating]}
              </strong>

            </div>

          )
        )}

      </div>


      {/* WORKLOAD */}

      <div className="chart-card full-chart">

        <h3>
          💼 Workload Distribution
        </h3>


        <div className="workload-grid">

          <div className="workload-box">

            <span>
              🟢 Low Workload
            </span>

            <strong>
              {
                feedbacks.filter(
                  (item) =>
                    item.workload ===
                    "Low"
                ).length
              }
            </strong>

          </div>


          <div className="workload-box">

            <span>
              🟡 Medium Workload
            </span>

            <strong>
              {
                feedbacks.filter(
                  (item) =>
                    item.workload ===
                    "Medium"
                ).length
              }
            </strong>

          </div>


          <div className="workload-box">

            <span>
              🔴 High Workload
            </span>

            <strong>
              {
                feedbacks.filter(
                  (item) =>
                    item.workload ===
                    "High"
                ).length
              }
            </strong>

          </div>

        </div>

      </div>


      {/* PROMOTION */}

      <div className="chart-card full-chart">

        <h3>
          🚀 Promotion Opportunities
        </h3>


        <div className="promotion-grid">

          <div className="promotion-box">

            <span>
              Promotion Available
            </span>

            <strong>

              {
                feedbacks.filter(
                  (item) =>
                    item.promotion ===
                    "Yes"
                ).length
              }

            </strong>

          </div>


          <div className="promotion-box">

            <span>
              No Promotion
            </span>

            <strong>

              {
                feedbacks.filter(
                  (item) =>
                    item.promotion ===
                    "No"
                ).length
              }

            </strong>

          </div>

        </div>

      </div>


      {/* DATA COVERAGE */}

      <div className="chart-card full-chart">

        <h3>
          ✅ Analytics Coverage
        </h3>


        <div className="coverage-box">

          <strong>
            {total}
          </strong>

          <span>
            Feedback Records
          </span>

          <p>
            Current records available for
            analytics and ML monitoring.
          </p>

        </div>

      </div>


      {/* DETAILED DATA */}

      <div className="chart-card full-chart">

        <h3>
          👥 Employee Feedback Details
        </h3>


        <p>
          Actual records submitted through
          the feedback form.
        </p>


        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  ID
                </th>

                <th>
                  Employee
                </th>

                <th>
                  Department
                </th>

                <th>
                  Job Role
                </th>

                <th>
                  Salary
                </th>

                <th>
                  Satisfaction
                </th>

                <th>
                  Workload
                </th>

                <th>
                  Overtime
                </th>

                <th>
                  Risk
                </th>

              </tr>

            </thead>


            <tbody>

              {feedbacks.length ===
              0 ? (

                <tr>

                  <td colSpan="9">
                    No feedback records
                    available.
                  </td>

                </tr>

              ) : (

                feedbacks.map(
                  (item) => (

                    <tr
                      key={item.id}
                    >

                      <td>
                        #{item.id}
                      </td>


                      <td>
                        <strong>
                          {item.employee_name}
                        </strong>
                      </td>


                      <td>
                        {item.department}
                      </td>


                      <td>
                        {item.job_role}
                      </td>


                      <td>
                        ₹
                        {Number(
                          item.salary
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>


                      <td>
                        ⭐{" "}
                        {
                          item.job_satisfaction
                        }/5
                      </td>


                      <td>
                        {item.workload}
                      </td>


                      <td>
                        {item.overtime}
                      </td>


                      <td>

                        <span
                          className={
                            item.retention_risk ===
                            "High"
                              ? "risk-high"
                              : item.retention_risk ===
                                "Medium"
                              ? "risk-medium"
                              : "risk-low"
                          }
                        >
                          {
                            item.retention_risk ||
                            "-"
                          }
                        </span>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// ML PREDICTION TABLE
// ======================================================

function PredictionTable({
  feedbacks,
  onBack,
}) {

  return (
    <div className="content-section">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back
      </button>


      <div className="analytics-title">

        <h2>
          🤖 ML Retention Results
        </h2>

        <p>
          Actual Machine Learning
          predictions generated from
          employee feedback.
        </p>

      </div>


      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>
                ID
              </th>

              <th>
                Employee
              </th>

              <th>
                Department
              </th>

              <th>
                Job Role
              </th>

              <th>
                Workload
              </th>

              <th>
                Overtime
              </th>

              <th>
                Satisfaction
              </th>

              <th>
                Attrition
              </th>

              <th>
                Probability
              </th>

              <th>
                Risk
              </th>

              <th>
                Date
              </th>

            </tr>

          </thead>


          <tbody>

            {feedbacks.length ===
            0 ? (

              <tr>

                <td colSpan="11">
                  No ML prediction records
                  available.
                </td>

              </tr>

            ) : (

              feedbacks.map(
                (item) => (

                  <tr
                    key={item.id}
                  >

                    <td>
                      #{item.id}
                    </td>


                    <td>
                      <strong>
                        {item.employee_name}
                      </strong>
                    </td>


                    <td>
                      {item.department}
                    </td>


                    <td>
                      {item.job_role}
                    </td>


                    <td>
                      {item.workload}
                    </td>


                    <td>
                      {item.overtime}
                    </td>


                    <td>
                      ⭐{" "}
                      {
                        item.job_satisfaction
                      }/5
                    </td>


                    <td>

                      <span
                        className={
                          item.attrition_prediction ===
                          "Yes"
                            ? "risk-high"
                            : "risk-low"
                        }
                      >
                        {
                          item.attrition_prediction
                        }
                      </span>

                    </td>


                    <td>
                      {
                        item.attrition_probability
                      }%
                    </td>


                    <td>

                      <span
                        className={
                          item.retention_risk ===
                          "High"
                            ? "risk-high"
                            : item.retention_risk ===
                              "Medium"
                            ? "risk-medium"
                            : "risk-low"
                        }
                      >
                        {
                          item.retention_risk
                        }
                      </span>

                    </td>


                    <td>
                      {item.created_at}
                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}


// ======================================================
// MAIN APP
// ======================================================

function App() {

  const [user, setUser] =
    useState(null);


  const [showLogin, setShowLogin] =
    useState(false);


  const [showRegister,
    setShowRegister] =
    useState(false);


  const [activePage,
    setActivePage] =
    useState("dashboard");


  // ====================================================
  // IMPORTANT LOGIN FIX
  // Backend returns:
  // data.user.username
  // data.user.role
  // ====================================================

  const handleLogin = (data) => {

    const loggedInUser =
      data.user;


    if (!loggedInUser) {

      return;

    }


    setUser({

      id:
        loggedInUser.id,

      username:
        loggedInUser.username,

      email:
        loggedInUser.email,

      role:
        loggedInUser.role,

    });


    setShowLogin(false);

    setShowRegister(false);

    setActivePage("dashboard");

  };


  const handleLogout = () => {

    setUser(null);

    setActivePage("dashboard");

  };


  const openRegister = () => {

    setShowLogin(false);

    setShowRegister(true);

  };


  const openLogin = () => {

    setShowRegister(false);

    setShowLogin(true);

  };


  return (
    <div className="app">

      <Navbar
        user={user}
        onLogin={() =>
          setShowLogin(true)
        }
        onLogout={handleLogout}
      />


      {!user && (

        <HomePage
          onLogin={() =>
            setShowLogin(true)
          }
          onRegister={() =>
            setShowRegister(true)
          }
        />

      )}


      {user &&
        user.role ===
          "Employee" && (

          <EmployeeDashboard
            user={user}
            activePage={activePage}
            setActivePage={
              setActivePage
            }
          />

        )}


      {user &&
        user.role ===
          "Admin" && (

          <AdminDashboard
            activePage={activePage}
            setActivePage={
              setActivePage
            }
          />

        )}


      {showLogin && (

        <LoginModal
          onClose={() =>
            setShowLogin(false)
          }
          onLogin={handleLogin}
          onRegister={openRegister}
        />

      )}


      {showRegister && (

        <RegisterModal
          onClose={() =>
            setShowRegister(false)
          }
          onLogin={openLogin}
        />

      )}

    </div>
  );
}


export default App;