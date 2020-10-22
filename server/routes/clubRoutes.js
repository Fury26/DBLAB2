const {Router} =  require('express')
const pool = require('../db')
const router = Router()

//returns all records in the table
router.get('/club', async(req, res) => {
    try {
        const clubs = await pool.query('SELECT * FROM club ORDER BY id;')
        res.json(clubs.rows)
    } catch (error) {
        console.log(error.message)
    }
})

//returns all rows which match to given paramatres
router.post('/club/search', async(req, res) => {
    try {
        const {name} = req.body
        const qu = `SELECT * FROM club WHERE LOWER(name) LIKE \'%${name}%\'`
        const response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        console.log(error.message);
    }
})

//create new record into the table by givin information
router.post('/club/new', async(req, res) => {
    try {
        const {name} = req.body
        let qu = `INSERT INTO club(name) values (\'${name}\');`
        let response = await pool.query(qu)
        qu = `SELECT * FROM club ORDER BY id DESC FETCH FIRST 1 ROW ONLY;`
        response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        console.log(error.message);
    }
})

//create random record
router.post('/club/rand', async(req, res) => {
    try {
        const {count} = req.body
        let qu = `INSERT INTO club(name) select getrandomstring(10) as name from generate_series(1, ${count});`
        let response = await pool.query(qu)
        qu = `SELECT * FROM club ORDER BY id DESC FETCH FIRST ${count} ROW ONLY;`
        response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        console.log(error.message);
    }
})

//changes record with given id 
router.put('/club/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {name} = req.body
        let qu = `UPDATE club SET name = \'${name}\' WHERE id = ${id};`
        
        let response = await pool.query(qu)
        qu = `SELECT * FROM club WHERE id = ${id};`
        response = await pool.query(qu)
        res.json(response.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})

//delete record by given id
router.delete('/club/:id', async(req, res) => {
    try {
        const {id} = req.params
        const qu = `DELETE FROM club_stadium WHERE club_id = ${id};
        DELETE FROM clubs_tournaments WHERE club_id = ${id};
        DELETE FROM match WHERE home_club_id = ${id} OR away_club_id = ${id};
        UPDATE player SET club_id = NULL WHERE club_id = ${id};
        DELETE FROM club WHERE id = ${id};`
        const response = await pool.query(qu)
        
        res.json('Successfuly deleted')
    } catch (error) {
        console.log(error.message)
    }
})



module.exports = router