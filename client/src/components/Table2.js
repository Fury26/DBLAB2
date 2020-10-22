import React, {Fragment, useState, useEffect} from 'react'

export const types = {
    date: 'date',
    datetime: 'timestamp',
    money: 'money',
    number: 'integer',
    string: 'varchar',
}



class Table2 extends React.Component {


    

    

    state = {
        rows: [],
        entity: {},
        searchRow: {},
    }

    /*componentDidMount() {
        this.getRows(this.props.tableName)
        console.log('mounted\nProps: ', this.props);

    }*/

    

    async getRows(tableName) {
        try {
            const response = await fetch(
                `http://192.168.0.20:5000/${tableName}`, {
                    method: 'GET',
                }
            )
            const jsonData = await response.json()
            console.log(`${tableName}`, jsonData);
            this.setRows(jsonData)
            this.state.rows.forEach( (row, index) => {
                
            })
        } catch (error) {
            console.log(error.message);
        }
    }
    

    setEntity(elem, event = null) {
        if(event === null) 
            this.setState({
                ...this.state,
                entity: elem
            })
        else {
            event.preventDefault()
            this.setState({
                ...this.state,
                entity: {...this.state.this.state.entity, 
                    [event.target.name]: event.target.value
                }
            })
        }
    }

    setSearchRow(elem, event = null) {
        if(event === null) 
            this.setState({
                ...this.state,
                searchRow: elem
            })
        else {
            event.preventDefault()
            this.setState({
                ...this.state,
                searchRow: {...this.state.this.state.searchRow, 
                    [event.target.name]: event.target.value
                }
            })
        }
    }

    setRows(elem, event = null) {
        if(event === null) 
            this.setState({
                ...this.state,
                rows: elem
            })
        else {
            event.preventDefault()
            this.setState({
                ...this.state,
                rows: {...this.state.this.state.rows, 
                    [event.target.name]: event.target.value
                }
            })
        }
    }

    //setting row whick would be edited
    editInputChangeHandler(event){
        event.preventDefault()
        this.setEntity({...this.state.entity, [event.target.name]: event.target.value})
    }

    //change visibility of editing field when user needs it
    editingField(visibility) {
        const elem = document.getElementById('form-editing')
        if(visibility) elem.classList = ['form-editing-visible']
        //if(visibility) elem.remove('form-editing-hidden')
            else elem.classList.push('form-editing-hidden')
        if(!visibility) this.setEntity({})
    }

    /*const inputChangeHandler = event => {
        setClub({...club, name: event.target.value})
    }*/

    onRowSelected(id) {
        this.setEntity(this.state.rows[id])
        this.editingField(true)
    }

    searchInputHandler(event) {
        event.preventDefault()
        // set value of field with name == to it is input name
        this.setSearchRow({
            ...this.state.searchRow,
            [event.target.name]: event.target.value,
        })
        console.log(this.state.searchRow)
    }

