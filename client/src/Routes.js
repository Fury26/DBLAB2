import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
//import { Club } from './components/Club'
import Table from './components/Club'
import { MainMenu } from './components/MainMenu'
import {types} from './components/Club'
import Navbar from './components/navbar'

export const Routes = () => {

    const clubTable = [
        {field: 'id', type: types.number},
        {field: 'name', type: types.string},
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
    


    return(
        <Switch>
            <Route path="/" exact>
                <MainMenu />
            </Route>
            <Route path="/club" exact>
                <Table table={clubTable} tableName="club"/>
            </Route>
            <Route path="/player" exact>
                <Table table={playerTable} tableName="player"/>
            </Route>
            <Route path="/stadium" exact>
                <Table table={stadiumTable} tableName="stadium" />
            </Route>
            <Redirect to="/" />
        </Switch>
    )}
