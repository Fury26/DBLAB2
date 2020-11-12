const {Router} =  require('express')
const pool = require('../db')
const router = Router()

//returns all records in the table
router.get('/clubs_tournaments', async(req, res) => {
    try {
        const clubs_tournamentss = await pool.query('SELECT * FROM clubs_tournaments;')
        res.json(clubs_tournamentss.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message)
    }
})

//returns all rows which match to given paramatres
router.post('/clubs_tournaments/search', async(req, res) => {
    try {
        const {club_id, tournament_id} = req.body
        let qu = `SELECT * FROM clubs_tournaments WHERE TRUE `
        if(club_id !== undefined && club_id.length !== 0) {
            qu += `AND club_id = ${club_id} `
        }
        if(tournament_id !== undefined && tournament_id.length !== 0) {
            qu += ` AND tournament_id = ${tournament_id} `
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
router.post('/clubs_tournaments/new', async(req, res) => {
    try {
        const {club_id, tournament_id} = req.body
        let qu = `INSERT INTO clubs_tournaments(club_id, tournament_id) values (${club_id}, ${tournament_id});`
        let response = await pool.query(qu)
        qu = `SELECT * FROM clubs_tournaments ORDER BY id DESC FETCH FIRST 1 ROW ONLY;`
        response = await pool.query(qu)
        //response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//changes record with given id 
router.put('/clubs_tournaments/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {club_id, tournament_id} = req.body
        let qu = `UPDATE clubs_tournaments SET club_id = ${club_id}, teams_count = ${tournament_id} WHERE id = ${id};`
        
        let response = await pool.query(qu)
        qu = `SELECT * FROM clubs_tournaments WHERE id = ${id};`
        response = await pool.query(qu)
        res.json(response.rows[0])
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//delete record by given id
router.delete('/clubs_tournaments/:id', async(req, res) => {
    try {
        const {id} = req.params
        const qu = `DELETE FROM clubs_tournaments where id = ${id};`
        const response = await pool.query(qu)
        
        res.json('Successfuly deleted')
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message)
    }
})



module.exports = router