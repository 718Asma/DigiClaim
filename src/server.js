//import the necessary Node.js modules 
const express = require('express'); //for creating a web server (express),
const bodyParser = require('body-parser');  //parsing JSON data (body-parser), 
const cors = require('cors'); //enabling Cross-Origin Resource Sharing (cors), and 
const multer = require('multer'); //which is a middleware for handling multipart/form-data, typically used for file uploads
const path = require('path'); //for working with file and directory paths (path)
const pg = require('pg'); //interacting with PostgreSQL databases (pg)

const app = express();  //express() creates an instance of the Express application that will be used to define routes, middleware, and handle HTTP requests and responses.
const port = 5000;  //specifies the port on which the server will listen for incoming requests

app.use(cors());  //Configures Cross-Origin Resource Sharing, allowing the server to handle requests from different origins
app.use(bodyParser.json()); //Configures the application to parse JSON data in incoming requests

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Stage',
  password: 'system',
  port: 3000,
}); //Creates a PostgreSQL connection pool using the pg.Pool class. The pool manages and optimizes the use of multiple connections to the database

// Define a route to retrieve all claims from the database to /api/claims
app.get('/api/claims', async (req, res) => { //The route is defined using the app.get() method, which takes two arguments: the path to the route and a callback function that will be executed when the route is requested
  try
  { //The callback function is defined using the async keyword, which allows the use of the await keyword within the function. The await keyword is used to wait for the result of an asynchronous operation before continuing execution of the function.
    // Connect to the database using the connection pool
    const client = await pool.connect();

    // Execute a SELECT query to fetch all claims from the 'claim' table
    const result = await client.query('SELECT * FROM claim ORDER BY creation_date DESC');

    // Extract the retrieved claims from the query result
    const claims = result.rows;

    // Release the database connection back to the pool
    client.release();

    // Send the retrieved claims as JSON in the response
    res.json(claims);
  }
  catch (error)
  {
    // Handle any errors that occur during database interaction
    console.error('Error executing query', error);
    
    // Send a 500 Internal Server Error response if an error occurs
    res.status(500).send('Internal Server Error');
  }
});

