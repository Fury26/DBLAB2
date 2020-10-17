import React, {Fragment} from 'react'
import {NavLink} from 'react-router-dom'


export const Navbar = () => {
    return (
        <div className="border-right ">
            <ul className="display-4 nav-pills nav flex-column">
                <li className="m-3 nav-item">
                <NavLink className="nav-link" to="/club" exact>
                    Club
                </NavLink>
                </li>
                <li className="m-3 nav-item">
                <NavLink className="nav-link" to="/player" exact>
                    Player
                </NavLink>
                </li>
                <li className="m-3 nav-item">
                <NavLink className="nav-link" to="/stadium" exact>
                    Stadium
                </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default Navbar