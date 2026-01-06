import { ModuleRegistry, AllCommunityModule, themeQuartz, iconSetQuartzLight } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '../styles/components/DataTable.css';
import { useEffect, useRef, useState } from 'react';

ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz
  .withPart(iconSetQuartzLight)
  .withParams({
    accentColor: "#52CC47",
    backgroundColor: "#FFFFFF",
    borderColor: "#1D7D45",
    borderRadius: 5,
    browserColorScheme: "light",
    columnBorder: false,
    fontFamily: { googleFont: "var(--fontFamily)" },
    fontSize: 16,
    foregroundColor: "rgb(46, 55, 66)",
    headerBackgroundColor: "#1D7C44",
    headerFontFamily: { googleFont: "var(--fontFamily)" },
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
  onRowDoubleClick,
  exportFileName = 'data-export',
  quickFilterText,
  onQuickFilterChange,
  csvExportOptions = {}, 
}) {
  const [searchText, setSearchText] = useState(quickFilterText ?? '');
  const gridApiRef = useRef(null);

  useEffect(() => {
    if (quickFilterText !== undefined) {
      setSearchText(quickFilterText);
      if (gridApiRef.current) gridApiRef.current.setQuickFilter(quickFilterText);
    }
  }, [quickFilterText]);

  if (isLoading) return <div className="data-table-loading">Loading...</div>;
  if (error) return <div className="data-table-error">Error: {error}</div>;

  const rowData = Array.isArray(data) ? data : [];

  const handleGridReady = (params) => {
    gridApiRef.current = params.api;
    if (onGridReady) onGridReady(params);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (onQuickFilterChange) onQuickFilterChange(value);
    else setSearchText(value);
    if (gridApiRef.current) gridApiRef.current.setQuickFilter(value);
  };

  const exportCSV = () => {
    const gridApi = gridApiRef.current;
    if (!gridApi) return;
    gridApi.exportDataAsCsv({
      fileName: `${exportFileName}.csv`,
      allColumns: false,
      ...csvExportOptions,
    });
  };

  return (
    <div className={`data-table-wrapper ${className}`}>
      <div className={`data-table-container ag-theme-quartz`}>
        <div className="search-area">
          <input
            type="text"
            placeholder={`Search ${exportFileName}`}
            value={searchText}
            onChange={handleSearch}
            className="search-input"
            aria-label={`Search ${exportFileName}`}
          />
        </div>

        <div className="data-table-grid">
          <AgGridReact
            onGridReady={handleGridReady}
            onRowDoubleClicked={onRowDoubleClick}
            rowData={rowData}
            columnDefs={columnDefs}
            frameworkComponents={{}}
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
      </div>

      <div className="data-table-actions-row">
        <div className="data-table-export-actions" role="group" aria-label="Export actions">
          <button className="btn export-btn" onClick={exportCSV} aria-label="Export CSV">
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}