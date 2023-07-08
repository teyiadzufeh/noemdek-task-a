# Noemdek Assessment Task A

This repository contains the code for Noemdek Assessment Task A, developed by Teyi Adzufeh.

## Description

The assessment task is designed to assess the skills and knowledge of the candidate in backend development. It includes building a RESTful API using Node.js and Express.js, with features such as user authentication, data validation, and database integration.

## Database choice explanation

Due to the relational, and dependent nature of data in this project, I decided to make use of Postgresql, a Relational Database Management System (RDBMS) that supports SQL. This helped to perform DB queries with ease and reduced redundancy in the process.

## Installation

To run this project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/teyiadzufeh/noemdekassess.git`
2. Navigate to the project directory: `cd noemdekassess`
3. Install the dependencies: `npm install`

## Usage

To start the development server, use the following command:

```
npm run dev
```

This will start the server on `http://localhost:3001`.

## Scripts

- `npm run dev`: Starts the development server using `nodemon` for automatic restart on file changes.
- `npm test`: Runs the test suite (no tests specified in this project).

## Dependencies

This project relies on the following dependencies:

- bcrypt: ^5.1.0
- compression: ^1.7.4
- dotenv: ^16.3.1
- express: ^4.18.2
- joi: ^17.9.2
- joi-password-complexity: ^5.1.0
- jsonwebtoken: ^9.0.1
- moment: ^2.29.4
- morgan: ^1.10.0
- nanoid: ^3.0.0
- pg: ^8.11.1
- uuid: ^9.0.0
- winston: ^3.9.0

## Author

This project is authored by Teyi Adzufeh.

## License

This project is licensed under the ISC License.

Experience with logistics and transport helps as I have provided possible constants in the constants/types.js file.