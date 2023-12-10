/*
  File: script.js
  Author: CS100 Team
  Date Created: 23 July 2023
  Copyright: CSTU
  Description: JS code of CSTU Passport that validate with JS
*/

const config = {
    backendUrl: "http://localhost:8000/", // Default backend URL
  };
  const port = 8000;
  
  // Function to validate Firstname and Lastname
  function validateName() {
    const fullnameInput = document.getElementById("fullname");
    const names = fullnameInput.value.trim().split(" ");
    const errorElement = document.getElementById("fullnameError");
  
    if (names.length !== 2) {
      errorElement.textContent = "Please enter both your Firstname and Lastname.";
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
    }
    return true;
  }

  // Function to validate Nickname
function validateNickname() {
  const nicknameInput = document.getElementById("nickname");
  const nickname = nicknameInput.value.trim();
  const errorElement = document.getElementById("nicknameError");

  if (nickname.length < 2) {
    errorElement.textContent = "Please enter your Nickname.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

  
  // Function to validate Student ID
  function validateStudentID() {
    const studentIDInput = document.getElementById("studentID");
    const studentIDPattern = /^\d{10}$/;
    const errorElement = document.getElementById("studentIDError");
  
    if (!studentIDPattern.test(studentIDInput.value)) {
      errorElement.textContent = "Please enter a 10-digit Student ID.";
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
    }
    return true;
  }
  
  // Function to validate University Email
  function validateEmail() {
    const emailInput = document.getElementById("email");
    const emailPattern = /^.+@dome\.tu\.ac\.th$/;
    const errorElement = document.getElementById("emailError");
  
    if (!emailPattern.test(emailInput.value)) {
      errorElement.textContent =
        "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
    }
    return true;
  }

  // Function to validate Student ID
  function validatetel() {
    const telInput = document.getElementById("tel");
    const telPattern = /^\d{10}$/;
    const errorElement = document.getElementById("telError");
  
    if (!telPattern.test(telInput.value)) {
      errorElement.textContent = "Please enter a 10-digit Telephone Number.";
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
    }
    return true;
  }
  
  // Function to validate form inputs on user input
  function validateFormOnInput() {
    validateName();
    validateNickname();
    validateStudentID();
    validateEmail();
    validatetel();
  }
  
  // Function to fetch activity types from the backend
  async function fetchActivityTypes() {
    try {
      const response = await fetch(`http://${window.location.hostname}:${port}/getActivityType`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to fetch activity types.");
        return [];
      }
    } catch (error) {
      console.error("An error occurred while fetching activity types:", error);
      return [];
    }
  }
  
  // Function to populate activity types in the select element
  function populateActivityTypes(activityTypes) {
    const activityTypeSelect = document.getElementById("activityType");
  
    for (const type of activityTypes) {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.value;
      activityTypeSelect.appendChild(option);
    }
  }
  
  // Event listener when the page content has finished loading
  document.addEventListener("DOMContentLoaded", async () => {
    const activityTypes = await fetchActivityTypes();
    populateActivityTypes(activityTypes);
  });
  
  // Function to submit the form
  async function submitForm(event) {
    event.preventDefault();
  
    // Validate form inputs before submission
    if (!validateName() || !validateNickname || !validateStudentID() || !validateEmail() || !validatetel) {
      return;
    }
  
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
  
    if (endDate <= startDate) {
      alert("End datetime should be after the start datetime.");
      return;
    }
  
    // Create the data object to send to the backend
    const formData = new FormData(event.target);
    const data = {
      first_name: formData.get("fullname").split(" ")[0],
      last_name: formData.get("fullname").split(" ")[1],
      nickname: formData.get("nickname"),
      student_id: parseInt(formData.get("studentID")),
      email: formData.get("email"),
      tel: parseInt(formData.get("tel")),
      title: formData.get("workTitle"),
      type_of_work_id: parseInt(formData.get("activityType")),
      academic_year: parseInt(formData.get("academicYear")) - 543,
      semester: parseInt(formData.get("semester")),
      start_date: formData.get("startDate"),
      end_date: formData.get("endDate"),
      location: formData.get("location"),
      acehive: formData.get("Acheieve"),
      description: formData.get("description")
    };
  
    console.log(data);
  
    try {
      // Send data to the backend using POST request
      const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Form data submitted successfully!");
  
        // Format JSON data for display
        const formattedData = Object.entries(responseData.data)
          .map(([key, value]) => `"${key}": "${value}"`)
          .join("\n");
  
        // Display success message with formatted data
        alert(responseData.message + "\n" + formattedData);
  
        document.getElementById("myForm").reset();
      } else {
        console.error("Failed to submit form data.");
  
        // Display error message
        alert("Failed to submit form data. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while submitting form data:", error);
    }
  }
  
  // Event listener for form submission
  document.getElementById("myForm").addEventListener("submit", submitForm);
  
  // Event listeners for input validation on user input
  document.getElementById("fullname").addEventListener("input", validateName);
  document.getElementById("nickname").addEventListener("input",validateNickname);
  document
    .getElementById("studentID")
    .addEventListener("input", validateStudentID);
  document.getElementById("email").addEventListener("input", validateEmail);
  document.getElementById("tel").addEventListener("input", validatetel);



  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("myForm");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // ป้องกันการ submit แบบปกติ
  
      // ตรวจสอบข้อมูลก่อน submit
      if (!validateForm()) {
        return;
      }
  
      // เรียกใช้ฟังก์ชันที่ดึงข้อมูลจากฟอร์ม
      const formData = getFormData();
  
      // เรียกใช้ฟังก์ชันที่แสดงข้อมูล
      displayFormData(formData);
    });
  });
  
  // ฟังก์ชันที่ตรวจสอบข้อมูลก่อน submit
  function validateForm() {
    // ตรวจสอบข้อมูลทุก field ตามที่ต้องการ
    const fullname = document.getElementById("fullname").value;
    const nickname = document.getElementById("nickname").value;
    const studentID = document.getElementById("studentID").value;
    const email = document.getElementById("email").value;
    const tel = document.getElementById("tel").value;
  
    // ตรวจสอบว่าข้อมูลไม่ว่างเปล่า
    if (!validateName() || !validateNickname || !validateStudentID() || !validateEmail() || !validatetel) {
      alert("Please fill in all required fields.");
      return false;
    }
  }
  
  // ฟังก์ชันที่ดึงข้อมูลจากฟอร์ม
  function getFormData() {
    return {
    fullname: document.getElementById("fullname").value,
    nickname: document.getElementById("nickname").value,
    studentID: document.getElementById("studentID").value,
    email: document.getElementById("email").value,
    tel: document.getElementById("tel").value,
    workTitle: document.getElementById("workTitle").value,
    activityType: document.getElementById("activityType").value,
    academicYear: document.getElementById("academicYear").value,
    semester: document.getElementById("semester").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
    location: document.getElementById("location").value,
    Acheive: document.getElementById("Acheive").value,
    description: document.getElementById("description").value,
  };
  }
  
  // ฟังก์ชันที่แสดงข้อมูล
  function displayFormData(formData) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
      <p><strong>Name:</strong> ${formData.fullname}</p>
      <p><strong>Nickname:</strong> ${formData.nickname}</p>
      <p><strong>Student ID:</strong> ${formData.studentID}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Telephone Number:</strong> ${formData.tel}</p>
      <p><strong>Work/Activity Title:</strong> ${formData.workTitle}</p>
      <p><strong>Type of Work/Activity:</strong> ${formData.activityType}</p>
      <p><strong>Academic Year:</strong> ${formData.academicYear}</p>
      <p><strong>Semester:</strong> ${formData.semester}</p>
      <p><strong>Start Date/Time:</strong> ${formData.startDate}</p>
      <p><strong>End Date/Time:</strong> ${formData.endDate}</p>
      <p><strong>Location:</strong> ${formData.location}</p>
      <p><strong>Work/Activity Achieve:</strong> ${formData.Acheive}</p>
      <p><strong>Description:</strong> ${formData.description}</p>
    `;
  }