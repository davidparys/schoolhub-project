# TASK SPEC — Quasar SPA (Students & Classes)

**Objective:** Build a Single Page Application (SPA) using Quasar.dev that manages students and classes. The app should function without login, store data in a global state, and optionally connect to a backend database (Supabase). The implementation should follow modern frontend best practices and include clear API documentation.

---

## Functional Requirements

### Views

* **Students list:** display first name, last name, assigned classes.
* **Classes list:** display class names.
* **Class details:** clicking a class shows a list of students assigned to that class.

### Functions

* **Add new students**
* **Assign/remove students from classes**
* **Data persistence:** use Pinia for global store, optionally cache API responses with Pinia Colada.

---

## Implementation Guidelines

### Frontend (Quasar)

* SPA structure using Quasar pages and layouts.
* Top navigation bar on desktop; right-side mobile nav on mobile devices.
* Use Material UI components for consistency.
* Tables: display data in card-like tables for readability.
* Forms for adding/editing students and classes, implemented as dialogs.

### Global Store (Pinia)

* `useStudentsStore`:

  * State: `students: Student[]`
  * Actions: `addStudent`, `editStudent`, `removeStudent`, `assignToClass`, `removeFromClass`
* `useClassesStore`:

  * State: `classes: Class[]`
  * Actions: `addClass`, `editClass`, `removeClass`
* Optional: `useUiStore` for transient UI state (dialogs, toasts, language)
* **Caching:** Pinia Colada to cache API requests and improve offline/instant updates.

### Backend (Supabase)

* Database tables: `students`, `classes`, `class_assignments` (many-to-many relation).
* Optionally use an ORM (e.g., Drizzle ORM) to manage Supabase queries.
* Provide REST endpoints via Supabase functions or a lightweight backend:

  * `GET /students`
  * `POST /students`
  * `PATCH /students/:id`
  * `DELETE /students/:id`
  * `GET /classes`
  * `POST /classes`
  * `PATCH /classes/:id`
  * `DELETE /classes/:id`
  * `POST /classes/:id/assign-student`
  * `POST /classes/:id/remove-student`

### API Documentation (Scalar / OpenAPI)

* Document all REST endpoints using OpenAPI (Swagger or Scalar format).
* Include request/response schemas for students and classes.
* Include error codes and messages for client guidance.

### Data Shapes

```ts
// Student
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  classIds: string[];
}

// Class
interface Class {
  id: string;
  name: string;
  description?: string;
}
```

### Optional Add-ons

* Multi-language support (PL / EN) with language switcher.
* Responsive design (RWD).
* Hosting on Vercel / Netlify.
* Fully connected backend with Supabase and ORM.
* REST API documented via OpenAPI / Scalar.

---

## Git & Submission Guidelines

* Follow good Git practices: readable English commits, clear branch names (`feat/`, `fix/`, `chore/`).
* Public repository (GitHub or GitLab) with README and installation instructions.
* Include a `DESIGN-SPEC.md` file for UI/UX reference.

---

### Notes

* Start with local Pinia store and mock data to speed up development.
* Integrate Supabase and API endpoints progressively.
* Ensure code is modular, readable, and scalable for future features.
