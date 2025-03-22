import { useCallback, useEffect, useState } from 'react'
import { Eye, Pencil, Trash2, CirclePlus, FileChartColumnIncreasing, ChevronsDown } from 'lucide-react'
import { Button } from '../../common/Button'
import { Checkbox } from '../../common/Checkbox'
import CategorySelect from '../../common/Select'
import { Table, TableCell, TableHeader, TableRow } from '../../common/Table'
import AddNewProductModal from './AddnewProductModal';
import ViewProductModal from './ViewProductModal';
import DemandForecastModal from './DemanadForecastModal'
import { Link } from 'react-router-dom'
import { ActionButtons, Container, Divider, TableWrapper, Toolbar, ToolbarLeft, ToolbarRight, NoText } from '../styles'
import SearchInput from '../../common/SearchInput'
import { addDataToTable, deleteProduct, fetchCategories, fetchProductList } from '../../ducks/api'
import HeaderComponent from '../../common/header'
import Cookies from 'js-cookie'
import withAuth from '../../ducks/auth_hoc'
import { Forecast, ProductResponseInterface } from '../../ducks/types'
import React from 'react'

/**
 * CreateManageProduct Component
 * 
 * Description:
 * This component is used for managing and creating products, including functionalities such as searching, 
 * filtering, adding, editing, viewing, deleting, and generating demand forecasts for products.
 */