    async toSearch() {
        try {
            const body = this.state.searchRow
            console.log('tosearch body ',  body)
            const response = await fetch(
                `http://192.168.0.20:5000/${this.props.tableName}/search`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                })

            const data = await response.json()
            console.log(data)
            this.setRows(data)
            this.setSearchRow({})
        } catch (error) {
            console.log(error.message);
        }
    }

    //Sends POST request on server to create new row in the table
    async createRow() {
        try {
            const body = {}
            this.props.table.forEach( (row, index) => {
                body[row.field] = document.getElementById(`search-create-${row.field}`).value
            })

            
            console.log(`Trying to create row in table ${this.props.tableName}`, body)
            const response = await fetch(
                `http://192.168.0.20:5000/${this.props.tableName}/new`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )


            const data = await response.json()
            data.forEach(element => {
                if(Object.keys(element).includes( this.props.table[0].field )) this.state.rows.push(element)
            })
            
            this.props.table.forEach( (row) => {
                document.getElementById(`search-create-${row.field}`).value = ''
            })
            this.setSearchRow ({})
            this.setRows(this.state.rows)
            
        } catch (error) {
            console.log(error.message)
        }
    }

    async editRowHandler() {
        try {
            const body = this.state.entity
            const response = await fetch(
                `http://192.168.0.20:5000/${this.props.tableName}/${this.state.entity[this.props.table[0].field]}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )

            const data = await response.json()
            console.log('Successfuly edited row ', data);
            
            const _ = this.state.rows.map( (_row, id) => {
                if(_row[this.props.table[0].field] === data[this.props.table[0].field]) return data
                    else return _row
                    
            })
            this.setRows(_)
            this.setEntity({})
            this.editingField(false)
        } catch (error) {
            console.log(error.message)
        }
        
    }

    //deleting row from this.state.rows array by it index
    async deleteRow(row_id) {
       
        try {
            console.log('Trying to delete row', row_id)
            console.log(this.state.rows[row_id]);
            const response = await fetch(
                `http://192.168.0.20:5000/${this.props.tableName}/${this.state.rows[row_id][this.props.table[0].field]}`, {
                    method: 'DELETE',
                }
            )

            this.setRows(this.state.rows.filter((row, index) => index !== row_id))
            this.editingField(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    render() {
        //makes GET requset to server and getting all this.state.rows of a table
    

    return (
        
        <div className="container">
        
            <div id="form-editing" className="form-editing-hidden">
                <form className="p-3 border border-primary rounded mb-3">
                {
                    
                    this.props.table.map( (row, index) => {
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
                                <div className="col-sm-10"><input className="form-control" id={`edit-${row.field}`} name={row.field} type={type} onChange={e => this.editInputChangeHandler(e)} value={this.state.entity[row.field]} /></div>
                            </div>
                            
                        )
                        
                    })
                    
                }
                <button className="btn btn-warning" onClick={this.editRowHandler}>Edit Row</button>
                <button className="btn btn-danger " onClick={() => this.editingField(false)}  >&#10006;</button>
            
                </form>
                {/* ending of editing form */}
                </div>
            
            <div className="search-create-form">
                <form className="p-3 rounded border border-primary">
                {
                    this.props.table.map( (row, index) => {
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
                            <div className="col-sm-10"><input className="form-control" id={`search-create-${row.field}`} name={row.field} type={type} onChange={ e => this.searchInputHandler(e)} /></div>
                            </div>
                        )
                    })
                }
                    <button className="btn btn-warning" onClick={this.toSearch} >Find</button>
                    <button className="btn btn-success" onClick={this.createRow} >Create</button>
                </form>
            </div>
            
            <table className='table mt-5 table-hover table-dark'>
                <thead>
                    <tr>
                        {
                            this.props.table.map( (row, index) => {
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
                        this.state.rows.map( (row, index) => {
                            return (
                                <tr key={index}>
                                {
                                    this.props.table.map( (entityRow, ind) => {    
                                        return (
                                        <td key={ind} onClick={ () => this.onRowSelected(index)}  >{row[entityRow.field]}</td>
                                        )
                                    })
                                    
                                }
                                    <td><button className="btn btn-danger" onClick={() => this.deleteRow(index)}>Delete</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            
        </div>
    )
    }
        
}

export default Table2
// import React, {Fragment, useState, useEffect} from 'react'
// export const types = {
//     date: 'date',
//     datetime: 'timestamp',
//     money: 'money',
//     number: 'integer',
//     string: 'varchar',
// }



// //const Table2 = (this.props) => {
// class Table2 extends React.Component {
    
//     render () {
//         const [this.state.rows, setRows] = useState([])
//     const [this.state.entity, setEntity] = useState({})
//     const [this.state.searchRow, setSearchRow] = useState({})
//     //const tableName = this.props.name
//     //const table = this.props.table
//     //let table
    

//     // componentDidMount() {
//     //     console.log('in componentMount');
//     // }

//     //makes GET requset to server and getting all this.state.rows of a table
//     const getRows = async (tableName) => {
//         try {
//             const response = await fetch(
//                 `http://192.168.0.20:5000/${tableName}`, {
//                     method: 'GET',
//                 }
//             )
//             const jsonData = await response.json()
//             console.log(`${tableName}`, jsonData);
//             setRows(jsonData)
//             this.state.rows.forEach( (row, index) => {
                
//             })
//         } catch (error) {
//             console.log(error.message);
//         }
//     }
    
//     // loading all this.state.rows of the table
//     useEffect( () => {

//         getRows(this.props.tableName)

//         console.log(this.state.rows)
//     }, [])
//     /*componentDidMount( () => {
//         getRows(this.props.tableName)
//         console.log(this.state.rows)
//     }) */

//     //setting row whick would be edited
//     const editInputChangeHandler = event => {
//         setEntity({...this.state.entity, [event.target.name]: event.target.value})
//     }

//     //change visibility of editing field when user needs it
//     const editingField = visibility => {
//         const elem = document.getElementById('form-editing')
//         if(visibility) elem.classList = ['form-editing-visible']
//         //if(visibility) elem.remove('form-editing-hidden')
//             else elem.classList.push('form-editing-hidden')
//         if(!visibility) setEntity({})
//     }

//     /*const inputChangeHandler = event => {
//         setClub({...club, name: event.target.value})
//     }*/

//     const onRowSelected = id => {
//         setEntity(this.state.rows[id])
//         editingField(true)
//     }

//     const searchInputHandler = event => {
//         // set value of field with name == to it is input name
//         setSearchRow({
//             ...this.state.searchRow,
//             [event.target.name]: event.target.value,
//         })
//         console.log(this.state.searchRow)
//     }

//     const toSearch = async () => {
//         try {
//             const body = this.state.searchRow
//             console.log('tosearch body ',  body)
//             const response = await fetch(
//                 `http://192.168.0.20:5000/${this.props.tableName}/search`, {
//                     method: 'POST',
//                     headers: {'Content-Type': 'application/json'},
//                     body: JSON.stringify(body)
//                 })

//             const data = await response.json()
//             console.log(data)
//             setRows(data)
//             setSearchRow({})
//         } catch (error) {
//             console.log(error.message);
//         }
//     }

//     //Sends POST request on server to create new row in the table
//     const createRow = async () => {
//         try {
//             const body = {}
//             this.props.table.forEach( (row, index) => {
//                 body[row.field] = document.getElementById(`search-create-${row.field}`).value
//             })

            
//             console.log(`Trying to create row in table ${this.props.tableName}`, body)
//             const response = await fetch(
//                 `http://192.168.0.20:5000/${this.props.tableName}/new`, {
//                     method: 'POST',
//                     headers: {'Content-Type': 'application/json'},
//                     body: JSON.stringify(body)
//                 }
//             )


//             const data = await response.json()
//             data.forEach(element => {
//                 if(Object.keys(element).includes( this.props.table[0].field )) this.state.rows.push(element)
//             })
            
//             this.props.table.forEach( (row) => {
//                 document.getElementById(`search-create-${row.field}`).value = ''
//             })
//             setSearchRow ({})
//             setRows(this.state.rows)
            
//         } catch (error) {
//             console.log(error.message)
//         }
//     }

//     const editRowHandler = async () => {
//         try {
//             const body = this.state.entity
//             const response = await fetch(
//                 `http://192.168.0.20:5000/${this.props.tableName}/${this.state.entity[this.props.table[0].field]}`, {
//                     method: 'PUT',
//                     headers: {'Content-Type': 'application/json'},
//                     body: JSON.stringify(body)
//                 }
//             )

//             const data = await response.json()
//             console.log('Successfuly edited row ', data);
            
//             const _ = this.state.rows.map( (_row, id) => {
//                 if(_row[this.props.table[0].field] === data[this.props.table[0].field]) return data
//                     else return _row
                    
//             })
//             setRows(_)
//             setEntity({})
//             editingField(false)
//         } catch (error) {
//             console.log(error.message)
//         }
        
//     }

//     //deleting row from this.state.rows array by it index
//     const deleteRow = async row_id => {
       
//         try {
//             console.log('Trying to delete row', row_id)
//             console.log(this.state.rows[row_id]);
//             const response = await fetch(
//                 `http://192.168.0.20:5000/${this.props.tableName}/${this.state.rows[row_id][this.props.table[0].field]}`, {
//                     method: 'DELETE',
//                 }
//             )

//             setRows(this.state.rows.filter((row, index) => index !== row_id))
//             editingField(false)
//         } catch (error) {
//             console.log(error.message)
//         }
//     }

//     return (
        
//         <div className="container">
        
//             <div id="form-editing" className="form-editing-hidden">
//                 <form className="p-3 border border-primary rounded mb-3">
//                 {
                    
//                     this.props.table.map( (row, index) => {
//                         let type
//                         switch (row.type) {
//                             case types.date:
//                                 type='date'
//                                 break
//                             case types.datetime:
//                                 type='datetime-local'
//                                 break
//                             case types.money:
//                                 type='number'
//                                 break
//                             case types.string:
//                                 type='text'
//                                 break
//                             case types.number:
//                                 type='number'
//                                 break
//                             default:
//                                 type='text'
//                                 break;
//                         }
//                         return (
                            
//                             <div className="form-group row" key={index}>
//                                 <label className="col-sm-2 col-form-label" name={row.field} htmlFor={`edit-${row.field}`}>{row.field}</label>                 
//                                 <div className="col-sm-10"><input className="form-control" id={`edit-${row.field}`} name={row.field} type={type} onChange={e => editInputChangeHandler(e)} value={this.state.entity[row.field]} /></div>
//                             </div>
                            
//                         )
                        
//                     })
                    
//                 }
//                 <button className="btn btn-warning" onClick={editRowHandler}>Edit Row</button>
//                 <button className="btn btn-danger " onClick={() => editingField(false)}  >&#10006;</button>
            
//                 </form>
//                 {/* ending of editing form */}
//                 </div>
            
//             <div className="search-create-form">
//                 <form className="p-3 rounded border border-primary">
//                 {
//                     this.props.table.map( (row, index) => {
//                         let type
//                         switch (row.type) {
//                             case types.date:
//                                 type='date'
//                                 break
//                             case types.datetime:
//                                 type='datetime-local'
//                                 break
//                             case types.money:
//                                 type='number'
//                                 break
//                             case types.string:
//                                 type='text'
//                                 break
//                             case types.number:
//                                 type='number'
//                                 break
//                             default:
//                                 type='text'
//                                 break;
//                         }
//                         return (
//                             <div className="form-group row" key={index}>
//                             <label className="col-sm-2 col-form-label" name={row.field} htmlFor={`search-create-${row.field}`}>{row.field}</label>                        
//                             <div className="col-sm-10"><input className="form-control" id={`search-create-${row.field}`} name={row.field} type={type} onChange={ e => searchInputHandler(e)} /></div>
//                             </div>
//                         )
//                     })
//                 }
//                     <button className="btn btn-warning" onClick={toSearch} >Find</button>
//                     <button className="btn btn-success" onClick={createRow} >Create</button>
//                 </form>
//             </div>
            
//             <table className='table mt-5 table-hover table-dark'>
//                 <thead>
//                     <tr>
//                         {
//                             this.props.table.map( (row, index) => {
//                                 return (
//                                     <Fragment key={index}>
//                                         <th >{row.field}</th>
//                                     </Fragment>    
//                                 )
//                             })
                            
//                         }   
//                         <th>Delete</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         this.state.rows.map( (row, index) => {
//                             return (
//                                 <tr key={index}>
//                                 {
//                                     this.props.table.map( (entityRow, ind) => {    
//                                         return (
//                                         <td key={ind} onClick={ () => onRowSelected(index)}  >{row[entityRow.field]}</td>
//                                         )
//                                     })
                                    
//                                 }
//                                     <td><button className="btn btn-danger" onClick={() => deleteRow(index)}>Delete</button></td>
//                                 </tr>
//                             )
//                         })
//                     }
//                 </tbody>
//             </table>
            
//         </div>
//     )
//     }
// }

// export default Table2