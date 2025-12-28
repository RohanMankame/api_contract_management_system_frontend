import { useEffect, useRef, useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { DataTable } from '../components/DataTable';
import { useApi } from '../hooks/useApi';
import { EntityModal } from '../components/EntityModal';
import '../styles/pages/ProductsPage.css';

export function ProductsPage() {
  const { data: response, isLoading, error, get, post } = useApi();
  const gridApiRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);

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
    { field: 'updated_at', headerName: 'Updated', flex: 1 },
  ];

  const formFields = [
  { name: 'api_name', label: 'Product Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
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

  const handleAddProduct = async (formData) => {
    try {
      await post('/products', formData);
      setShowModal(false);
      // Refresh the table
      get('/products');
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <PageLayout>
      <div className="products-container">
        <div className="products-header">
          <div className="products-header-top">
            <div>
              <h2>Products</h2>
              <p>Manage your API products and versions</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-add-product">
              + Add Product
            </button>
          </div>
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
        <EntityModal
          isOpen={showModal}
          title="Add Product"
          fields={formFields}
          onSubmit={handleAddProduct}
          onClose={() => setShowModal(false)}
        />
      </div>
    </PageLayout>
  );
}