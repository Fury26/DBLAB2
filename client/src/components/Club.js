/*import React, {Fragment, useEffect, useState} from 'react'
import './styles.css'

export const Club = () => {

    const [clubs, setCLubs] = useState([])
    const [club, setClub] = useState({})
    const [searchClub, setSearchClub] = useState({})

    const getClubs = async () => {
        try {
            const response = await fetch(
                'http://192.168.0.20:5000/clubs', {
                    method: 'GET',
                }
            )
            const jsonData = await response.json()

            setCLubs(jsonData)
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect( () => {
        getClubs()
    }, [])

    const editingField = visibility => {
        const elem = document.getElementById('form-editing')
        if( visibility) elem.classList = ['form-editing-visible']
            else elem.classList = ['form-editing-hidden']
    }

    const inputChangeHandler = event => {
        setClub({...club, name: event.target.value})
    }

    const onClubSelected = id => {
        setClub(clubs[id])
        editingField(true)
    }

    const searchInputHandler = event => {
        setSearchClub({
            ...searchClub,
            [event.target.name]: event.target.value,
        })
    }

    const toSearch = async () => {
        try {
            const body = searchClub
            console.log(body)
            const response = await fetch(
                'http://192.168.0.20:5000/clubs/search', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                })

            const data = await response.json()
            console.log(data)
            setCLubs(data)
        } catch (error) {
            console.log(error.message);
        }
    }


    const editClub = async () => {
        try {
            const body = club
            const response = await fetch(
                `http://192.168.0.20:5000/clubs/${club.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )

            const data = await response.json()
            console.log('Successfuly edited row ', data);
            
            const _ = clubs.map( (_club, id) => {
                if(_club.id === data.id) return data
                    else return _club
                    
            })
            setCLubs(_)
            setClub({})
            editingField(false)
        } catch (error) {
            console.log(error.message)
        }
        
    }

    const deleteClub = async club_id => {
       
        try {
            console.log('Trying to delete club', club_id)
            const response = await fetch(
                `http://192.168.0.20:5000/clubs/${club_id}`, {
                    method: 'DELETE',
                }
            )

            setCLubs(clubs.filter(club => club.id !== club_id))
            editingField(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    const createCLub = async(req, res) => {
        try {
            const body = {
                name: document.getElementById('name-input').value,
            }
            console.log('Trying to create club', body)
            const response = await fetch(
                `http://192.168.0.20:5000/clubs/new`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )


            const data = await response.json()
            console.log('Successfuly created club ');
            data.forEach(element => {
                if(Object.keys(element).includes('id')) clubs.push(element)
            });
            
            document.getElementById('name-input').value = ''
            setSearchClub({})
            setCLubs(clubs)
            
        } catch (error) {
            console.log(error.message)
        }
    }


    return (
        <Fragment>
            <div id="form-editing" className="form-editing-hidden">
                <label htmlFor="id">Id</label>
                <span name="id">{club.id}</span>
                <label htmlFor="club-name">Club name</label>
                <input className="disabled" name="club-name" onChange={e => inputChangeHandler(e)} value={club.name} ></input>
                <button onClick={editClub}>Edit row</button>
            </div>
            <h4>Searching filed</h4>

            <div className="search-create-form">
                <label htmlFor="name-input">Club name</label>
                <input type="text" id="name-input" onChange={e => searchInputHandler(e)} name="name"></input>
                <button className="btn btn-warning" onClick={toSearch} >Find</button>
                <button className="btn btn-success" onClick={createCLub} >Create</button>
            </div>

            <table className="table mt-5">
                <thead>
                    <tr>
                        <th className="tableheader">Id</th>
                        <th>Name</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody >
                    {clubs.map( (club, index) => {
                        return (
                        <tr className="club" key={club.id} onClick={() => onClubSelected(index)}>
                            <td style={{textAlign: 'left'}}>{club.id}</td>
                            <td style={{textAlign: 'left'}}>{club.name}</td>
                            <td><button onClick={() => deleteClub(club.id)} className="btn btn-danger">Delete</button></td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </Fragment>
    )
}*/



