TODO:

1. Each validator should be a function array that includes:
   Field-specific validations (e.g., username as lowercase, email format).
   Logical checks (e.g., mentorId exists in database if assigned).
2. userValidator.ts: Validations for user data, like createNewUserValidator.
   courseValidator.ts: Validations for course data.
   mentorValidator.ts: Validations for mentor data.
   userCourseValidator.ts: For relationships involving users and courses.
3. Each validator should be a function array that includes:
   Field-specific validations (e.g., username as lowercase, email format).
   Logical checks (e.g., mentorId exists in database if assigned).
4. Connect Validators to Routes
   Add validators to routes as middleware.
   Example : createNewUserValidator:
   `router.post("/users", createNewUserValidator, createUserController);`
5. Error Handling: Create a central error handler for validation errors to standardize responses.