// Define a route to retrieve a claim by claim_number
app.get('/api/claims/:claim_id', async (req, res) => {
  try {
    const { claim_id } = req.params;

    const client = await pool.connect();

    const result = await client.query('SELECT * FROM claim WHERE claim_number = $1', [claim_id]);

    const claim = result.rows[0];

    client.release();

    if (!claim) {
      return res.status(404).send('Claim not found.');
    }

    res.json(claim);
  } catch (error) {
    console.error('Error retrieving claim:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to add a new claim
app.post('/api/claims', async (req, res) => {
  try {
    const { claim_number, accident_date, creation_date, status, contract_number } = req.body;

    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO claim (claim_number, accident_date, creation_date, status, contract_number) VALUES ($1, $2, $3, $4, $5)',
      [claim_number, accident_date, creation_date, status, contract_number]
    );

    client.release();

    // Send a success response in JSON format
    res.status(200).json({ message: 'Claim added successfully.' });
  } catch (error) {
    console.error('Error adding claim:', error);
    
    // Send an error response in JSON format
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a claim by number
app.delete('/api/claims/:claim_number', async (req, res) => {
  const { claim_number } = req.params;

  try {
    const client = await pool.connect();

    // Execute a DELETE query to remove the claim from the database
    const result = await client.query('DELETE FROM claim WHERE claim_number = $1', [claim_number]);

    client.release();

    // Check if any rows were affected by the deletion
    if (result.rowCount === 0) {
      // If no rows were affected, the claim with the given ID was not found
      return res.status(404).json({ message: 'Claim not found.' });
    }

    // Send a success response indicating that the claim was deleted
    res.json({ message: 'Claim deleted successfully.' });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to update a claim by ID
app.put('/api/claims/:claim_id', async (req, res) => {
  const { claim_id } = req.params;
  const { claim_number, accident_date, creation_date, status, contract_number, insured_name, vehicle_registration_number } = req.body;

  try {
    const client = await pool.connect();

    // Execute an UPDATE query to modify the claim in the database
    const result = await client.query(
      'UPDATE claim SET claim_number = $1, accident_date = $2, creation_date = $3, status = $4, contract_number = $5, insured_name = $6, vehicle_registration_number = $7 WHERE claim_number = $8',
      [claim_number, accident_date, creation_date, status, contract_number, insured_name, vehicle_registration_number, claim_id]
    );

    client.release();

    // Check if any rows were affected by the update
    if (result.rowCount === 0) {
      // If no rows were affected, the claim with the given ID was not found
      return res.status(404).send('Claim not found.');
    }

    // Send a success response indicating that the claim was updated
    res.send('Claim updated successfully.');
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to retrieve user information
app.get('/api/users', async (req, res) => {
  try
  {
    const client = await pool.connect();

    const result = await client.query('SELECT * FROM users');

    const users = result.rows;

    client.release();

    res.json(users);
  }
  catch (error)
  {
    console.error('Error executing query', error);
    
    res.status(500).send('Internal Server Error');
  }
});

// Route to retrieve contract information
app.get('/api/contract', async (req, res) => {
  try
  {
    const client = await pool.connect();

    const result = await client.query('SELECT * FROM contract');

    const users = result.rows;

    client.release();

    res.json(users);
  }
  catch (error)
  {
    console.error('Error executing query', error);
    
    res.status(500).send('Internal Server Error');
  }
});

// Route to add a new contract
app.post('/api/contract', async (req, res) => {
  try {
    const { contract_number, contract_start_date, contract_end_date, insured_name, vehicle_registration_number } = req.body;

    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO contract (contract_number, contract_start_date, contract_end_date, insured_name, vehicle_registration_number) VALUES ($1, $2, $3, $4, $5)',
      [contract_number, contract_start_date, contract_end_date, insured_name, vehicle_registration_number]
    );

    client.release();

    // Send a success response in JSON format
    res.status(200).json({ message: 'Contract added successfully.' });
  } catch (error) {
    console.error('Error adding contract:', error);
    
    // Send an error response in JSON format
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to retrieve insured information
app.get('/api/insured', async (req, res) => {
  try
  {
    const client = await pool.connect();

    const result = await client.query('SELECT * FROM insured');

    const users = result.rows;

    client.release();

    res.json(users);
  }
  catch (error)
  {
    console.error('Error executing query', error);
    
    res.status(500).send('Internal Server Error');
  }
});

// Route to add a new insured
app.post('/api/insured', async (req, res) => {
  try {
    const { insured_name, insured_address, insured_phone_number, insured_email, insured_birth_date } = req.body;

    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO Insured (insured_name, insured_address, insured_phone_number, insured_email, insured_birth_date) VALUES ($1, $2, $3, $4, $5)',
      [insured_name, insured_address, insured_phone_number, insured_email, insured_birth_date]
    );

    client.release();

    // Send a success response in JSON format
    res.status(200).json({ message: 'Insured added successfully.' });
  } catch (error) {
    console.error('Error adding insured:', error);
    
    // Send an error response in JSON format
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to retrieve vehicle information
app.get('/api/vehicle', async (req, res) => {
  try
  {
    const client = await pool.connect();

    const result = await client.query('SELECT * FROM vehicle');

    const users = result.rows;

    client.release();

    res.json(users);
  }
  catch (error)
  {
    console.error('Error executing query', error);
    
    res.status(500).send('Internal Server Error');
  }
});

// Route to add a new vehicle
app.post('/api/vehicle', async (req, res) => {
  try {
    const { vehicle_registration_number, vehicle_brand, vehicle_model, vehicle_type, vehicle_registration_date, vehicle_fuel, vehicle_gearbox, vehicle_color } = req.body;

    const client = await pool.connect();

    const result = await client.query(
      'INSERT INTO Vehicle (vehicle_registration_number, vehicle_brand, vehicle_model, vehicle_type, vehicle_registration_date, vehicle_fuel, vehicle_gearbox, vehicle_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [vehicle_registration_number, vehicle_brand, vehicle_model, vehicle_type, vehicle_registration_date, vehicle_fuel, vehicle_gearbox, vehicle_color]
    );

    client.release();

    // Send a success response in JSON format
    res.status(200).json({ message: 'Vehicle added successfully.' });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    
    // Send an error response in JSON format
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to retrieve photo information
app.get('/api/photo', async (req, res) => {
  try
  {
    const client = await pool.connect();

    const result = await client.query('SELECT * FROM photo ORDER BY photo_name ASC');

    const users = result.rows;

    client.release();

    res.json(users);
  }
  catch (error)
  {
    console.error('Error executing query', error);
    
    res.status(500).send('Internal Server Error');
  }
});

// Define a route to retrieve a photo by photo_id
app.get('/api/photo/:photo_id', async (req, res) => {
  try {
    const { photo_id } = req.params;

    const client = await pool.connect();

    const result = await client.query('SELECT * FROM Photo WHERE photo_id = $1', [photo_id]);

    const photo = result.rows[0];

    client.release();

    if (!photo) {
      return res.status(404).send('Photo not found.');
    }

    res.json(photo);
  } catch (error) {
    console.error('Error retrieving photo:', error);
    res.status(500).send('Internal Server Error');
  }
});

const UPLOADS_DIR = 'C:\\Users\\718as\\Desktop\\DSI 202\\Stage\\Stage2\\src\\assets'; // The directory where uploaded files will be stored

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to handle photo uploads
app.post('/api/photo/upload', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  const filePath = path.resolve(req.file.path);
  const { photo_name, photo_date, claim_number } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO photo (photo_id, photo, photo_name, photo_date, claim_number) VALUES (uuid_generate_v4(), $1, $2, $3, $4)',
      [filePath, photo_name, photo_date, claim_number]
    );
    client.release();
    res.json({ message: 'File uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to delete a photo by ID
app.delete('/api/photo/:photo_id', async (req, res) => {
  const { photo_id } = req.params;

  try {
    const client = await pool.connect();

    // Execute a DELETE query to remove the photo from the database
    const result = await client.query('DELETE FROM photo WHERE photo_id = $1', [photo_id]);

    client.release();

    // Check if any rows were affected by the deletion
    if (result.rowCount === 0) {
      // If no rows were affected, the photo with the given ID was not found
      return res.status(404).json({ message: 'Photo not found.' });
    }

    // Send a success response indicating that the photo was deleted
    res.json({ message: 'Photo deleted successfully.' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to update a photo by ID
app.put('/api/photo/:photo_id', async (req, res) => {
  const { photo_id } = req.params;
  const { photo_name, photo_date, claim_number } = req.body;

  try {
    const client = await pool.connect();

    // Execute an UPDATE query to modify the photo in the database
    const result = await client.query(
      'UPDATE photo SET photo_name = $1, photo_date = $2, claim_number = $3 WHERE photo_id = $4',
      [photo_name, photo_date, claim_number, photo_id]
    );

    client.release();

    // Check if any rows were affected by the update
    if (result.rowCount === 0) {
      // If no rows were affected, the photo with the given ID was not found
      return res.status(404).json({ error: 'Photo not found.' });
    }

    // Send a success response indicating that the photo was updated
    res.json({ message: 'Photo updated successfully.' });
  }
  catch (error)
  {
    console.error('Error updating photo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Define a default route to test the server
app.get('/', (req, res) => {  //Defines a default route for handling GET requests to the root path (/)
  res.send('Server is up and running!'); // Send a simple message indicating that the server is operational
});

app.listen(port, () => {  //Starts the server and listens on the specified port. Logs a message to the console once the server is successfully started
  console.log(`Server is listening on port ${port}`);
});