const CreateManageProduct = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [isDemandForecastOpen, setIsDemandForecastOpen] = useState<boolean>(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState<boolean>(false);
  const [isViewProductOpen, setIsViewProductOpen] = useState<boolean>(false);
  const [productId, setProductId] = useState<number>(-1);

  const [productList, setProductList] = useState<ProductResponseInterface[]>([]);
  const [filteredList, setfilteredList] = useState(productList);
  const [demandForecastBtnStatus, setDemandForecastBtnStatus] = useState<Boolean>(false);
  const [demandFrorecastData, setDemandFrorecastData] = useState<Forecast[]>([]);
  const [addDemandForecastCol, setSddDemandForecastCol] = useState<Boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selectedProducts.length > 0) {
      setDemandForecastBtnStatus(true);
    } else {
      setDemandForecastBtnStatus(false);
    }
  }, [selectedProducts])


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    filterProducts(query, selectedCategory);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (search: string, category: string) => {
    let filtered = productList;

    if (category !== 'All') {
      filtered = filtered.filter((product) => product.category.name === category);
    }

    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setfilteredList(filtered);
  };

  const getData = async () => {
    console.log('getData')
    try {
      const category_data = await fetchCategories();
      const product_data = await fetchProductList();
      setCategories(category_data.categories);
      setProductList(product_data)
      setfilteredList(product_data)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  useEffect(() => {
    console.log('useEffect')
    getData();
  }, []);

  const onAddProductOverlayClosed = useCallback(() => {
    setIsAddProductOpen(false);
    getData();
  }, []);

  const onEditProductOverlayClosed = useCallback(() => {
    setIsEditProductOpen(false);
    getData();
  }, []);

  const onDeleteClick = async (id: number) => {
    try {
      await deleteProduct(id)
      setProductList(productList.filter(product => product.id !== id));
      setfilteredList(productList.filter(product => product.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  const onEditClick = (id: number) => {
    setProductId(id);
    setIsEditProductOpen(prev => !prev);
  }

  const onViewClick = (id: number) => {
    setProductId(id);
    setIsViewProductOpen(prev => !prev);
  }
  const onViewProductOverlayClosed = useCallback(() => {
    setIsViewProductOpen(false);
  }, []);

  const handleCheckboxChange = (productId: string) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.includes(productId)) {
        return prevSelectedProducts.filter((id) => id !== productId);
      } else {
        return [...prevSelectedProducts, productId];
      }
    });
  };

  const onClickDemandForecastBtn = async () => {
    const demand_data = await addDataToTable(selectedProducts);
    setDemandFrorecastData(demand_data?.created_forecasts as Forecast[])
    setIsDemandForecastOpen(prev => !prev)
  }

  useEffect(() => {
    const userRole = Cookies.get('user_role');
    setUserRole(userRole);
  }, []);

  return (
    <Container>
      <HeaderComponent />
      <div>
        <Toolbar>
          <ToolbarLeft>
            <Link to="/home" style={{ display: "flex", alignItems: "center", cursor: "pointer", textDecoration: "none", color: "#fff" }}>
              <ChevronsDown style={{ transform: 'rotate(90deg)', color: "#10b981" }} />
              Back
            </Link>
            <Divider />
            Create and Manage Product
          </ToolbarLeft>

          <ToolbarRight>
            <SearchInput value={searchTerm} onChangeHandler={handleSearchChange} />
            <CategorySelect selectedCategory={selectedCategory} categorylist={['All', ...categories]} onChangeHandler={handleCategoryChange} />
            <Divider />
            <Button variant={'primary'} onClick={() => { setIsAddProductOpen(prev => !prev) }}>
              <CirclePlus size={16} />
              Add New Product
            </Button>
            <Button variant={demandForecastBtnStatus ? 'primary' : 'disable'} onClick={onClickDemandForecastBtn}>
              <FileChartColumnIncreasing size={16} />
              Demand Forcast
            </Button>
          </ToolbarRight>
        </Toolbar>

        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader />
                <TableHeader>Product Name</TableHeader>
                <TableHeader>Product Category</TableHeader>
                <TableHeader>Cost Price</TableHeader>
                <TableHeader>Selling Price</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Available Stock</TableHeader>
                <TableHeader>Units Sold</TableHeader>
                {addDemandForecastCol &&
                  <TableHeader style={{ maxWidth: "100px", textWrap: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>Calculated Demand Forecast</TableHeader>
                }
                <TableHeader style={{ textAlign: "center" }}>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredList.length <= 0 ?
                <tr>
                  <td><NoText>No Data available</NoText></td></tr>
                :
                filteredList.map((product: ProductResponseInterface, id: number) => {
                  const forecastData = demandFrorecastData?.find((forecast) => forecast.product === product.id);
                  return (
                    <TableRow key={id}>
                      <TableCell>
                        <Checkbox
                          onChange={() => handleCheckboxChange(product.id.toString())}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>${product.cost_price}</TableCell>
                      <TableCell>${product.selling_price}</TableCell>
                      <TableCell style={{ maxWidth: '28rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.description}
                      </TableCell>
                      <TableCell>{product.stock_available}</TableCell>
                      <TableCell>{product.units_sold}</TableCell>
                      {addDemandForecastCol &&
                        <TableCell style={{ color: "#38bda4" }}>{forecastData?.forecast_value}</TableCell>
                      }
                      <TableCell>
                        <ActionButtons>
                          <Eye size={16} cursor='pointer' onClick={() => onViewClick(product.id)} />
                          {(userRole === 'Admin' || userRole === 'Supplier' || userRole === 'Support') &&
                            <Pencil size={16} cursor='pointer' onClick={() => onEditClick(product.id)} />}
                          {userRole === 'Admin' &&
                            <Trash2 size={16} color='#ef4444' cursor='pointer' onClick={() => onDeleteClick(product.id)} />
                          }
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </tbody>
          </Table>
        </TableWrapper>
      </div>
      {isAddProductOpen &&
        <AddNewProductModal
          isEditMode={false}
          onCloseHandler={onAddProductOverlayClosed} />}
      {isEditProductOpen && (userRole === 'Admin' || userRole === 'Supplier' || userRole === 'Support') &&
        <AddNewProductModal
          isEditMode={true}
          product_id={productId}
          product={(() => {
            const selectedProduct = filteredList.find(product => product.id === productId);

            if (selectedProduct) {
              return {
                name: selectedProduct.name || '',
                category_name: selectedProduct.category.name || '',
                cost_price: String(selectedProduct.cost_price || ''),
                selling_price: String(selectedProduct.selling_price || ''),
                description: selectedProduct.description || '',
                stock_available: String(selectedProduct.stock_available || ''),
                units_sold: String(selectedProduct.units_sold || ''),
              };
            }
            return undefined;
          })()}
          onCloseHandler={onEditProductOverlayClosed} />}

      {isViewProductOpen &&
        <ViewProductModal
          product={
            (() => {
              const selectedProduct = filteredList.find(product => product.id === productId);

              if (selectedProduct) {
                return {
                  name: selectedProduct.name || '',
                  category_name: selectedProduct.category.name || '',
                  cost_price: String(selectedProduct.cost_price || ''),
                  selling_price: String(selectedProduct.selling_price || ''),
                  description: selectedProduct.description || '',
                  stock_available: String(selectedProduct.stock_available || ''),
                  units_sold: String(selectedProduct.units_sold || ''),
                };
              }
              return undefined;
            })()}
          onCloseHandler={onViewProductOverlayClosed} />}

      {isDemandForecastOpen && <DemandForecastModal
        demandFrorecastData={demandFrorecastData}
        filteredList={filteredList}
        onCloseHandler={() => { setIsDemandForecastOpen(false); setSddDemandForecastCol(true); }} />}
    </Container>

  )
}

export default withAuth(React.memo(CreateManageProduct));