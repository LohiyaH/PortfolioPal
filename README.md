# Portfolio Tracker

## Description
A full-stack application for tracking and managing investment portfolios. The application allows users to view, add, and manage their portfolio items using a user-friendly interface.

## Cloning the Repository
To clone this repository, ensure you have Git installed on your machine. Then run the following command:

```bash
git clone https://github.com/LohiyaH/PortfolioPal.git
```

Replace `yourusername` with your GitHub username.

## Installation
### Backend
1. Navigate to the `backend` directory.
2. Run `npm install` to install the necessary dependencies.
3. Create a `.env` file based on the `.env.example` file to set up your environment variables.

### Frontend
1. Navigate to the `frontend` directory.
2. Run `npm install` to install the necessary dependencies.
3. Create a `.env` file based on the `.env.example` file to set up your environment variables.
   - Set `REACT_APP_ALPHA_VANTAGE_API_KEY` to your Alpha Vantage API key.

## Usage
### Starting the Backend
1. In the `backend` directory, run `npm start` to start the server.
2. The server will run on `http://localhost:5000`.

### Starting the Frontend
1. In the `frontend` directory, run `npm start` to start the React application.
2. The application will run on `http://localhost:3000`.

## Steps to Run the Project Locally
1. Ensure you have Node.js and npm installed on your machine.
2. Clone the repository:
   ```bash
   git clone https://github.com/LohiyaH/PortfolioPal.git
   cd PortfolioPal
   ```
3. Install dependencies for both backend and frontend:
   - For backend:
     ```bash
     cd backend
     npm install
     npm start
     ```
   - For frontend:
     ```bash
     cd frontend
     npm install
     npm start
     ```
4. Access the application at `http://localhost:3000`.

## Assumptions or Limitations
- The application assumes that you have a valid Alpha Vantage API key set in the `.env` file for the frontend.
- The Alpha Vantage API has a limitation of 25 requests per day.
- The backend requires a connection to a MySQL database.

## Links
- Live API Documentation: [Alpha Vantage API Docs](https://www.alphavantage.co/documentation/)

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the ISC License.
