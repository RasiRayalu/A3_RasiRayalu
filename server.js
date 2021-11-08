const express = require('express') // Importing express server
const bodyParser = require('body-parser'); // Importing body parser to parsing the body in http
const app = express()
app.use(bodyParser.urlencoded({ extended: true })); // Setting up body parser
app.use(bodyParser.json()) // Setting up body parser for json data

// Get enpoint to serve the index html page
app.get('/', (req, res) => {
    console.log(__dirname)
    res.sendFile(__dirname + '/index.html')
})

// Post endpoint to submit form data
app.post('/submit', (req, res) => {
    console.log(req.body)
    // Taking the form data from the request body
    const data = req.body
    // Valdiating the data using validateData function
    const errors = validateData(data)
    if(errors !== "") {
        const map = {
            error: errors
        }
        // Error response when error is present
        res.send(JSON.stringify(map))
    }
    const response = {
        ...data
    }
    let cosmonaut = 0
    let milkshake = 0
    // If cosmonaut product is present, adding it to the receipt
    if(data.cosmonautCount > 0) {
        cosmonaut = Number(data.cosmonautCount) * 5
        response.cosmonaut = cosmonaut
    }
    // If milkshake product is found, adding it to the milkshake
    if(data.milkshakeCount > 0) {
        milkshake = Number(data.milkshakeCount) * 9
        response.milkshake = milkshake
    }
    let total = cosmonaut + milkshake
    response.tax = (total * 0.13), // Tax calculation. 13% tax
    response.total = total + (total * 0.13) // Adding tax to the total
    res.send(JSON.stringify(response))
})

app.get('/receipt', (req, res) =>{
    res.sendFile(__dirname + '/receipt.html')
})

// Serving static files
app.use(express.static('assets'))

app.listen(3000)
console.log('server is listening on port 3000')

// Validating the data 
const validateData = (data) => {
    // Phone regex to validate phone number
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    // Email regex to validate email id
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    let error = "";
    // Validation for name
    if(!data.name || data.name === "") {
        error += "Name is mandatory \n"
    }
    // Validation for address
    if(!data.address || data.address === "") {
        error += "Address is mandatory \n"
    }
    // Validation for city
    if(!data.city || data.city === "") {
        error += "City is mandatory \n"
    }
    // Validation for province
    if(!data.province || data.province === "") {
        error += "Province is mandatory \n"
    }
    // Validation for phone
    if(!data.phone || data.phone === "") {
        error += "Phone is mandatory\n"
    } else if(!phoneRegex.test(data.phone)) { // Checking for a valid phone number
        error += "Please enter a valid phone number\n"
    }
    // Validation for email
    if(!data.email || data.email === "") {
        error += "Email is mandatory\n"
    } else if(!emailRegex.test(data.email)) {// Checking for email
        error += "Please enter a valid email id\n"
    }
    // Calculating the price of cosmonaut and milkshake
    const cosmonaut = Number(data.cosmonautCount) * 5
    const milkshake = Number(data.milkshakeCount) * 9
    // Validating minimum purchase
    if((cosmonaut+ milkshake) < 10) {
        error += "Minimum purchase of 10$ should be done"
    }
    return error;
}