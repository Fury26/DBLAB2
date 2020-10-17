const {Router} =  require('express')
const pool = require('../db')
const tables = require('./table_names')
const router = Router()


router.get('/club', async(req, res) => {
    try {
        const clubs = await pool.query('SELECT * FROM club;')

        res.json(clubs.rows)
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/club/search', async(req, res) => {
    try {
        const {name} = req.body
        console.log(req.body);
        const qu = `SELECT * FROM club WHERE LOWER(name) LIKE \'%${name}%\'`
        console.log(qu)
        const response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        console.log(error.message);
    }
})

router.post('/club/new', async(req, res) => {
    try {
        const {name} = req.body
        let qu = `INSERT INTO club(name) values (\'${name}\');`
        console.log(qu)
        let response = await pool.query(qu)
        qu = `SELECT * FROM ${tables.club} ORDER BY id DESC FETCH FIRST 1 ROW ONLY;`
        response = await pool.query(qu)
        //response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        console.log(error.message);
    }
})

router.put('/club/:id', async(req, res) => {
    try {
        console.log('PUT on server')
        const {id} = req.params
        const {name} = req.body
        let qu = `UPDATE club SET name = \'${name}\' WHERE id = ${id};`
        
        console.log(qu)
        let response = await pool.query(qu)
        qu = `SELECT * FROM club WHERE id = ${id};`
        response = await pool.query(qu)
        console.log(response.rows);
        res.json(response.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})


router.delete('/club/:id', async(req, res) => {
    try {
        const {id} = req.params
        console.log(id);
        const qu = `DELETE FROM ${tables.club_stadium} WHERE club_id = ${id};
        DELETE FROM ${tables.clubs_tournaments} WHERE club_id = ${id};
        DELETE FROM ${tables.match} WHERE home_club_id = ${id} OR away_club_id = ${id};
        UPDATE ${tables.player} SET club_id = NULL WHERE club_id = ${id};
        DELETE FROM ${tables.club} WHERE id = ${id};`
        const response = await pool.query(qu)
        
        res.json('Successfuly deleted')
    } catch (error) {
        console.log(error.message)
    }
})



module.exports = router