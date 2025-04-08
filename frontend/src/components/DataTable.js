import React from 'react';
import DataTable from 'react-data-table-component';

const customStyles = {
  table: {
    style: {
      borderRadius: '5px',
      overflow: 'hidden',
    },
  },
  headRow: {
    style: {
      backgroundColor: '#f8f9fa',
      borderBottomWidth: '2px',
    },
  },
  headCells: {
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  rows: {
    style: {
      fontSize: '14px',
      minHeight: '48px',
      '&:not(:last-of-type)': {
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: '#e9ecef',
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: '#f8f9fa',
      cursor: 'pointer',
    },
  },
  cells: {
    style: {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  pagination: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: '#e9ecef',
    },
  },
};

const Table = ({ columns, data }) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      responsive
      highlightOnHover
      customStyles={customStyles}
      paginationPerPage={10}
      paginationRowsPerPageOptions={[5, 10, 15, 20]}
      noDataComponent="No activities found"
    />
  );
};

export default Table;