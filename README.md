# Application

## Description
A brief description of your project. Explain what it does and any key features.

## Prerequisites
- Node.js (version 16.x or later)
- npm (version 8.x or later)

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Create a `.env` file in the root directory with the following variables:**
    ```plaintext
    CONNECTION=<Your MongoDB connection string>
    USER=<Your email user>
    PASS=<Your email password>
    KEY=<Your JWT secret key>
    PORT=<Your preferred port, default is 3000>
    ```

## Running the Application

### Development
To run the application in development mode with nodemon:
```sh
npm run dev
