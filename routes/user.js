const express = require('express')
const router = express.Router()

let userID;

router.get('/', (req, res) => {
    res.send("User List")
})

router.get('/new', (req, res) => {
    res.send("Creating a New User")
})  

// router.get('/:id', (req, res) => {
//     // Take the ID of the parameter that will call the functions of the parameter from the get header in this case is the id which is called by :id <--- variable type
//     res.send('Getting User with ID ${req.params.id}') // Still has some issues passing on the id variables from the parameters itself, but still needs some amount of knowledge.
// })

// Using advanced parameters to pass through the various methods to perform actions
router.route("/:id") // Pass through the values of the parameters before it can send through to get the route which is :/id 
    .get((req, res) => { // GET is used to get / request the values based on the id parameters
        res.send('Get User with ID ' + req.params.id)
    })
    .put((req, res) => { // Put is used to update the values
        res.send('Updated User with ID ' + req.params.id)
    })
    .delete((req, res) => { // Delete the value based on the http call DELETE function
        // Database codes here when modifying the code structure
        res.send('Deleted User with ID ' + req.params.id)
    })
module.exports = router