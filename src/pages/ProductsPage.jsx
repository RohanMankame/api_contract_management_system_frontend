import { useEffect, useRef, useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { DataTable } from '../components/DataTable';
import { useApi } from '../hooks/useApi';
import '../styles/pages/ProductsPage.css';

export function ProductsPage() {
  const { data: response, isLoading, error, get } = useApi();
  const gridApiRef = useRef(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    get('/products');
  }, []);

  const products = (response && response.data && Array.isArray(response.data.products)) 
    ? response.data.products 
    : [];

  const columnDefs = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'api_name', headerName: 'Name', flex: 2 },
    { field: 'description', headerName: 'Description', flex: 3 },
    { field: 'created_at', headerName: 'Created', flex: 1 },
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption('quickFilterText', value);
    }
  };

  const handleGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  return (
    <PageLayout>
      <div className="products-container">
        <div className="products-header">
          <h2>Products</h2>
          <p>Manage your API products and versions</p>
          <div className="products-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
        <DataTable 
          onGridReady={handleGridReady}
          data={products} 
          isLoading={isLoading} 
          error={error}
          columnDefs={columnDefs}
          paginationPageSize={10}
        />
      </div>
    </PageLayout>
  );
}