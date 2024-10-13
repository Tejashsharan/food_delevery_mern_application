
# Food Delevery Application


To collaborate on the **"food-delevery-mern-application"** project that contains the `frontend` and `backend` folders, here’s how they should proceed:

### Steps for Collaboration:

1. **Clone the Repository**:
   Your friends can clone the repository to their local machines. Provide them with the repository URL, and they can run:

   ```bash
   git clone https://github.com/Tejashsharan/food_delevery_mern_application
   ```

2. **Navigate to the Project Directory**:
   After cloning, they should navigate into the project folder:

   ```bash
   cd food-delevery-mern-application
   ```

3. **Ensure Docker is Installed**:
   They should have **Docker** and **Docker Compose** installed on their machines.

   - Install Docker from [Docker’s website](https://www.docker.com/get-started).
   - Docker Compose is bundled with Docker Desktop.

4. **Set Up Environment Variables**:
   If your project requires environment variables (e.g., `MONGO_URI`), provide them in a `.env` file or share the required configurations. For example, they can create a `.env` file in the project root:

   ```bash
   touch .env
   ```

   Add the following content (or modify as per your project):
   ```env
   MONGO_URI=mongodb://mongo:27017/food_app_db
   ```

5. **Run Docker Compose**:
   To start the entire application (both frontend and backend) using Docker Compose, they can run:

   ```bash
   docker-compose up
   ```

   This will build and start the services defined in the `docker-compose.yml` file.

6. **Start in Detached Mode**:
   If they prefer to run the services in the background, they can use detached mode:

   ```bash
   docker-compose up -d
   ```

7. **Collaborative Development**:
   - As they work on the project, any code changes they make will reflect in the Docker containers if you’ve set up volume mounting in your `docker-compose.yml`.
   - They should **commit** their changes using Git and push them to the shared repository.

8. **Git Workflow**:
   Encourage your friends to follow a **branching strategy** like Git Flow or Feature Branches for better collaboration.

   - **Create a new branch** for their feature or changes:
     ```bash
     git checkout -b feature-branch-name
     ```

   - **Add and commit changes**:
     ```bash
     git add .
     git commit -m "Description of the changes"
     ```

   - **Push the branch** to the repository:
     ```bash
     git push origin feature-branch-name
     ```

   - Open a **Pull Request (PR)** to merge their branch into the main branch once the changes are ready.

### Summary of Steps:
1. Clone the repository.
2. Navigate to the project folder.
3. Install Docker and Docker Compose.
4. Set up environment variables (if needed).
5. Run `docker-compose up` to start the application.
6. Use Git for version control and collaboration.

By following these steps, your friends will be able to contribute effectively to your Dockerized project.
