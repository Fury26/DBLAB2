const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/', require('./routes/clubRoutes'))
app.use('/', require('./routes/playerRoutes'))
app.use('/', require('./routes/stadiumRouter'))
app.use('/', require('./routes/matchRoutes'))
app.use('/', require('./routes/tournamentRoutes'))
app.use('/', require('./routes/clubs_tournaments'))
app.use('/', require('./routes/club_stadium'))

app.listen(5000, () => {
    console.log('Server has started on port 5000');
})