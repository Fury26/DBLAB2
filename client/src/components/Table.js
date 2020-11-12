import React, {Fragment, useState, useEffect} from 'react'
import { EditRow } from './EditRow'

export const serverUrl = 'http://192.168.0.20:5000'

export const types = {
    date: 'date',
    datetime: 'timestamp',
    money: 'money',
    number: 'integer',
    string: 'varchar',
}

const Table = (props) => {

    //array of all records, which need to be shown for viewer
    const [rows, setRows] = useState([])
    //hold data, for filtering information 
    const [searchRow, setSearchRow] = useState(null)
    //contain count of records which should be randomly created
    const [randomRows, setRandomRows] = useState(0)
    //variable, used for updating edit window(presented like modal)
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
            if(response.status === 400) {
                window.alert(jsonData)
                return
            }
            setRows(jsonData)
            
        } catch (error) {
            console.log(error.message);
        }
    }
    
    // loading all rows of the table
    useEffect( () => {

        getRows(props.tableName)

    }, [props.tableName])

    //looking is it need to updat modal window
    useEffect( () => {
        setToChange(true)
    }, [rows])

    //called when typing in search form
    const searchInputHandler = event => {
        // set value of field with name == to it is input name
        setSearchRow({
            ...searchRow,
            [event.target.name]: event.target.value,
        })
    }

    //called when trying to send data on server for filltering records
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
            if(response.status === 400) {
                window.alert(data)
                return
            }
            setRows(data)
            setSearchRow(null)
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
            if(response.status === 400) {
                window.alert(data)
                return
            }
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

    //deleting row from rows array by it index
    const deleteRow = async row_id => {
       
        try {
            const response = await fetch(
                `${serverUrl}/${props.tableName}/${rows[row_id][props.table[0].field]}`, {
                    method: 'DELETE',
                }
            )

            if(response.status === 400) {
                window.alert(await response.json())
                return
            } else {
            setRows(rows.filter((row, index) => index !== row_id))
            }
            //editingField(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    //load all records from current table
    const reload = (tableName) => {
        setSearchRow({})
        getRows(tableName)
    }


    //update how many random records should be created
    const countInputHandler = (e) => {
        setRandomRows(e.target.value)
    }

    //send requset on the server to create randoms records
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


            if(response.status === 400) {
                window.alert(data)
                return;
            }
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
    	    
            {/* block for filltering rows or creating records */}
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
                            {/* block for typing data */}
                            <div className="col-sm-10"><input className="form-control" id={`search-create-${row.field}`} name={row.field} type={type} value={searchRow ? searchRow[row.field] : ''} onChange={ e => searchInputHandler(e)} /></div>
                            </div>
                        )
                    })
                }
                    {/* start searching for rows */}
                    <button className="btn btn-warning mr-3" onClick={toSearch} >Find</button>
                    {/* creates record */}
                    <button className="btn btn-success" onClick={createRow} >Create</button>
                </div>
            </div>
            
            <table className='table mt-5 table-hover table-dark'>
                {/* headers of the table */}
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
                        // converting rows arrat into html
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
                                    <td><EditRow table={props.table} update={getRows} tableName={props.tableName} entity={{...rows[index]}} changeRow={toChange}/></td>
                                    <td><button className="btn btn-danger" onClick={() => deleteRow(index)}>Delete</button></td>
                                </tr>
                                
                            )
                            
                        })
                    }
                </tbody>
            </table>

            {/* block for creating random data if it possible for this table*/}
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