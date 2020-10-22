import React, {Fragment, useState, useEffect} from 'react'
import { EditRow } from './EditRow'
//import { club_stadium } from '../../../server/routes/table_names'

export const serverUrl = 'http://192.168.0.20:5000'

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
    const [searchRow, setSearchRow] = useState(null)
    const [randomRows, setRandomRows] = useState(1)
    const [toChange, setToChange] = useState(false)

    

    //makes GET requset to server and getting all rows of a table
    const getRows = async (tableName) => {
        try {
            const response = await fetch(
                `${serverUrl}/${tableName}`, {
                    method: 'GET',
                }
            )
            const jsonData = await response.json()
            setRows(jsonData)
            
        } catch (error) {
            console.log(error.message);
        }
    }
    
    // loading all rows of the table
    useEffect( () => {

        getRows(props.tableName)

    }, [])

    useEffect( () => {
        setToChange(true)
    }, [rows])


    //setting row whick would be edited
    const editInputChangeHandler = event => {
        setEntity({...entity, [event.target.name]: event.target.value})
    }

    //change visibility of editing field when user needs it
    const editingField = visibility => {
        const elem = document.getElementById('form-editing')
        if(visibility) elem.classList = ['form-editing-visible']
        //if(visibility) elem.remove('form-editing-hidden')
            else {
                elem.classList = ['form-editing-hidden']
            }
        if(!visibility) setEntity({})
    }

    /*const inputChangeHandler = event => {
        setClub({...club, name: event.target.value})
    }*/

    const onRowSelected = id => {
        setEntity(rows[id])
        //editingField(true)
    }

    const searchInputHandler = event => {
        // set value of field with name == to it is input name
        setSearchRow({
            ...searchRow,
            [event.target.name]: event.target.value,
        })
    }

    const toSearch = async () => {
        try {
            const body = searchRow
            const response = await fetch(
                `${serverUrl}/${props.tableName}/search`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                })

            const data = await response.json()
            
            setRows(data)
            setSearchRow(null)
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

            
            const response = await fetch(
                `${serverUrl}/${props.tableName}/new`, {
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
            setSearchRow (null)
            setRows(rows)
            
        } catch (error) {
            console.log(error.message)
        }
    }

    const editRowHandler = async () => {
        try {
            const body = entity
            const response = await fetch(
                `${serverUrl}/${props.tableName}/${entity[props.table[0].field]}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )

            const data = await response.json()
            
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
            const response = await fetch(
                `${serverUrl}/${props.tableName}/${rows[row_id][props.table[0].field]}`, {
                    method: 'DELETE',
                }
            )

            setRows(rows.filter((row, index) => index !== row_id))
            editingField(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    const reload = (tableName) => {
        setSearchRow({})
        getRows(tableName)
    }


    const countInputHandler = (e) => {
        setRandomRows(e.target.value)
    }

    const createRandomRows = async () => {
        try {
            const body = {count: randomRows}
            
            const response = await fetch(
                `${serverUrl}/${props.tableName}/rand`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )

            const data = await response.json()
            let _ = [...rows]
            data.forEach(element => {
                if(Object.keys(element).includes( props.table[0].field )) _.push(element)
            })
            setRows(_)            
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        
        
        <div className="container">
            <div >
                <span onClick={() => reload(props.tableName)} className="position-absolute btn btn-primary " style={{right: '20px', width: '100px', height: '100px'}} >&#8635;</span>
            </div>


            
            
            {/* <div id="form-editing" className="form-editing-hidden">
                <h1 className="text-center">Editing form</h1>
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
                
            </div> */}
    	    
            <div className="search-create-form">
                <h1 className="text-center">Searching/Creating form</h1>
                {/* div play role of form */}
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
                            <div className="col-sm-10"><input className="form-control" id={`search-create-${row.field}`} name={row.field} type={type} value={searchRow ? searchRow[row.field] : ''} onChange={ e => searchInputHandler(e)} /></div>
                            </div>
                        )
                    })
                }
                    <button className="btn btn-warning mr-3" onClick={toSearch} >Find</button>
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
                        <th>Edit</th>
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
                                        <td key={ind} >{row[entityRow.field]}</td>
                                        )
                                    })
                                    
                                }
                                    <td><EditRow table={props.table} update={getRows} tableName={props.tableName} entity={row} changeRow={toChange}/></td>
                                    <td><button className="btn btn-danger" onClick={() => deleteRow(index)}>Delete</button></td>
                                </tr>
                                
                            )
                            
                        })
                    }
                </tbody>
            </table>

            {/* block for creating random data */}
            { 
                props.randomize ? 
                    (<div className="form-inline">
                        <div className="form-group mt-2" >
                            <input className="form-control mr-2" type="number" value={randomRows} onChange={e => countInputHandler(e)} />
                            <button onClick={createRandomRows} className="btn btn-success">Create random rows</button>
                        </div>
                    </div>)
                : null
            }
        </div>
    )
}

export default Table