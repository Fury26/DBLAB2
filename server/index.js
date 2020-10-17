const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/', require('./routes/clubRoutes'))
app.use('/', require('./routes/playerRoutes'))
app.use('/', require('./routes/stadiumRouter'))

app.listen(5000, () => {
    console.log('Server has started on port 5000');
})