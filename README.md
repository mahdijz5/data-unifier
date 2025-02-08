# **Data-unifier**

## **Overview**

This project is built using **Domain-Driven Design (DDD)** principles with a **functional programming (FP)** approach. It follows **Clean Architecture**, ensuring separation of concerns and maintainability. The application leverages **Bull** as a job queue over traditional cron jobs for improved reliability, retries, and scalability.

## **Tech Stack**

- **Framework:** NestJS
- **Architecture:** Clean Architecture + DDD
- **Queue System:** Bull (Bull-Board for monitoring)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Caching:** Redis
- **Validation & Parsing:** Functional Approach (**Don't parse validate**)
- **API Documentation:** Swagger

## **Core Principles & Design Decisions**

### **1. Domain-Driven Design (DDD)**

The project strictly follows **DDD principles**, ensuring the **repository layer only deals with domain entities** and not raw database models. This enforces domain logic integrity and separation of concerns.

### **2. Functional Programming (FP) Principles**

This project utilizes functional programming techniques, including:

- **Pure Functions:** Functions return the same output for the same input, avoiding side effects.
- **Immutability:** Objects are immutable wherever possible, ensuring better predictability.
- **Option Type (Maybe):** Instead of using `null`, we wrap optional values in `Option<T>` to enforce explicit handling.
- **Composition Over Inheritance:** Small, composable functions replace deep class hierarchies.

### **3. Parsing vs Validation ("Don't Parse Validate")**

- **Parsing is separate from validation** to ensure data integrity.
- **Domain objects are assumed to be valid once created.**
- **Validation occurs at the application layer** before an entity enters the domain.

### **4. Pagination Optimization**

- The repository layer directly returns **DTOs** for pagination instead of domain models, reducing unnecessary mappings.
- **Option values** are handled at the repository level and transformed accordingly for client responses.

### **5. API Documentation & Monitoring**

- **Swagger** is used for API documentation.
  - Available at: `http://localhost:<port>/`docs
- **Bull-Board** is used for monitoring queue jobs.
  - Available at: `http://localhost:<port>/`admin/queues

## **Installation & Setup**

1. Clone the repository:
   ```sh
   git clone <repo_url>
   cd <project_folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables in `.env`.
4. Run database migrations:
   ```sh
   npm run migration:run
   ```
5. Start the application:
   ```sh
   npm run start:dev 
   ```
6. Run unit-testing:
   ```sh
   npm run test 
   ```
7. Run e2e testing:
   ```sh
   npm run test:e2e
   ```

## **Contributing**

- Follow the **Clean Architecture & DDD** guidelines.
- Ensure all **code is functional-first** where applicable.
- Write **unit tests for all business logic** before merging changes.

## **Conclusion**

This project showcases a practical implementation of **DDD, functional programming, and scalable job processing** using Bull. It ensures **high maintainability, reliability, and efficient handling of domain logic**.

