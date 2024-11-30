## Route and Controller Standards

## routes

```ts
import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userController";

const router = Router();

// Define API endpoints
router.get("/", getAllUsers); // GET /users
router.get("/:id", getUserById); // GET /users/:id

export default router;
```

<br>
## Controllers

```js
import { Request, Response } from "express";

// Mock data for demonstration
const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
];

// Controller: Get all users
export const getAllUsers = (req: Request, res: Response) => {
  res.status(200).json(users);
};

// Controller: Get a user by ID
export const getUserById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
};
```

## ErrorHandler

````js
import { AppError } from '../utils/AppError';

export const exampleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Business logic
        throw new AppError('Custom error occurred', 400);
    } catch (error) {
        next(error);
    }
};
```


Checklist
Routes only handle endpoint definitions.
Controllers focus on business logic and data handling.
Reusable code is abstracted into services or utilities.
Use middlewares for validation and error handling.
Maintain consistency and follow a clear directory structure.
````

## Table

### Users

```sql
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    StagId VARCHAR(50) UNIQUE,        -- Unique stage-specific ID
    username VARCHAR(100) NOT NULL,   -- User's username
    email VARCHAR(150) NOT NULL,      -- Email address
    phoneNumber VARCHAR(15),          -- External phone number (trusted source, no validation needed)
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    clerkId VARCHAR(50),              -- Auth provider's ID
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

### User Courses

```sql
CREATE TABLE UserCourses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,             -- Foreign key to Users
    courseName VARCHAR(150) NOT NULL,
    courseMentor INT,                 -- Foreign key to UserMentors
    courseDescription TEXT,
    courseImage TEXT,                 -- URL for the course image
    courseStatus VARCHAR(50),         -- e.g., "In Progress", "Completed"
    courseProgress INT DEFAULT 0,     -- Percentage of completion
    coursePrice DECIMAL(10, 2),       -- Price of the course
    courseLink TEXT,                  -- Link to the course platform
    courseTags TEXT[],                -- Array of tags for simplicity
    courseNotes TEXT,
    courseGithubRepo TEXT,            -- Link to a GitHub repo
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseMentor) REFERENCES UserMentors(id) ON DELETE SET NULL
);
```

### User Mentors

```sql
CREATE TABLE UserMentors (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,             -- Foreign key to Users (mentor belongs to one user only)
    mentorName VARCHAR(100) NOT NULL,
    mentorImage TEXT,                 -- URL for mentor's profile picture
    mentorDescription TEXT,
    mentorWebsite TEXT,
    mentorNotes TEXT,
    mentorTwitter TEXT,
    mentorInstagram TEXT,
    mentorGithub TEXT,
    mentorDiscord TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

### CourseTags

```sql
CREATE TABLE CourseTags (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL,           -- Foreign key to UserCourses
    tag_name VARCHAR(50) NOT NULL,    -- The tag name
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (course_id) REFERENCES UserCourses(id) ON DELETE CASCADE
);

```

### UsersBackup

```sql
CREATE TABLE UserBackup (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,             -- Foreign key to Users
    backupData JSONB NOT NULL,        -- Backup data stored in JSON format
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

### Key Types and Features Summary

Column Name Type Purpose
SERIAL Auto-increment Used for primary keys, e.g., id.
VARCHAR(n) Variable-length Used for strings of specific maximum length, e.g., usernames.
TEXT Long text For longer strings like descriptions, notes, or URLs.
INT Integer For foreign keys or numeric data.
DECIMAL(x, y) Decimal numbers For prices or precise numeric values.
TIMESTAMP Date/Time To track when records were created or updated.
JSONB JSON data To store structured data (e.g., backups or metadata).
TEXT[] Array of text Simplified tagging using a PostgreSQL array (for courseTags).

## Relationships

Users ↔ UserCourses: One user can have many courses.
Users ↔ UserMentors: One user can have many mentors, but a mentor belongs to one user only.
UserCourses ↔ UserMentors: Each course can one mentor.
UserCourses ↔ CourseTags: Each course can have multiple tags.
