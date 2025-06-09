# Node and SQL

## Overview

This is a JavaScript backend API service used to interact with a PostgreSQL database for prospective students who wish to enroll at the Umuzi program. The application uses the `node-postgres` package to interact with a PostgreSQL RDBMS container image running on Docker. The JavaScript code abstracts the database interaction, providing an intuitive interface to perform CRUD operations on the database.

## Getting Started

### Prerequisites

#### 1. Installation

This project specifies its dependencies in the `package.json` file, which need to be installed before starting the application. To install the necessary dependencies, open the terminal in the root of the application and run:

```bash
npm install
```

#### 2. Configuration

The database connection uses environment variables listed in a `.env` file to establish the connection. The values of these environment variables need to be defined, although the API can connect to the default PostgreSQL database if credentials are not provided.

Create a `.env` file in the root of the project and define the environment variables as follows:

```bash
POSTGRES_USER = 'postgres'
POSTGRES_PASSWORD = 'mypassword'
POSTGRES_HOST = 'localhost'
POSTGRES_PORT = 5433
POSTGRES_DB = 'students'
``` 
### NB: If you don't provide values for on the env file or don't create it at all then default values will be used.
#### 3. Initialize the PostgreSQL Docker Container

To spin up the PostgreSQL container, navigate to the root of the application where the `docker-compose.yml` file is located and run:

```bash
docker-compose up || docker-compose up -d # to hide container logs
```

This will run the Docker configuration as specified in the `docker-compose.yml` file, starting two services: PostgreSQL and Adminer. Adminer is useful for viewing and interacting with the database  through a graphical user interface.

To access Adminer, follow these steps:

* Step 1 - [Click here to open Adminer][localhost8080]
* Step 2 - Enter the same credentials from your `.env` file.

For example:

| Field     | Value      |
| --------- | ---------- |
| System    | PostgreSQL |
| Server    | postgres   |
| Username  | postgres   |
| Password  | mypassword |
| Database  | students   |

This will give you access to the students' database, where you can manage the data directly.

[localhost8080]: http://localhost:8080

### Usage

The main functionalities of this program can be found in the `src` folder inside the `visitors_controller.js` file.

#### Visitors Operations

This project provides a set of asynchronous functions to manage visitors records in the database. Each function performs a specific operation, such as adding, deleting, or updating a visitor’s information. 

There are two ways to interact with the API. That is by adding your own javascript file and importing the necessary function you would like to use. The second approach is through the CLI where you import and and call functions using a one line script. 

To configure for the file ensure to have imported the functions as follows: 

```javascript 
const {createTable, addNewVisitor, listAllVisitors, deleteAVisitor, updateAVisitor, viewOneVisitor, viewLastVisitor, deleteAllVisitors, validateInput, performQuery } = require("./src/visitors_controller.js");  

...the rest of the code follows here. 
``` 

### Or 

To call a function directly in the terminal use the for following format. 

```bash 
  node -e 'require("./src/visitors_controller").createTable().then(console.log).catch(console.error)'
```

---
 To begin using the functions, ensure that the table is created by running: 

```javascript
createTable().then((response)=>console.log(response));
``` 

### Or

```javascript
node -e 'require("./src/visitors_controller").createTable().then(console.log).catch(console.error)'
``` 

On success, you should see the message: `Table creation successful`.

Below are the available methods and how to use them:

#### 1. Adding a New Visitor

This method will add a new visitor to the database. Make sure all required fields are included in the `data` object. Here is how to use it:

```javascript
const visitorData = {
  name: 'Cristiano Ronaldo',
  age: 35,
  dateOfVisit: '2025-05-25',
  timeOfVisit: '20:00',
  assistorName: 'Lionel Messi',
  comments: 'How can I get to your level',
};

addNewVisitor(visitorData).then(response=>console.log(response));
``` 

### OR  

```javascript 
node -e 'require("./src/visitors_controller").addNewVisitor(
{name: "Thabo Siphiwe Mngoma", age: 35,
dateOfVisit: "2025-05-25",
timeOfVisit: "20:00",
assistorName: "Lionel Messi",
comments: "How can I get to your level",}).then(console.log).catch(console.error)'
```

On success, you should get a response like this:

```javascript
{
  id: 1,
  name: 'Cristiano Ronaldo',
  age: 35,
  date_of_visit: '2025-05-25T20:00:00.000Z',
  time_of_visit: '20:00:00',
  assistor_name: 'Lionel Messi',
  comments: 'How can I get to your level',
}
```

#### 2. Listing All Users

To retrieve a list of all visitors:

```javascript
listAllVisitors().then(response=>console.log(response));
```

### Or  

```javascript  
node -e 'require("./src/visitors_controller").listAllVisitors().then(console.log).catch(console.error)'
```

The expected output:

```javascript
[
  { id: 1, name: 'Cristiano Ronaldo' },
  { id: 2, name: 'John Doe' }
]
```

#### 3. Deleting a Visitor

To delete a visitor by their ID:

```javascript
deleteAVisitor(1).then(response=>console.log(response)); 
```
### Or 

```javascript  
node -e 'require("./src/visitors_controller").deleteAVisitor(1).then(console.log).catch(console.error)'
```
On success, you'll see the confirmation: `Visitor with ID 1 deleted successfully`.

#### 4. Updating a Visitor

To update a specific field of a visitor by their ID:

```javascript
updateAVisitor(1, 'name', 'Updated Name').then(response=>console.log(response)); 
```
### Or 

