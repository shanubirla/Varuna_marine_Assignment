# REFLECTION

Using AI agents to build this assignment reinforced several strong development patterns and architectural principles.

## Key Learnings

* **Start with architecture:**
  Defining ports and use-cases first made the rest of the system—adapters, HTTP layer, and UI—straightforward and testable.
  The hexagonal structure prevented tight coupling with frameworks and kept the core logic reusable.

* **Small, composable steps:**
  Generating and refining each layer sequentially (domain → ports → use-cases → adapters) helped keep changes traceable and easy to validate.
  It also allowed the backend and frontend to evolve in parallel with clear boundaries.

* **Tests early:**
  Using in-memory adapters allowed quick validation of compliance balance, banking, and pooling logic without requiring a database, keeping feedback loops fast and reliable.

## Efficiency Gains

AI agents accelerated much of the setup and reduced repetitive work:

* Generated boilerplate files such as TypeScript configurations, folder structure, and ports/adapters.
* Helped maintain consistent naming conventions across layers.
* Simplified frontend scaffolding by producing reusable React + Tailwind components.
* Enabled faster debugging and validation of logic.

The frontend charts were intentionally kept minimal (using SVG) to deliver essential insights without adding heavy dependencies.

## Improvements for Next Time

If I were to iterate further, I would:

* Add **ESLint/Prettier** with consistent formatting rules and integrate them into CI checks.
* Expand **integration tests** to cover Postgres adapters using a seeded test database.
* Add a **Docker Compose setup** for quick one-command environment startup (backend + database).

