import { ModuleRegistry, AllCommunityModule, themeQuartz, iconSetQuartzLight } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../styles/components/DataTable.css';
import * as XLSX from 'xlsx';
import { useRef } from 'react';

ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz
  .withPart(iconSetQuartzLight)
  .withParams({
  });

export function DataTable({
  data = [],
  isLoading,
  error,
  columnDefs,
  paginationPageSize = 20,
  className = '',
  onGridReady,
  onRowDoubleClick,
  exportFileName = 'data-export', 
}) {
  const gridApiRef = useRef(null);

  if (isLoading) return <div className="data-table-loading">Loading...</div>;
  if (error) return <div className="data-table-error">Error: {error}</div>;

  const rowData = Array.isArray(data) ? data : [];

  const handleGridReady = (params) => {
    gridApiRef.current = params.api;
    if (onGridReady) onGridReady(params);
  };

  const getExportRows = () => {
    const api = gridApiRef.current;
    if (!api) return [];
    const cols = (columnDefs || []).filter(c => c.field).map(c => ({
      field: c.field,
      header: c.headerName || c.field,
    }));
    const rows = [];
    api.forEachNodeAfterFilterAndSort((node) => {
      if (node.data) {
        const row = {};
        cols.forEach(col => {
          row[col.header] = node.data[col.field];
        });
        rows.push(row);
      }
    });
    return rows;
  };

  const exportCSV = () => {
    const rows = getExportRows();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${exportFileName}.csv`);
  };

  const exportExcel = () => {
    const rows = getExportRows();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${exportFileName}.xlsx`);
  };

  return (
    <div>
    <div className={`data-table-container ${className}`}>
      <AgGridReact
        onGridReady={handleGridReady}
        onRowDoubleClicked={onRowDoubleClick}
        rowData={rowData}
        columnDefs={columnDefs}
        theme={myTheme}
        pagination={true}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        suppressMovableColumns={false}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
      />
    </div>

    <div className="data-table-toolbar">
        <button className="btn export-btn" onClick={exportCSV}>Export CSV</button>
        <button className="btn export-btn" onClick={exportExcel}>Export Excel</button>
    </div>


    </div>
    
    
  );
}