import React, {Fragment, useState, useEffect} from 'react'
//import { club_stadium } from '../../../server/routes/table_names'

export const types = {
    date: 'date',
    datetime: 'timestamp',
    money: 'money',
    number: 'integer',
    string: 'varchar',
}

/*const table = [
    {field: '', type: ''},
]*/

//class Table extends React.Component {
const Table = (props) => {

    const tableName = props.name
    //const table = props.table
    //let table
    const [rows, setRows] = useState([])
    const [entity, setEntity] = useState({})
    const [searchRow, setSearchRow] = useState({})

    

    //makes GET requset to server and getting all rows of a table
    const getRows = async (tableName) => {
        try {
            const response = await fetch(
                `http://192.168.0.20:5000/${tableName}`, {
                    method: 'GET',
                }
            )
            const jsonData = await response.json()
            console.log(`${tableName}`, jsonData);
            setRows(jsonData)
            
        } catch (error) {
            console.log(error.message);
        }
    }
    
    // loading all rows of the table
    useEffect( () => {

        getRows(props.tableName)

        console.log('Getting all rows')
    }, [])
    /*componentDidMount( () => {
        getRows(props.tableName)
        console.log(rows)
    }) */

    //setting row whick would be edited
    const editInputChangeHandler = event => {
        setEntity({...entity, [event.target.name]: event.target.value})
    }

    //change visibility of editing field when user needs it
    const editingField = visibility => {
        const elem = document.getElementById('form-editing')
        if(visibility) elem.classList = ['form-editing-visible']
        //if(visibility) elem.remove('form-editing-hidden')
            else elem.classList.push('form-editing-hidden')
        if(!visibility) setEntity({})
    }

    /*const inputChangeHandler = event => {
        setClub({...club, name: event.target.value})
    }*/

    const onRowSelected = id => {
        setEntity(rows[id])
        editingField(true)
    }

    const searchInputHandler = event => {
        // set value of field with name == to it is input name
        setSearchRow({
            ...searchRow,
            [event.target.name]: event.target.value,
        })
        console.log(searchRow)
    }

    const toSearch = async () => {
        try {
            const body = searchRow
            console.log('tosearch body ',  body)
            const response = await fetch(
                `http://192.168.0.20:5000/${props.tableName}/search`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                })

            const data = await response.json()
            
            setRows(data)
            setSearchRow({})
            //window.location = `/${tableName}`
        } catch (error) {
            console.log(error.message);
        }
    }

    //Sends POST request on server to create new row in the table
    const createRow = async () => {
        try {
            const body = {}
            props.table.forEach( (row, index) => {
                body[row.field] = document.getElementById(`search-create-${row.field}`).value
            })

            
            console.log(`Trying to create row in table ${props.tableName}`, body)
            const response = await fetch(
                `http://192.168.0.20:5000/${props.tableName}/new`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )


            const data = await response.json()
            data.forEach(element => {
                if(Object.keys(element).includes( props.table[0].field )) rows.push(element)
            })
            
            props.table.forEach( (row) => {
                document.getElementById(`search-create-${row.field}`).value = ''
            })
            setSearchRow ({})
            setRows(rows)
            
        } catch (error) {
            console.log(error.message)
        }
    }

    const editRowHandler = async () => {
        try {
            const body = entity
            const response = await fetch(
                `http://192.168.0.20:5000/${props.tableName}/${entity[props.table[0].field]}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )

            const data = await response.json()
            console.log('Successfuly edited row ', data);
            
            const _ = rows.map( (_row, id) => {
                if(_row[props.table[0].field] === data[props.table[0].field]) return data
                    else return _row
                    
            })
            setRows(_)
            setEntity({})
            editingField(false)
        } catch (error) {
            console.log(error.message)
        }
        
    }

    //deleting row from rows array by it index
    const deleteRow = async row_id => {
       
        try {
            console.log('Trying to delete row', row_id)
            console.log(rows[row_id]);
            const response = await fetch(
                `http://192.168.0.20:5000/${props.tableName}/${rows[row_id][props.table[0].field]}`, {
                    method: 'DELETE',
                }
            )

            setRows(rows.filter((row, index) => index !== row_id))
            editingField(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        
        <div className="container">
        
            <div id="form-editing" className="form-editing-hidden">
                <div  className="p-3 border border-primary rounded mb-3">
                {
                    
                    props.table.map( (row, index) => {
                        let type
                        switch (row.type) {
                            case types.date:
                                type='date'
                                break
                            case types.datetime:
                                type='datetime-local'
                                break
                            case types.money:
                                type='number'
                                break
                            case types.string:
                                type='text'
                                break
                            case types.number:
                                type='number'
                                break
                            default:
                                type='text'
                                break;
                        }
                        return (
                            
                            <div className="form-group row" key={index}>
                                <label className="col-sm-2 col-form-label" name={row.field} htmlFor={`edit-${row.field}`}>{row.field}</label>                 
                                <div className="col-sm-10"><input className="form-control" id={`edit-${row.field}`} name={row.field} type={type} onChange={e => editInputChangeHandler(e)} value={entity[row.field]} /></div>
                            </div>
                            
                        )
                        
                    })
                    
                }
                <button className="btn btn-warning" onClick={editRowHandler}>Edit Row</button>
                <button className="btn btn-danger " onClick={() => editingField(false)}  >&#10006;</button>
            
                </div>
                {/* ending of editing form */}
                </div>
            
            <div className="search-create-form">
                <div className="p-3 rounded border border-primary">
                {
                    props.table.map( (row, index) => {
                        let type
                        switch (row.type) {
                            case types.date:
                                type='date'
                                break
                            case types.datetime:
                                type='datetime-local'
                                break
                            case types.money:
                                type='number'
                                break
                            case types.string:
                                type='text'
                                break
                            case types.number:
                                type='number'
                                break
                            default:
                                type='text'
                                break;
                        }
                        return (
                            <div className="form-group row" key={index}>
                            <label className="col-sm-2 col-form-label" name={row.field} htmlFor={`search-create-${row.field}`}>{row.field}</label>                        
                            <div className="col-sm-10"><input className="form-control" id={`search-create-${row.field}`} name={row.field} type={type} onChange={ e => searchInputHandler(e)} /></div>
                            </div>
                        )
                    })
                }
                    <button className="btn btn-warning" onClick={toSearch} >Find</button>
                    <button className="btn btn-success" onClick={createRow} >Create</button>
                </div>
            </div>
            
            <table className='table mt-5 table-hover table-dark'>
                <thead>
                    <tr>
                        {
                            props.table.map( (row, index) => {
                                return (
                                    <Fragment key={index}>
                                        <th >{row.field}</th>
                                    </Fragment>    
                                )
                            })
                            
                        }   
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rows.map( (row, index) => {
                            return (
                                <tr key={index}>
                                {
                                    props.table.map( (entityRow, ind) => {    
                                        return (
                                        <td key={ind} onClick={ () => onRowSelected(index)}  >{row[entityRow.field]}</td>
                                        )
                                    })
                                    
                                }
                                    <td><button className="btn btn-danger" onClick={() => deleteRow(index)}>Delete</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {/*
            <table className="table mt-5">
                <thead>
                    <tr>
                        <th className="tableheader">Id</th>
                        <th>Name</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody >
                    {clubs.map( (club, index) => {
                        return (
                        <tr className="club" key={club.id} onClick={() => onClubSelected(index)}>
                            <td style={{textAlign: 'left'}}>{club.id}</td>
                            <td style={{textAlign: 'left'}}>{club.name}</td>
                            <td><button onClick={() => deleteClub(club.id)} className="btn btn-danger">Delete</button></td>
                        </tr>
                    )})}
                </tbody>
            </table> */}
        </div>
    )
}

export default Table