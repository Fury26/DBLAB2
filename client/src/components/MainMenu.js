import React, {Fragment} from 'react'
import './styles.css'
import {NavLink} from 'react-router-dom'
import { Card } from './Card'

export const MainMenu = () => {
    return (
        <Fragment>
            <div className="d-flex flex-wrap">
                {/* <NavLink className="nav-link" to="/club" exact>
                    <div className="card"><span className="card-title">Clubs</span></div>
                </NavLink> */}
                <Card link="/club" tableName="club" img="Barca" />
                <Card link="/player" tableName="player" img="Messi2" />
                <Card link="/stadium" tableName="stadium" img="Stadium" />
                <Card link="/tournament" tableName="tournament" img="UCL" />
                <Card link="/match" tableName="match" img="match" />
                <Card link="/club_stadium" tableName="club_stadium" img="Stadium" />
                <Card link="/clubs_tournaments" tableName="clubs_tournaments" img="UCL" />

                {/* <NavLink className="nav-link" to="/player" exact>
                    <div className="card"><span className="card-title" >Players</span></div>
                </NavLink>
                <NavLink className="nav-link" to="/stadium" exact>
                    <div className="card"><span className="card-title" >Stadium</span></div>
                </NavLink>
                <NavLink className="nav-link" to="/match" exact>
                    <div className="card"><span className="card-title" >Match</span></div>
                </NavLink>
                <NavLink className="nav-link" to="/tournament" exact>
                    <div className="card"><span className="card-title" >Tournament</span></div>
                </NavLink>
                
                <NavLink className="nav-link" to="/clubs_tournaments" exact>
                    <div className="card"><span className="card-title" >Clubs and their Tournaments</span></div>
                </NavLink>
                <NavLink className="nav-link" to="/club_stadium" exact>
                    <div className="card"><span className="card-title" >Clabs and their stadiums</span></div>
                </NavLink> */}
            </div>
        </Fragment>
    )
}

