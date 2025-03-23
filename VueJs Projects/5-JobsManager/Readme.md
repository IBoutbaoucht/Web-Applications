
# **Job Management Application**

## **Project Overview**

This project, aims to create a **job management application**. The application enables users to browse available job listings, while administrators can add, modify, and delete job posts. The application is built using **Vue.js** and follows a modular architecture, ensuring ease of use and maintainability.

The application’s main functionalities include:

- Displaying available job listings.
- Adding new job posts.
- Viewing job details.
- Editing and deleting job posts.
- Filtering job listings.

---

## **Features**

### **Home.vue**
- Displays a list of available job offers.
- Button to add a new job listing.

### **Job Details Page**
- Displays the details of the selected job (title, description, salary, creation date, etc.).
- Option to modify or delete the selected job post.

### **Job Form (Add/Edit)**
- A form that allows the creation of new job posts with fields such as title, description, salary, creation date, years of experience, etc.
- Ability to edit an existing job post with pre-filled fields.

### **Job Deletion**
- Job deletion with a confirmation step to ensure the action is intentional.

### **Routing**
- Utilizes Vue Router for navigation between the home page, job detail page, and add/edit job form.

---

## **Project Architecture**

```
App.vue
│
├── Home.vue
│   └── List of available jobs
│
├── AddJob.vue
│   └── Form for adding a new job
│
├── EditJob.vue
│   └── Form for editing an existing job
│
├── JobDetail.vue
│   └── Displays detailed information of a selected job
│
├── FilterNav.vue
│   └── Component for filtering jobs
│
└── Router Setup
    └── Routes for the pages (home, job details, add/edit job)
```

---

## **Getting Started**

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (LTS version)
- **Vue CLI** (For development and building)
  
You can install Vue CLI using the following command:

```bash
npm install -g @vue/cli
```

### **Installing**

Clone this repository to your local machine:

```bash
git clone https://github.com/your-github-username/JobBoard-SPD2.git
```

Navigate into the project folder:

```bash
cd JobBoard-SPD2
```

Install the required dependencies:

```bash
npm install
```

### **Running the Application**

To start the development server and view the app in your browser:

```bash
npm run serve
```

Open your browser and navigate to `http://localhost:8080` to view the app.

---

## **Contributing**

Feel free to contribute by opening issues, submitting pull requests, or suggesting new features. If you'd like to contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Commit your changes.
4. Push to your forked repository.
5. Open a pull request to merge your changes into the main repository.

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **Acknowledgments**

- Special thanks to **Pr. Ahmed Bentajer** for the guidance in the creation of this project.
- Thanks to the **Vue.js** community for providing an amazing framework to work with.
