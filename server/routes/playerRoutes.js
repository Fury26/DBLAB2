const {Router} =  require('express')
const pool = require('../db')
const router = Router()

const selectAll = 'SELECT id, firstname, lastname, club_id, FORMAT(birthday::varchar, \'d\', \'en-US\') as birthday FROM'

//returns all records in the table
router.get('/player', async(req, res) => {
    try {
        const players = await pool.query(`${selectAll} player;`)
        res.json(players.rows)
    } catch (error) {
        res.status(400).json('Error');
    
        console.log(error.message)
    }
})

//create random record
router.post('/player/rand', async(req, res) => {
    try {
        const {count} = req.body
        let qu = `INSERT INTO player(name) select getrandomstring(10) as firstname, getrandomstring(10) as lastname, getrandomdate() as birthday, from generate_series(1, ${count});`
         
        let response = await pool.query(qu)
        qu = `${selectAll} player ORDER BY id DESC FETCH FIRST ${count} ROW ONLY;`
        response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//returns all rows which match to given paramatres
router.post('/player/search', async(req, res) => {
    try {
        let {lastname, firstname, club_id, birthday} = req.body
        let qu = `${selectAll} player WHERE TRUE `
        if(lastname !== undefined && lastname.length !== 0) {
            qu += `AND LOWER(lastname) LIKE \'%${lastname}%\' `
        }
        if(firstname !== undefined && firstname.length !== 0) {
            qu += `AND LOWER(firstname) LIKE \'%${firstname}%\' `
        }
        if(club_id !== undefined && club_id.length !== 0) {
            qu += `AND club_id = ${club_id} `
        }
        if(birthday !== undefined && birthday.length !== 0) {
            qu += `AND birthday = '${birthday}'::date`
        }
        qu += ';'
         

        const response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

router.post('/player/new', async(req, res) => {
    try {
        let {lastname, firstname, club_id, birthday} = req.body
        let qu = `INSERT INTO player(firstname, lastname, club_id, birthday) values (\'${firstname}\', \'${lastname}\', ${club_id}, \'${birthday}\'::date);`
         
        let response = await pool.query(qu)
        qu = `${selectAll} player ORDER BY id DESC FETCH FIRST 1 ROW ONLY;`
        response = await pool.query(qu)
        //response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//changes record with given id 
router.put('/player/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {firstname, lastname, club_id, birthday} = req.body
        let qu = ` `
        if(lastname !== undefined && lastname.length !== 0) {
            qu += `lastname = '${lastname}\', `
        }
        if(firstname !== undefined && firstname.length !== 0) {
            qu += `firstname = '${firstname}\', `
        }
        if(club_id !== undefined && club_id.length !== 0) {
            qu += `club_id = ${club_id}, `
        }
        if(birthday !== undefined && birthday.length !== 0) {
            qu += `birthday = '${birthday}'::date`
        }
        if(qu[qu.length - 1] === ',') qu[qu.length - 1] = ' '
         
         
        let query2 = `UPDATE player SET ${qu} WHERE id = ${id};`
        let response = await pool.query(query2)
        qu = `${selectAll} player WHERE id = ${id};`
        response = await pool.query(qu)
        res.json(response.rows[0])
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message);
    }
})

//delete record by given id
router.delete('/player/:id', async(req, res) => {
    try {
        const {id} = req.params
        const qu = `DELETE FROM player WHERE id = ${id};`
        const response = await pool.query(qu)
        
        res.json('Successfuly deleted')
    } catch (error) {
        res.status(400).json('Error');
        console.log(error.message)
    }
})



module.exports = router