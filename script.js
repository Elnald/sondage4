const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

console.log('Starting server...');

// Middleware
app.use(express.json());
app.use(cors());

// Configuration de la base de données
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error('Database connection error:', err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

// Création de la table de votes
db.run('CREATE TABLE votes(id INTEGER PRIMARY KEY, candidate TEXT, ip_address TEXT)', (err) => {
    if (err) {
        return console.error('Table creation error:', err.message);
    }
    console.log('Table created successfully.');
});

// Route pour voter
app.post('/vote', (req, res) => {
    const { candidate } = req.body;
    const ip = req.ip;
    console.log(`Received vote for ${candidate} from IP ${ip}`);

    // Vérifier si l'utilisateur a déjà voté en utilisant une adresse IP
    db.get("SELECT * FROM votes WHERE ip_address = ?", [ip], (err, row) => {
        if (err) {
            console.error('Database select error:', err.message);
            res.status(500).send("Error in database operation");
        } else if (row) {
            res.status(409).send("Vous avez déjà voté !");
        } else {
            db.run('INSERT INTO votes(candidate, ip_address) VALUES(?, ?)', [candidate, ip], function(err) {
                if (err) {
                    console.error('Database insert error:', err.message);
                    res.status(500).send("Failed to record vote");
                } else {
                    res.send(`Merci d'avoir voté pour ${candidate}!`);
                }
            });
        }
    });
});

// Route pour obtenir les votes
app.get('/votes', (req, res) => {
    console.log('Fetching votes...');
    db.all("SELECT candidate, COUNT(*) as count FROM votes GROUP BY candidate", [], (err, rows) => {
        if (err) {
            console.error('Database select error:', err.message);
            res.status(500).send("Error in database operation");
        } else {
            res.json(rows);
        }
    });
});

// Route pour la racine (/) pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
    res.send('Welcome to the voting API!');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
