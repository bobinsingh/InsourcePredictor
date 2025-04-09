import React from 'react';
import DataTable from 'react-data-table-component';
import './DataTable.css';

// Function to highlight certain outcome rows
const conditionalRowStyles = [
  {
    when: row => row.outcome === 'Eliminate',
    classNames: ['highlight-eliminate'],
  },
  {
    when: row => row.outcome === 'Current Outsource',
    classNames: ['highlight-current-outsource'],
  },
  {
    when: row => row.outcome === 'New Outsource',
    classNames: ['highlight-new-outsource'],
  },
  {
    when: row => row.outcome === 'Insource or create in-house capacity',
    classNames: ['highlight-insource'],
  },
  {
    when: row => row.outcome === 'Requires Further Analysis',
    classNames: ['highlight-analysis'],
  },
];

const Table = ({ columns, data }) => {
  return (
    <div className="data-table-container">
      <DataTable
        columns={columns}
        data={data}
        pagination
        responsive
        highlightOnHover
        pointerOnHover
        conditionalRowStyles={conditionalRowStyles}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
        noDataComponent="No activities found"
        className="custom-data-table"
        striped
        fixedHeader
        fixedHeaderScrollHeight="500px"
      />
    </div>
  );
};

export default Table;