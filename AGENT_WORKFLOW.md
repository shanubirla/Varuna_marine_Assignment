# AI Agent Workflow Log

## Agents Used

* **ChatGPT (GPT-5)**– Used for backend architecture, debugging, and TypeScript/Prisma configuration.
* **Lovable AI** – Used for scaffolding the React + TailwindCSS frontend and generating reusable UI components.
* **Google Gemini** – Used for verifying FuelEU compliance formulas and validating business logic for banking and pooling.

---

## Prompts and Outputs

### Backend Planning and Setup

**Prompt:**
“Design a backend using Node.js, TypeScript, PostgreSQL, and Hexagonal Architecture for the FuelEU Maritime compliance module, including routes, banking, and pooling APIs.”

**AI Output:**
Generated the folder structure (`core`, `ports`, `adapters`, `infrastructure`), a Prisma schema, and Express route templates.
ChatGPT suggested separating use-cases (`ComputeCB`, `BankSurplus`, `CreatePool`) from adapters for cleaner architecture.

**Validation:**
Reviewed imports, corrected ESM paths, and tested Prisma migrations with PostgreSQL. Verified that the `/routes` and `/banking` APIs returned accurate data.

---

### Frontend Dashboard

**Prompt:**
“Generate a React + TypeScript + Tailwind dashboard with tabs for Routes, Compare, Banking, and Pooling, fetching data from backend APIs.”

**AI Output:**
Lovable scaffolded React components, Tailwind styling, and the basic tab structure.
ChatGPT refined Axios API calls and handled state updates and error boundaries.

**Validation:**
Manually tested data loading and form submissions. Verified Compare tab calculations against backend responses.


### Formula Verification

**Prompt:**
“Check if the compliance balance and pooling formulas follow FuelEU Maritime rules.”

**AI Output:**
Gemini validated the CB and pooling formulas and confirmed target intensity constants.
ChatGPT then implemented the final TypeScript functions for accurate computations.

**Validation:**
Compared AI-verified formulas with seed data outputs and ensured consistent positive/negative balances across test cases.

## Validation and Corrections

* Wrote unit tests for all key use-cases using in-memory adapters (`ComputeCB`, `ComputeComparison`, `BankSurplus`, `ApplyBanked`, `CreatePool`).
* Added integration tests using Supertest for `/routes` and `/banking` endpoints.
* Fixed environment and TypeScript build issues (rootDir, missing @types, and ESM imports).
* Manually reviewed AI-generated code for correctness and maintainability.

---

## Observations

* ChatGPT was most effective for backend debugging and TypeScript integration.
* Lovable reduced frontend setup time by providing consistent component scaffolds.
* Gemini provided valuable validation of formulas and logic consistency.
* Combining agents reduced repetitive work and improved overall delivery speed by roughly 60%.
* Manual review remained essential to ensure accuracy and alignment with real project requirements.

---

## Best Practices Followed

* Implemented **Hexagonal Architecture** (core → ports → adapters) for clean separation.
* Used **TypeScript strict mode** in both backend and frontend.
* Kept dependencies minimal and isolated frameworks within adapters.
* Validated all AI-generated outputs through testing and manual review before committing.
