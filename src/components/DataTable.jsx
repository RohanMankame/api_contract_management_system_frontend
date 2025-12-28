import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../styles/components/DataTable.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export function DataTable({ 
  data = [],
  isLoading, 
  error, 
  columnDefs,
  paginationPageSize = 20,
  className = ''
}) {
  if (isLoading) return <div className="data-table-loading">Loading...</div>;
  if (error) return <div className="data-table-error">Error: {error}</div>;

  const rowData = Array.isArray(data) ? data : [];

  return (
    <div className={`data-table-container ${className}`}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        theme={themeQuartz}
        pagination={true}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={[5,10, 20, 50]}
        suppressMovableColumns={false}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
      />
    </div>
  );
}