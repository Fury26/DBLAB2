const {Router} =  require('express')
const pool = require('../db')
const tables = require('./table_names')
const router = Router()

const selectAll = 'SELECT id, firstname, lastname, club_id, FORMAT(birthday::varchar, \'d\', \'en-US\') as birthday FROM'

router.get('/player', async(req, res) => {
    try {
        console.log('On server player');
        const players = await pool.query(`${selectAll} player;`)
        console.log(players.rows)
        res.json(players.rows)
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/player/search', async(req, res) => {
    try {
        let {lastname, firstname, club_id, birthday} = req.body
        let qu = `${selectAll} player WHERE TRUE `
        console.log(typeof club_id)
        //console.log(lastname);
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
        console.log(qu)

        console.log(`lastname: ${lastname}, firstname: ${firstname}, club_id: ${club_id}, birthday: ${birthday}`);
        //const qu = `SELECT * FROM club WHERE LOWER(name) LIKE \'%${name}%\'`
        //console.log(qu)
        const response = await pool.query(qu)
        res.json(response.rows)
        //res.json('Server has got a data')
    } catch (error) {
        console.log(error.message);
    }
})

router.post('/player/new', async(req, res) => {
    try {
        let {lastname, firstname, club_id, birthday} = req.body
        let qu = `INSERT INTO player(firstname, lastname, club_id, birthday) values (\'${firstname}\', \'${lastname}\', ${club_id}, \'${birthday}\'::date);`
        console.log(qu)
        let response = await pool.query(qu)
        qu = `${selectAll} ${tables.player} ORDER BY id DESC FETCH FIRST 1 ROW ONLY;`
        response = await pool.query(qu)
        //response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        console.log(error.message);
    }
})

router.put('/player/:id', async(req, res) => {
    try {
        console.log('PUT player on server')
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
         
        console.log(qu)
        let query2 = `UPDATE player SET ${qu} WHERE id = ${id};`
        let response = await pool.query(query2)
        qu = `${selectAll} player WHERE id = ${id};`
        response = await pool.query(qu)
        res.json(response.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})


router.delete('/player/:id', async(req, res) => {
    try {
        const {id} = req.params
        console.log(id);
        const qu = `DELETE FROM player WHERE id = ${id};`
        const response = await pool.query(qu)
        
        res.json('Successfuly deleted')
    } catch (error) {
        console.log(error.message)
    }
})



module.exports = router