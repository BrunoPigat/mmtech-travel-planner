# MM Tech Team Technical Test

This project demonstrates a simple application using Node.js, NeDB, React.js with TypeScript, and the OpenRouteService API. The application allows users to add, delete, and organize destinations, and calculates the distance and travel time between points using the OpenRouteService API.

## Project Structure

The project is divided into two main parts:
- **Backend**: Node.js server with NeDB for data storage.
- **Frontend**: React.js application with TypeScript.

### API Key

1. **Navigate to the Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Server**

   For development:

   ```bash
   npx nodemon
   ```

   The server will run on `http://localhost:5000`.

### Frontend

1. **Navigate to the Frontend Directory**

   ```bash
   cd frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the React Application**

   ```bash
   npm start
   ```

   The React app will run on `http://localhost:3000`.

### API Key

The project includes a free OpenRouteService API key with usage limits. If you exceed the free plan's limits or need additional features, you can obtain your own API key by creating an account at [OpenRouteService](https://openrouteservice.org/). To use your own API key, set it in the backend configuration file (e.g., `.env`).

```plaintext
OPENROUTESERVICE_API_KEY=your_api_key_here
```

## Running the Project

1. **Start the Backend Server**

   Open a terminal, navigate to the `backend` directory, and run:

   ```bash
   npx nodemon
   ```

   This starts the server in development mode, watching for changes.

2. **Start the Frontend Application**

   Open another terminal, navigate to the `frontend` directory, and run:

   ```bash
   npm start
   ```

   This will start the React development server.

3. **Access the Application**

   Open your web browser and navigate to `http://localhost:3000` to view the application.
