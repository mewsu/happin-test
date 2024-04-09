# Project Name

A nodeJS app that uses sqlite3 and Sequelize to demonstrate authentication and various common API requests based on a Author/Books model relationship.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Todo](#todo)

## Installation

- Clone the project.
- Run npm install to install dependecies.


## Usage

- Run npm seed to initialize the database.
- Run npm run dev to start the server.
- For protected routes, you must first retreive a JWT token using the POST /api/login route. The user name password is user1/pass1. The response is your JWT token that will expire in 1h. You must include this token as Bearer for protected routes.
- To add a new book to an author, use /authors/:id/books where :id is the author to which the book is associated. You must pass in the proper book data object in the request body.
- To get a list of all books by all authors that were born in a certain city, use /books/city/:city where :city is a string that matches the author's city. You may also optionally pass in a year range to filter books that were published within those years. The year range are query params startYear and endYear. An example would be: localhost:3000/api/books/city/New%20York?startYear=1950&endYear=1970
- I have also added several other commonly used routes, please reference the authorRoutes and bookRoutes API documentation for more details.

## Todo

- Clean up CommonJS / ES6 imports for more consistency.
- Figure out why Typdoc isn't working or try a different library.
- Write tests.