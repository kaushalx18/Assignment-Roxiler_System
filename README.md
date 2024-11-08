# MERN Transaction Dashboard

A full-stack transaction management and analytics dashboard built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- 📊 Transaction Management
  - View all transactions in a paginated table
  - Search transactions by title/description/price
  - Filter transactions by month
  - Real-time transaction updates

- 📈 Data Visualization  
  - Bar chart showing price range distribution
  - Pie chart displaying category-wise breakdown
  - Monthly statistics and metrics

- 📊 Analytics
  - Total sales amount per month
  - Number of items sold vs unsold
  - Category-wise transaction analysis

## Tech Stack

### Frontend
- React.js
- Chart.js & React-Chartjs-2
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Installation

1. Clone the repository
bash
git clone <repository-url>


2. Install backend dependencies
bash
cd backend
npm install


3. Configure environment variables
Create a .env file in backend directory:

MONGODB_URI=your_mongodb_connection_string
PORT=8000


4. Install frontend dependencies
bash
cd frontend
npm install


5. Start the backend server
bash
cd backend
npm start


6. Start the frontend application
bash
cd frontend
npm start


The application will be available at http://localhost:3000

## API Endpoints

- POST /api/initialize - Initialize database with seed data
- GET /api/transactions - Get transactions with search and pagination
- GET /api/statistics - Get monthly statistics
- GET /api/bar-chart - Get price range distribution data
- GET /api/pie-chart - Get category distribution data
- GET /api/combined - Get combined statistics and chart data

## Usage

1. Start the application
2. Select a month from the dropdown
3. View transactions in the table
4. Use search bar to filter transactions
5. Navigate through pages using pagination
6. View statistics and charts for selected month

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chart.js for visualization components
- MongoDB Atlas for database hosting
- React community for excellent documentation
