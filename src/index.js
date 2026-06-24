require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const OpenApiValidator = require('express-openapi-validator');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = YAML.load('openapi.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use(
    OpenApiValidator.middleware({
        apiSpec: swaggerDocument,
        validateRequests: true,
        validateResponses: true,
        ignorePaths: /.*\/docs$/,
    })
);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});

const users = [
    {
        id: 1,
        name: 'John Doe',
        age: 30,
        email: 'john@example.com'
    }, {
        id: 2,
        name: 'Jane Doe',
        age: 25,
        email: 'jane@example.com|'
    }, {
        id: 3,
        name: 'Bob Smith',
        age: 35,
        email: 'bob@example.com'
    }

];

app.post('/users', (req, res) => {
    const { name, age, email } = req.body;
    const numericId = Date.now();
    const newUser = {
        id: numericId,
        name,
        age,
        email
    };
    users.push(newUser);

    // Return ID as string to comply with the POST /users schema
    res.status(201).json({
        ...newUser,
        id: numericId.toString()
    });
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Return only id and name as integer and string to comply with GET /users/{id} schema
    res.json({
        id: user.id,
        name: user.name
    });
});

app.post('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const { name, age, email } = req.body;

    users[userIndex] = {
        id: userId,
        name,
        age,
        email
    };

    res.json(users[userIndex]);
});

app.listen(PORT, () => {
    console.log(`working app on http://localhost:${PORT}`);
});



