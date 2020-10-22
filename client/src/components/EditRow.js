import React, {Fragment, useState, useEffect} from 'react'
import {types} from './Table'
import {serverUrl} from './Table'

export const EditRow = (props) => {

    const [entity, setEntity] = useState({...props.entity})
    
    useEffect(() => {
        setEntity({...props.entity})
    }, [props.toChange, props.entity])

    const editRowHandler = async () => {
        try {
            console.log('aaaaaaaa');
            const body = entity
            const response = await fetch(
                `${serverUrl}/${props.tableName}/${entity[props.table[0].field]}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )

            await response.json()
            
            props.update(props.tableName)
            setEntity({})
        } catch (error) {
            console.log(error.message)
        }
        
    }

    

    const editInputChangeHandler = event => {
        console.log('aaaaaa, event', event.target.value);
        setEntity({...entity, [event.target.name]: event.target.value})
        console.log(entity)
    }

    return (
        <Fragment>
            <button 
                type="button" 
                className="btn btn-warning" 
                data-toggle="modal" 
                data-target={`#edit-modal-${entity[props.table[0].field]}`}>Edit</button>

          
            <div style={{color: 'black'}} className="modal" id={`edit-modal-${entity[props.table[0].field]}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Editing form</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {/* start of editing form */}
                        <div id="form-editing" >
                            
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
                                            <label className="col-sm-2 col-form-label" name={row.field} htmlFor={`#edit-${row.field}-${entity[props.table[0].field]}`}>{row.field}</label>                 
                                            <div className="col-sm-10"><input className="form-control" id={`edit-${row.field}-${entity[props.table[0].field]}`} name={row.field} type={type} onChange={e => editInputChangeHandler(e)} value={entity[row.field]} /></div>
                                        </div>
                                        
                                    )
                                })
                                
                            }
                        
                            </div>
                            {/* ending of editing form */}
                        </div>
    	    

                        {/* enging of editing form inside of modal*/}
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={editRowHandler} data-dismiss="modal" className="btn btn-primary">Save changes</button>
                        <button type="button" onClick={()=> setEntity(props.entity)} className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}