# Friend Circle Application

## Overview

**Friend Circle** is a full-stack web application developed using the MERN stack (MongoDB, Express.js, React.js, Node.js). The app allows users to search for and add friends, manage their friend lists, view user profiles, and receive friend recommendations based on mutual connections and interests. The platform is optimized for performance, offering a smooth user experience with a responsive design.


[Try out Friend Circle](https://friend-connections.vercel.app/) 

## Features

1. **User Authentication:**
   - Secure signup, login, and authentication with JWT.
     
2. **Search Users:**
   - Search functionality to find and add friends.
     
3. **Friend Requests:**
   - Send, accept, and reject friend requests.
     
4. **Friend Recommendation System:**
   - Suggest friends based on mutual connections and interests.
     
5. **Friend Management:**
   - Manage friend lists with the ability to unfriend/unfollow users.
     
6. **User Discovery:**
   - Explore more users for connection via a dedicated page.
     
7. **User Profiles:**
   - Each user has a profile that can be viewed by other users.
     

## Functional Requirements

### 1. User Authentication
- **Sign Up:** Users can create an account by providing a unique username and password.
- **Login:** Secure login functionality to allow users to access their account.
- **Authentication:** JWT (JSON Web Token) is used to secure user sessions, ensuring only authenticated users can access protected routes.

### 2. Home Page
- Displays a list of 10-15 users available for connecting. A button labeled **"Explore More"** allows users to be redirected to a dedicated **Discover Users** page where more users are available for connection.
- Shows friend recommendations based on mutual connections and interests directly on the dashboard.
- Displays the user's current friend list with a button **"View All Friends"** that redirects to a **Friends List** page for managing connections.
- Includes links to **"Friend Requests Sent"** and **"Friend Requests Received"** pages, allowing easy navigation to manage outgoing and incoming friend requests.

### 3. Add Friend Feature
- **Search Users:** Users can search for other registered users through a search bar.
- **Send Friend Requests:** Allows users to send and receive friend requests.
- **Manage Requests:** Users can accept or reject incoming friend requests via a user-friendly interface.

### 4. Friend Recommendation System
- **Mutual Friends:** The system suggests potential friends based on the number of mutual connections.
- **Common Interests:** If interests are part of the user profile, the recommendation system can use this information to suggest friends with similar hobbies or interests.
- **Display Recommendations:** Friend recommendations are dynamically displayed on the user's dashboard for ease of discovery.

### 5. User Profiles
- **Profile Creation:** Each user has a profile that can include details like their interests, hobbies, and mutual connections.
- **View Profiles:** Users can view the profiles of other users, allowing them to see information like interests, mutual friends, and more before sending a friend request.
  
## State Management
- The application leverages **Redux** for managing global application state, ensuring smooth data flow between components and efficient handling of user interactions.

## RESTful API Implementation
- The backend implements **RESTful APIs** to facilitate communication between the client and server. The APIs handle functionalities such as:
  - **User Authentication**
  - **Friend Requests Management**
  - **Friend Recommendation**
  - **User Search and Discovery**
  - **Profile Viewing**
  
  This modular approach ensures scalability, maintainability, and clear separation of concerns.

## Technical Requirements

### Languages & Frameworks:
- **Frontend:** Built using React.js, with reusable components and Tailwind CSS for utility-first styling. State management is handled through Redux, with Redux Thunk to manage asynchronous actions and API calls efficiently.
- **Backend:** Developed using Node.js with the Express.js framework to handle server-side logic, routing, and API creation.
- **Database:** MongoDB is used as the primary database to store user data, friend lists, and connection recommendations.
- **Authentication:** JWT is implemented to secure user sessions and APIs, providing a robust layer of security.

### Version Control:
- The application is managed using Git for source code version control, ensuring development tracking and collaboration.

## Installation & Setup

### Prerequisites:
Ensure that you have the following tools installed on your local machine:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [MongoDB](https://www.mongodb.com/) (local instance or cloud)
- [Git](https://git-scm.com/)

### Steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/JineshPrajapat/FriendCircle
   cd FriendCircle
   
2. **Install Dependencies:**
 
   ```bash
    cd Client
    npm install
    cd ../Server
    npm install

3. **Configure Environment Variables:**
   
   ```bash
   MONGO_URI=<your_mongodb_uri>
   ACCESS_TOKEN_SECRET=<your_jwt_secret>
   REFRESH_TOKEN_SECRET=<your_jwt_secret>
   ACCESS_TOKEN_EXPIRATION=<your_access_token_expiry_time>
   REFRESH_TOKEN_EXPIRATION=<your_refresh_token_expiry_time>

4. **Run the Application::**
   
   ```bash
   # Start the backend server
   cd Server
   npm run dev

   # Start the frontend
   cd client
   npm run dev

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software in accordance with the license terms.

## Contact

For any questions, suggestions, or issues, feel free to reach out to the project maintainer at [prajapatjinesh585@gmail.com](mailto:prajapatjinesh585@gmail.com).