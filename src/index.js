require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const OpenApiValidator = require('express-openapi-validator');
const jwt = require('jsonwebtoken');

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
        validateSecurities: {
            handlers: {
                JWT: async (req, scopes, schema) => {
                    const authHeader = req.headers.authorization;
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                        throw { status: 401, message: 'Authorization header is missing or malformed' };
                    }
                    const token = authHeader.split(' ')[1];
                    try {
                        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');
                        req.user = decoded;
                        return true;
                    } catch (err) {
                        throw { status: 401, message: 'Invalid or expired token' };
                    }
                }
            }
        }
    })
);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

app.get('/v1/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/v2/hello', (req, res) => {
    res.json({
        message: 'Hello World!',
        version: 'v2',
        timestamp: new Date().toISOString()
    });
});

/*
###########################################
USERS MockData
###########################################
*/

const users = [
    {
        id: 1,
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
        password: 'password123'
    }, {
        id: 2,
        name: 'Jane Doe',
        age: 25,
        email: 'jane@example.com',
        password: 'password123'
    }, {
        id: 3,
        name: 'Bob Smith',
        age: 35,
        email: 'bob@example.com',
        password: 'password123'
    }
];

/* 
###########################################
PRODUCTS MockData
###########################################
*/
const products = [
    {
        id: 1,
        name: 'Laptop',
        description: 'A high performance laptop',
        price: 999.99,
        category: 'electronics',
        tags: ['computer', 'portable'],
        InStock: true,
        spacifications: {
            processor: 'Intel i7',
            ram: '16GB'
        },
        ratings: [
            {
                score: 5,
                comment: 'Excellent laptop!'
            }
        ]
    }
];

/* 
###########################################
CRUD USERS
###########################################
*/

app.post('/users', (req, res) => {
    const { name, age, email } = req.body;
    const numericId = Date.now();
    const newUser = {
        id: numericId,
        name,
        age,
        email,
        password: 'password123'
    };
    users.push(newUser);

    // Return ID as string to comply with the POST /users schema
    res.status(201).json({
        id: numericId.toString(),
        name: newUser.name,
        age: newUser.age,
        email: newUser.email
    });
});

app.post('/users/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

app.get('/users/me', (req, res) => {
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age
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
        ...users[userIndex],
        id: userId,
        name,
        age,
        email
    };

    res.json(users[userIndex]);
});

/*
###########################################
CRUD PRODUCTS
###########################################
*/

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/products', (req, res) => {
    const newProduct = {
        id: Date.now(),
        ...req.body
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
});

app.post('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = {
        id: productId,
        ...req.body
    };

    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(productIndex, 1);
    res.json({ message: 'Product deleted' });
});

/* 
###########################################
LISTEN
###########################################
*/
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}/v1`)
    console.log(`http://localhost:${PORT}/v2`);
});