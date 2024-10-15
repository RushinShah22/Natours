# Natours

Welcome to the Natours project! This repository contains the source code for a fictional tour booking website called Natours, built as a learning project to demonstrate web development skills. The project is built using modern web technologies including Node.js, Express, MongoDB, and more.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

- User authentication and authorization
- Secure password handling with encryption
- Booking management
- Tour management (CRUD operations)
- User reviews and ratings for tours
- API documentation

## Technologies

- Node.js
- Express.js
- MongoDB & Mongoose
- JavaScript
- Git

## Setup

To get a local copy of this project up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
 ```sh
 git clone https://github.com/RushinShah22/natours.git
  ```


2. Navigate to the project directory:

```sh
cd natours
```
3. Install dependencies:

```sh
npm install
```
Set up environment variables:
Create a .env file in the root directory and add your configuration values:

```env
Copy code
NODE_ENV=development
DATABASE=<your_mongoDB_connection_string>
DATABASE_PASSWORD=<your_database_password>
JWT_SECRET=<your_jwt_secret>
```
## Database Setup
Ensure that your MongoDB instance is running and accessible.

Running the Application
Start the development server:

```sh
use docker to run a container.
```
Open your browser and visit:

http://localhost:3000

## Usage
Sign up and log in to book a tour.
Manage your bookings and reviews through your user account.
## Project Structure
```bash
natours/
│
├── controllers/       # Controller functions
├── models/            # Mongoose models
├── public/            # Static files (CSS, JS, images)
├── routes/            # Express routes
├── views/             # Pug templates
├── app.js             # Express application
├── server.js          # Server entry point
├── package.json       # Project dependencies and scripts
└── README.md          # Project documentation

```

