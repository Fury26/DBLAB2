const {Router} =  require('express')
const pool = require('../db')
const router = Router()

//returns all records in the table
router.get('/club_stadium', async(req, res) => {
    try {
        const club_stadiums = await pool.query('SELECT * FROM club_stadium;')
        res.json(club_stadiums.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message)
    }
})

//returns all rows which match to given paramatres
router.post('/club_stadium/search', async(req, res) => {
    try {
        const {club_id, stadium_id} = req.body
        let qu = `SELECT * FROM club_stadium WHERE TRUE `
        if(club_id !== undefined && club_id.length !== 0) {
            qu += `AND club_id = ${club_id} `
        }
        if(stadium_id !== undefined && stadium_id.length !== 0) {
            qu += ` AND stadium_id = ${stadium_id} `
        }
        qu += ';'
        const response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//create new record into the table by givin information
router.post('/club_stadium/new', async(req, res) => {
    try {
        const {club_id, stadium_id} = req.body
        let qu = `INSERT INTO club_stadium(club_id, stadium_id) values (${club_id}, ${stadium_id});`
        let response = await pool.query(qu)
        qu = `SELECT * FROM club_stadium ORDER BY club_id DESC FETCH FIRST 1 ROW ONLY;`
        response = await pool.query(qu)
        //response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//changes record with given id 
router.put('/club_stadium/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {club_id, stadium_id} = req.body
        let qu = `UPDATE club_stadium SET club_id = ${club_id}, teams_count = ${stadium_id} WHERE id = ${id};`
        
        let response = await pool.query(qu)
        qu = `SELECT * FROM club_stadium WHERE id = ${id};`
        response = await pool.query(qu)
        console.log(response.rows);
        res.json(response.rows[0])
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//delete record by given id
router.delete('/club_stadium/:id', async(req, res) => {
    try {
        const {id} = req.params
        const qu = `DELETE FROM club_stadium where id = ${id};`
        const response = await pool.query(qu)
        
        res.json('Successfuly deleted')
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message)
    }
})



module.exports = router