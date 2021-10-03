// Lib import
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
const _ = require('lodash');

const TableStruct = (props) =>{
    const [itemSelected, setItemSelected] = useState();
    const [data, setData] = useState([]);
    
    useEffect(() => {
        if(data.length === 0) setData(props.content);
        let content = props.content;
        if(!!props.searchItem) {
            content = searchColumns(content);
        }
        setData(content);
    }, [props.searchItem]);

    const searchColumns = (data) => {
        let dataFound = [];
        data.filter((o) =>
            Object.values(o).filter((val)=>{
                if((new RegExp(props.searchItem)).test(val)){
                    if (!_.find(dataFound, o)) {
                        dataFound.push(o);
                    }
                }
            })
        );
        return (!dataFound ? [] : dataFound);
    };

    const handleClickEvent = (row, type) => { 
        setItemSelected(row);
        props.handleRowClick(row, type);
    }

    return (
        <section className="list-wrap">
            <table className="table-wrap">
                <thead className="table-header-wrap">
                    <tr className="table-header-row">
                        {props.headers && props.headers.map((header) => {
                            return (
                                <th className="table-header-column"
                                    key={header.name}>
                                    <span>{header.displayName}</span>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {(data.length > 0) ? 
                        data.map((contentRow, index) => {
                            return (
                                <tr key={index} className={`${itemSelected ? (contentRow.id === itemSelected.id ? 'active' : '') : ''}`} >
                                    {props.headers && props.headers.map((column, headerIndex) => {
                                        return (
                                            <td key={headerIndex} name={column.name}
                                                onClick={() => {if(column.name === 'username' || column.name === 'title') handleClickEvent(contentRow, column.name)}}                                            >
                                                {contentRow[column.name]}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        }) : 
                        <tr className="table-content-row no-data">
                            <td className="table-content-column no-data"> <i>No data available</i> </td>
                        </tr>}
                </tbody>
            </table>
        </section>
    );
}

TableStruct.propTypes = {
    content: PropTypes.instanceOf(Object).isRequired,
    selectItemIndex: PropTypes.string
};
  
export default TableStruct;