```javascript 
node -e 'require("./src/visitors_controller").updateAVisitor(1,"name", "Jack Mbambo").then(console.log).catch(console.error)'
```

On success, the message: `Visitor with ID 1 updated successfully` will be shown.

#### 5. Retrieving a Visitor by ID

To get details of a specific visitor by their ID:

```javascript
viewOneVisitor(1).then(response=>console.log(response));
``` 

### Or 

```javascript 
  node -e 'require("./src/visitors_controller").viewOneVisitor(1).then(console.log).catch(console.error)'
```

If successful, you'll get the full details of the visitor:

```javascript
{
  id: 1,
  name: 'Cristiano Ronaldo',
  age: 35,
  date_of_visit: '2025-05-25T20:00:00.000Z',
  time_of_visit: '20:00:00',
  assistor_name: 'Lionel Messi',
  comments: 'How can I get to your level',
}
```

#### 6. Getting the Last Visitor

To get the most recent visitor:

```javascript
viewLastVisitor().then(response=>console.log(response))
``` 

### Or 

```javascript 
node -e 'require("./src/visitors_controller").viewLastVisitor().then(console.log).catch(console.error)'
```

This will return the details of the most recent visitor for example: ```{ id: 4 }```.

#### 7. Deleting All Visitors

To delete all records in the visitors' table:

```javascript
deleteAllVisitors().then(response=>console.log(response));
``` 
### Or 
```javascript 
node -e 'require("./src/visitors_controller").deleteAllVisitors().then(console.log).catch(console.error)'
```

On success, you'll see: `Deleted all visitors successfully`.

--- 

## Accessing the online form  


To access the online form you follow these steps: 

### Step 1: build the node container 

To build the node container run the following command: 

```bash 
  docker compose up 
``` 

### Step 2: Start the server 

Run the following command at the root of this project: 

```bash 
  node src/index.js 
```

### Step 3: Visit the online form 

Once all containers are running the online form will be available on the following url: 

> [online form: .../new_visitor: ](http:/localhost:3000/new_visitor)

--- 

## Interacting with the Visitor API 

There are six endpoints to interact with in order to perform CRUD operations with the visitors database. Several tools can be used to interact with the API, such as Postman, the REST API VSCode extension, or the Fetch API for manual and more granular control. In this documentation, the CLI tool `cURL` is used because of its simplicity.

---

### **1. List All Visitors**
**Endpoint:** `GET /visitors`

This endpoint retrieves a list of all visitors.

**Example cURL Request:**
```bash
curl -X GET http://localhost:3000/visitors
```

**Response:**
```json
{   
    "status": "success",
    "data": [
        {
            "id": 1,
            "name": "John Doe",
        }
    ]
}
```

---

### **2. Create a New Visitor**
**Endpoint:** `POST /visitors`

This endpoint allows you to add a new visitor to the database.

**Example cURL Request:**
```bash
curl -X POST http://localhost:3000/visitors \
     -H "Content-Type: application/json" \
     -d '{
         "name": "John Doe",
         "age": 30,
         "dateOfVisit": "2025-02-09",
         "timeOfVisit": "14:00",
         "assistorName": "Jane Smith",
         "comments": "Great visit"
     }'
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "id": 2,
        "name": "John Doe",
        "age": 30,
        "dateOfVisit": "2025-02-09",
        "timeOfVisit": "14:00",
        "assistorName": "Jane Smith",
        "comments": "Great visit"
    }
}
```

---

### **3. Get a Specific Visitor by ID**
**Endpoint:** `GET /visitors/:id`

This endpoint retrieves the details of a specific visitor by their ID.

**Example cURL Request:**
```bash
curl -X GET http://localhost:3000/visitors/1
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "John Doe",
        "age": 30,
        "dateOfVisit": "2025-02-09",
        "timeOfVisit": "14:00",
        "assistorName": "Jane Smith",
        "comments": "Great visit"
    }
}
```

---

### **4. Update a Visitor Record**
**Endpoint:** `PUT /visitors/:id`

This endpoint updates a specific visitor's details.

**Example cURL Request:**
```bash
curl -X PUT http://localhost:3000/visitors/1 \
     -H "Content-Type: application/json" \
     -d '{"name": "John Updated"}'
```

**Response:**
```json
{   
    "status": "success",
    "message": "Visitor updated successfully"
}
```

---

### **5. Delete a Specific Visitor**
**Endpoint:** `DELETE /visitors/:id`

This endpoint removes a visitor from the database.

**Example cURL Request:**
```bash
curl -X DELETE http://localhost:3000/visitors/1
```

**Response:**
```json
{   
    "status": "success",
    "message": "Visitor deleted successfully"
}
```

---

### **6. Delete All Visitors**
**Endpoint:** `DELETE /visitors`

This endpoint removes all visitors from the database.

**Example cURL Request:**
```bash
curl -X DELETE http://localhost:3000/visitors
```

**Response:**
```json
{   
    "status": "success",
    "message": "All visitors deleted successfully"
}
```

---

### **Error Handling**
The API returns appropriate error messages with status codes:

- `400 Bad Request` → When missing required fields or providing invalid data.
- `404 Not Found` → When trying to retrieve, update, or delete a non-existent visitor.
- `500 Internal Server Error` → When something goes wrong on the server.

Example error response:
```json
{   
    "status": "error",
    "error": "Visitor with ID 99 does not exist"
}
```

---


