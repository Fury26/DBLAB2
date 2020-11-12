const {Router} =  require('express')
const pool = require('../db')
const router = Router()

//returns all records in the table
router.get('/tournament', async(req, res) => {
    try {
        const tournaments = await pool.query('SELECT * FROM tournament;')

        res.json(tournaments.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message)
    }
})

//returns all rows which match to given paramatres
router.post('/tournament/search', async(req, res) => {
    try {
        const {title, teams_count} = req.body
        let qu = `SELECT * FROM tournament WHERE TRUE `
        if(teams_count !== undefined && teams_count.length !== 0) {
            qu += `AND teams_count = ${teams_count} `
        }
        if(title !== undefined && title.length !== 0) {
            qu += ` AND LOWER(title) LIKE LOWER(\'%${title}%\')`
        }
        qu += ';'
         ;
        const response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//create new record into the table by givin information
router.post('/tournament/new', async(req, res) => {
    try {
        const {title, teams_count} = req.body
        let qu = `INSERT INTO tournament(title, teams_count) values (\'${title}\', ${teams_count});`
         
        let response = await pool.query(qu)
        qu = `SELECT * FROM tournament ORDER BY id DESC FETCH FIRST 1 ROW ONLY;`
        response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//create random record
router.post('/tournament/rand', async(req, res) => {
    try {
        const {count} = req.body
        let qu = `INSERT INTO tournament(title, teams_count) select UPPER(getrandomstring(4)) as title, (10 + (randomnum(10))) as teams_count from generate_series(1, ${count});`
         
        let response = await pool.query(qu)
        qu = `SELECT * FROM tournament ORDER BY id DESC FETCH FIRST ${count} ROW ONLY;`
        response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//changes record with given id 
router.put('/tournament/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {title, teams_count} = req.body
        let qu = `UPDATE tournament SET title = \'${title}\', teams_count = ${teams_count} WHERE id = ${id};`
        
         
        let response = await pool.query(qu)
        qu = `SELECT * FROM tournament WHERE id = ${id};`
        response = await pool.query(qu)
        res.json(response.rows[0])
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//delete record by given id
router.delete('/tournament/:id', async(req, res) => {
    try {
        const {id} = req.params
        const qu = `DELETE FROM tournament where id = ${id};`
        const response = await pool.query(qu)
        
        res.json('Successfuly deleted')
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message)
    }
})



module.exports = router