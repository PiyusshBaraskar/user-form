# user-form
# User Management System

A full-stack web application for managing user data with admin controls and MongoDB integration.

## Features

- User registration with unique user codes
- User information management (create, read, update, delete)
- Secure admin dashboard
- Password hashing and JWT authentication
- Responsive design
- Real-time feedback with toast notifications

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/user-management-system.git
cd user-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB service:
```bash
# On Windows
net start MongoDB

# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

4. Start the server:
```bash
node server.js
```

5. Access the application:
- Main page: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin.html`

## Default Admin Credentials

```
Username: admin
Password: admin123
```

**Important**: Change these credentials after first login for security purposes.

## Project Structure

```
user-management-system/
├── public/
│   ├── index.html       # Main user interface
│   ├── update.html      # User update page
│   └── admin.html       # Admin dashboard
├── server.js            # Backend server code
└── package.json         # Project dependencies
```

## API Endpoints

- `POST /api/users` - Create new user
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (requires admin token)
- `POST /api/admin/login` - Admin login

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Font Awesome icons
 
- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - Bcrypt for password hashing

## Security Features

- Password hashing using bcrypt
- JWT-based authentication for admin actions
- CORS enabled
- Input validation
- Secure password storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Troubleshooting

### Common Issues

1. MongoDB Connection Error:
```bash
# Check if MongoDB is running
mongod --version
# Start MongoDB if not running
sudo systemctl start mongod
```

2. Port Already in Use:
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

3. Module Not Found Error:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Contact

For support or queries, please open an issue in the GitHub repository.

## Future Enhancements

- Email verification
- Password reset functionality
- User roles and permissions
- Activity logging
- Data export feature
- Bulk user operations
