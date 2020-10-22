import React, {Fragment} from 'react'
import { NavLink } from 'react-router-dom'

export const Card = (props) => {

    return (
        <Fragment>
            <div  className="card div-card border rounded border-primary" style={{width: '18rem'}}>
                <img className="card-img-top" src={process.env.PUBLIC_URL + `/images/${props.img}.jpg`} alt={props.img} />
                <div className="card-body">
                    <h5 className="card-title text-uppercase">{props.tableName}</h5>
                    <p className="card-text" style={{color: 'black'}} >Redirect on to the page where you can watch and edit table "{props.tableName}"</p>
                    {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                    <NavLink className="nav-link btn btn-primary" to={props.link}>
                        GO TO THE TABLE
                    </NavLink>
                </div>
            </div>
            
        </Fragment>
    )
}