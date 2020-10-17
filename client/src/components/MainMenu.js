import React, {Fragment} from 'react'
import './styles.css'
import {NavLink} from 'react-router-dom'

export const MainMenu = () => {
    return (
        <Fragment>
            <div className="container">
                <NavLink className="nav-link" to="/club" exact>
                    <div className="card"><span className="card-title">Clubs</span></div>
                </NavLink>
                <NavLink className="nav-link" to="/player" exact>
                    <div className="card"><span className="card-title" >Players</span></div>
                </NavLink>
                <NavLink className="nav-link" to="/stadium" exact>
                    <div className="card"><span className="card-title" >Stadium</span></div>
                </NavLink>
            </div>
        </Fragment>
    )
}

