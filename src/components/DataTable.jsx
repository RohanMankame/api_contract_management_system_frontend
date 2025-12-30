import { ModuleRegistry, AllCommunityModule, themeQuartz, iconSetQuartzLight } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../styles/components/DataTable.css';

ModuleRegistry.registerModules([AllCommunityModule]);

// Create custom theme
const myTheme = themeQuartz
  .withPart(iconSetQuartzLight)
  .withParams({
    accentColor: "#52CC47",
    backgroundColor: "#FFFFFF",
    borderColor: "#1D7D45",
    borderRadius: 5,
    browserColorScheme: "light",
    columnBorder: false,
    fontFamily: {
      googleFont: "var(--fontFamily)"
    },
    fontSize: 16,
    foregroundColor: "rgb(46, 55, 66)",
    headerBackgroundColor: "#1D7C44",
    headerFontFamily: {
      googleFont: "var(--fontFamily)"
    },
    headerFontSize: 14,
    headerFontWeight: 700,
    headerTextColor: "#FFFFFF",
    oddRowBackgroundColor: "#F9FAFB",
    rowBorder: true,
    sidePanelBorder: true,
    spacing: 8,
    wrapperBorder: true,
    wrapperBorderRadius: 8
  });

export function DataTable({ 
  data = [],
  isLoading, 
  error, 
  columnDefs,
  paginationPageSize = 20,
  className = '',
  onGridReady,
  onRowDoubleClick
}) {
  if (isLoading) return <div className="data-table-loading">Loading...</div>;
  if (error) return <div className="data-table-error">Error: {error}</div>;

  const rowData = Array.isArray(data) ? data : [];

  return (
    <div className={`data-table-container ${className}`}>
      <AgGridReact
        onGridReady={onGridReady}
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
  );
}