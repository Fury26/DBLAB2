const {Router} =  require('express')
const pool = require('../db')
const router = Router()

const selectAll = 'SELECT id, tournament_id, home_club_id, away_club_id, to_char(datetime, \'Mon/DD/YYYY\') as datetime, result, concat(\'$\', ticket_cost::numeric) as ticket_cost FROM'

//returns all records in the table
router.get('/match', async(req, res) => {
    try {
        const matchs = await pool.query(`${selectAll} match;`)
        res.json(matchs.rows)
    } catch (error) {
        res.status(400).json('Error');

        console.log(error.message)
    }
})

//returns all rows which match to given paramatres
router.post('/match/search', async(req, res) => {
    try {
        let {result, tournament_id, home_club_id, away_club_id, ticket_cost, datetime} = req.body
        let qu = `${selectAll} match WHERE TRUE `
        if(result !== undefined && result.length !== 0) {
            qu += `AND LOWER(result) LIKE LOWER(\'%${result}%\') `
        }
        if(home_club_id !== undefined && home_club_id.length !== 0) {
            qu += `AND home_club_id = ${home_club_id} `
        }
        if(away_club_id !== undefined && away_club_id.length !== 0) {
            qu += `AND away_club_id = ${away_club_id} `
        }
        if(tournament_id !== undefined && tournament_id.length !== 0) {
            qu += `AND tournament_id = ${tournament_id} `
        }
        if(ticket_cost !== undefined && ticket_cost.length !== 0) {
            qu += `AND ticket_cost::integer = ${ticket_cost} `
        }
        if(datetime !== undefined && datetime.length !== 0) {
            qu += `AND datetime::date = '${datetime}'::date`
        }
        qu += ';'

        const response = await pool.query(qu)
        res.json(response.rows)
        //res.json('Server has got a data')
    } catch (error) {
        res.status(400).json('Error');

        console.log(error.message);
    }
})

//create new record into the table by givin information
router.post('/match/new', async(req, res) => {
    try {
        let {result, tournament_id, home_club_id, away_club_id, ticket_cost, datetime} = req.body
        let qu = `INSERT INTO match(tournament_id, result, away_club_id, home_club_id, datetime, ticket_cost) values (${tournament_id}, \'${result}\', ${away_club_id}, ${home_club_id}, \'${datetime}\'::timestamp, \'${ticket_cost}\'::money);`
         
        let response = await pool.query(qu)
        qu = `${selectAll} match ORDER BY id DESC FETCH FIRST 1 ROW ONLY;`
        response = await pool.query(qu)
        //response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        console.log(error.message);
    }
})

//changes record with given id 
router.put('/match/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {result, tournament_id, home_club_id, away_club_id, ticket_cost, datetime} = req.body
        let qu = ` `

        if(result !== undefined && result.length !== 0) {
            qu += `result = \'${result}\' `
        }
        if(home_club_id !== undefined && home_club_id.length !== 0) {
            qu += `home_club_id = ${home_club_id} `
        }
        if(away_club_id !== undefined && away_club_id.length !== 0) {
            qu += `away_club_id = ${away_club_id} `
        }
        if(tournament_id !== undefined && tournament_id.length !== 0) {
            qu += `tournament_id = ${tournament_id} `
        }
        if(ticket_cost !== undefined && ticket_cost.length !== 0) {
            qu += `ticket_cost = \'${ticket_cost}\'::money `
        }
        if(datetime !== undefined && datetime.length !== 0) {
            qu += `datetime = '${datetime}'::timestamp`
        }
        if(qu[qu.length - 1] === ',') qu[qu.length - 1] = ' '
         
         
        let query2 = `UPDATE match SET ${qu} WHERE id = ${id};`
        let response = await pool.query(query2)
        qu = `${selectAll} match WHERE id = ${id};`
        response = await pool.query(qu)
        res.json(response.rows[0])
    } catch (error) {
        res.status(400).json('Error');

        console.log(error.message);
    }
})

//delete record by given id
router.delete('/match/:id', async(req, res) => {
    try {
        const {id} = req.params
        const qu = `DELETE FROM match WHERE id = ${id};`
        const response = await pool.query(qu)
        
        res.json('Successfuly deleted')
    } catch (error) {
        res.status(400).json('Error');

        console.log(error.message)
    }
})



module.exports = router