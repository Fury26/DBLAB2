import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Table from './components/Table'
import { MainMenu } from './components/MainMenu'
import {types} from './components/Table'

export const Routes = () => {

    //creating structure of my tables
    //it is are arrays of objects, those pbjects represents columns
    //first value in object is name of the column, second - it is type
    const clubTable = [
        {field: 'id', type: types.number},
        {field: 'name', type: types.string},
    ]

    const clubsTournamentsTable = [
        {field: 'id', type: types.number},
        {field: 'club_id', type: types.number},
        {field: 'tournament_id', type: types.number},
    ]

    const clubStadiumTable = [
        {field: 'club_id', type: types.number},
        {field: 'stadium_id', type: types.number},
    ]

    const tournamentTable = [
        {field: 'id', type: types.number},
        {field: 'title', type: types.string},
        {field: 'teams_count', type: types.number},
    ]

    const playerTable = [
        {field: 'id', type:types.number},
        {field: 'firstname', type:types.string},
        {field: 'lastname', type:types.string},
        {field: 'club_id', type: types.number},
        {field: 'birthday', type:types.date},
    ]

    const stadiumTable = [
        {field: 'id', type:types.number},
        {field: 'title', type:types.string},
        {field: 'capacity', type:types.number},
        {field: 'city', type:types.string},
    ]

    const matchTable = [
        {field: 'id', type:types.number},
        {field: 'tournament_id', type:types.number},
        {field: 'home_club_id', type:types.number},
        {field: 'away_club_id', type:types.number},
        {field: 'result', type:types.string},
        {field: 'ticket_cost', type:types.money},
        {field: 'datetime', type:types.datetime},
    ]
    


    return(
        //creating routes, it is set up component(s) for each possible api of the application 
        <Switch>
            <Route path="/" exact>
                <MainMenu />
            </Route>

            <Route path="/club" exact>
                <Table table={clubTable} tableName="club" randomize={true}/>
            </Route>

            <Route path="/player" exact>
                <Table table={playerTable} tableName="player" randomize={false}/>
            </Route>

            <Route path="/stadium" exact>
                <Table table={stadiumTable} tableName="stadium" randomize={true}/>
            </Route>

            <Route path="/match" exact>
                <Table table={matchTable} tableName="match" randomize={false}/>
            </Route>

            <Route path="/tournament" exact>
                <Table table={tournamentTable} tableName="tournament" randomize={true}/>
            </Route>

            <Route path="/clubs_tournaments" exact>
                <Table table={clubsTournamentsTable} tableName="clubs_tournaments" randomize={false}/>
            </Route>

            <Route path="/club_stadium" exact>
                <Table table={clubStadiumTable} tableName="club_stadium" randomize={false}/>
            </Route>

            <Redirect to="/" />
        </Switch>
    )}
