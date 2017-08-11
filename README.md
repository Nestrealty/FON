# FON
My FON List

# Synopsis
Creating and managing database system for Nest Realty's Agents and their clients

# Installation 
Clone the repository and follow these commands after entering working directory:

npm install 

To Start the Express Server:

nodemon server.js

To Start the React App:

npm start

# Platforms
The server is run on Express.js and the front end was made by create-react-app. 

# Accounts
It is necessary to have a MongoDB Account. This can be done through MongoDB Atlas, which provides a cluster to store and manage data.
Replace the Mongoose connection in server.js with a MongoDB URI that is provided to you after creating a cluster in Atlas. 

# Note
Before deployment, consider that the server is run on local host (Port 4000). The Client side is run on local host (Port 3000). 
However, package.json has a proxy server which forwards requests made from Port 3000 to 4000. This project has not been deployed yet.

# Remarks
The project is functional and meets the expectations for Nest Realty. All it needs is an expert in deployment. 


