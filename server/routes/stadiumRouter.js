const {Router} =  require('express')
const { query } = require('../db')
const pool = require('../db')
const { club, stadium } = require('./table_names')
const tables = require('./table_names')
const router = Router()

//const selectAll = 'SELECT * FROM'

router.get('/stadium', async(req, res) => {
    try {
        const stadiums = await pool.query(`SELECT * FROM stadium;`)

        res.json(stadiums.rows)
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/stadium/search', async(req, res) => {
    try {
        let {title, city, capacity} = req.body
        let qu = `SELECT * FROM stadium WHERE TRUE `
        console.log(typeof capacity)
        //console.log(title);
        if(title !== undefined && title.length !== 0) {
            qu += `AND LOWER(title) LIKE \'%${title}%\' `
        }
        if(city !== undefined && city.length !== 0) {
            qu += `AND LOWER(city) LIKE \'%${city}%\' `
            //qu += `AND LOCATE(\'${city}\', LOWER(city)) > 0`
        }
        if(capacity !== undefined && capacity.length !== 0) {
            qu += `AND capacity = ${capacity} `
        }
        qu += ';'
        console.log(qu)

        console.log(`title: ${title}, city: ${city}, capacity: ${capacity}, birthday: ${birthday}`);
        //const qu = `SELECT * FROM club WHERE LOWER(name) LIKE \'%${name}%\'`
        //console.log(qu)
        const response = await pool.query(qu)
        res.json(response.rows)
        //res.json('Server has got a data')
    } catch (error) {
        console.log(error.message);
    }
})

router.post('/stadium/new', async(req, res) => {
    try {
        let {title, city, capacity} = req.body
        let qu = `INSERT INTO stadium(city, title, capacity) values (\'${city}\', \'${title}\', ${capacity});`
        console.log(qu)
        let response = await pool.query(qu)
        qu = `SELECT * FROM stadium ORDER BY id DESC FETCH FIRST 1 ROW ONLY;`
        response = await pool.query(qu)
        //response = await pool.query(qu)
        res.json(response.rows)
    } catch (error) {
        console.log(error.message);
    }
})

router.put('/stadium/:id', async(req, res) => {
    try {
        console.log('PUT stadium on server')
        const {id} = req.params
        const {city, title, capacity} = req.body
        let qu = ` `
        if(title !== undefined && title.length !== 0) {
            qu += `title = '${title}\', `
        }
        if(city !== undefined && city.length !== 0) {
            qu += `city = '${city}\', `
        }
        if(capacity !== undefined && capacity.length !== 0) {
            qu += `capacity = ${capacity} `
        }
        
        if(qu[qu.length - 1] === ',') qu[qu.length - 1] = ' '
         
        console.log(qu)
        let query2 = `UPDATE stadium SET ${qu} WHERE id = ${id};`
        let response = await pool.query(query2)
        qu = `SELECT * FROM stadium WHERE id = ${id};`
        response = await pool.query(qu)
        res.json(response.rows[0])
    } catch (error) {
        console.log(error.message);
    }
})


router.delete('/stadium/:id', async(req, res) => {
    try {
        const {id} = req.params
        console.log(id);
        const qu = `DELETE FROM club_stadium WHERE stadium_id = ${id};
        DELETE FROM stadium WHERE id = ${id};`
        const response = await pool.query(qu)
        
        res.json('Successfuly deleted')
    } catch (error) {
        console.log(error.message)
    }
})



module.exports = router