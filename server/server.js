const express = require('express');
const path = require('path');
const fs = require('fs');
const createRoutes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database.json');

const db = {
  data: fs.existsSync(dbPath)
    ? JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    : { products: [], users: [], cart: [], orders: [] },
  write() {
    fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2));
  }
};

app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));
app.use('/api', createRoutes(db));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
