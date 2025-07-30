let serviceUrl = `http://localhost:4936`;

showSignup.addEventListener("click", () => {
  document.getElementById("loginCard").style.display = "none";
  document.getElementById("signupCard").style.display = "block";
});

showLogin.addEventListener("click", () => {
  document.getElementById("signupCard").style.display = "none";
  document.getElementById("loginCard").style.display = "block";
});

const TPbuttons = document.querySelectorAll(".toggle-password");
TPbuttons.forEach((element) => {
  element.addEventListener("click", () => {
    let passwordElement = document.getElementById(element.dataset.related);
    console.log(passwordElement);

    const icon = document.querySelector(
      `#${element.dataset.related}+button.toggle-password i`
    );

    if (passwordElement.type === "password") {
      passwordElement.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordElement.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const acceptTerms = document.getElementById("agreeTerms").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const submitBtn = document.querySelector(".signup-btn");
      let originalContent = submitBtn.innerText;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      submitBtn.disabled = true;

      // API Validation
      try {
        let submission = {
          firstName,
          lastName,
          email,
          password,
        };

        const response = await fetch(`${serviceUrl}/api/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });
        const data = await response.json();
        if (data.success == true) {
          // If success - alert user about new account creation

          alert("User Created, Redirected to Login Screen");
          // Redirect to login on successful signup

          window.location.href = "../pages/index.html";
        } else if (
          data.success == false &&
          data.message == "Validation Failed"
        ) {
          const allErrors = [];
          const respondedErrors = data.details;
          respondedErrors.forEach((err) => {
            allErrors.push(err.msg);
          });

          console.log(allErrors);
          alert(allErrors);
          submitBtn.innerText = originalContent;
          submitBtn.disabled = false;
        } else if (
          data.success == false &&
          data.message == "User aleready Exists"
        ) {
          alert(
            "User with same mail is aleready exist. So please login or use another account"
          );
          submitBtn.innerText = originalContent;
          submitBtn.disabled = false;
        }
        console.log(data);
      } catch (error) {
        console.log(error.message);
        alert("Error while Fetching");
        submitBtn.innerText = originalContent;
        submitBtn.disabled = false;
      }
    } catch (err) {
      // If server validation error - show message in an alert box
      console.error("Signup error:", err);
      // If fail - show message in an alert box
      alert("An error occurred during signup.");
      submitBtn.innerText = originalContent;
      submitBtn.disabled = false;
    }
  });

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.querySelector(".login-btn");
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    // API Validation
    try {
      let submission = {
        email,
        password,
      };

      const response = await fetch(`${serviceUrl}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      const data = await response.json();
      console.log(data);

      if (data.success === true) {
        // Store user data in localStorage for dashboard access
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Redirect to dashboard
        window.location.href = "./pages/dashboard.html";
      } else {
        // If fail - show message in an alert box

        alert(data.message || "Login failed");
        submitBtn.innerHTML = "Login";
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.log(error.message);
      // If fail - show message in an alert box

      alert("Error while Fetching");
      submitBtn.innerText = "Login";
      submitBtn.disabled = false;
    }
  });

// Forgot Password Modal Logic
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotPasswordMessage = document.getElementById("forgotPasswordMessage");

function openForgotPasswordModal() {
  forgotPasswordModal.style.display = "flex";
  forgotPasswordMessage.textContent = "";
  forgotPasswordForm.reset();
}
function closeForgotPasswordModal() {
  forgotPasswordModal.style.display = "none";
}

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", function (e) {
    e.preventDefault();
    openForgotPasswordModal();
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("forgotEmail").value.trim();
    forgotPasswordMessage.textContent = "Sending...";
    try {
      const response = await fetch(
        "http://localhost:4936/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      forgotPasswordMessage.textContent = data.message;
    } catch (err) {
      forgotPasswordMessage.textContent = "Failed to send email. Try again.";
    }
  });
}

// Close modal when clicking outside
if (forgotPasswordModal) {
  document.addEventListener("click", function (event) {
    if (event.target === forgotPasswordModal) {
      closeForgotPasswordModal();
    }
  });
}
