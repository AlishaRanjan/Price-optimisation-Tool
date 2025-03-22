import { useState, useEffect, useCallback } from 'react'
import { ChevronsDown } from 'lucide-react'
import { Table, TableCell, TableHeader, TableRow } from '../../common/Table'
import { Link } from 'react-router-dom'
import { Container, Divider, OptimizedPriceWrapper, TableWrapper, Toolbar, ToolbarLeft, ToolbarRight } from '../styles'
import SearchInput from '../../common/SearchInput'
import CategorySelect from '../../common/Select'
import { fetchCategories, fetchProductList } from '../../ducks/api'
import HeaderComponent from '../../common/header'
import withAuth from '../../ducks/auth_hoc'
import { ProductResponseInterface } from '../../ducks/types'
import React from 'react'

/**
 * ProductOptimization Component
 * 
 * This component is responsible for displaying and managing the product optimization process.
 * It allows users to search, filter, and view products with optimization data such as cost and selling prices.
 * The component fetches categories and products from external sources, applies filters based on the search term and category, 
 * and displays the results in a table format. 
 */

const ProductOptimization = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [productList, setProductList] = useState<ProductResponseInterface[]>([]);
  const [filteredList, setfilteredList] = useState(productList);

  useEffect(() => {
    const getData = async () => {
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

    getData();
  }, []);


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

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    filterProducts(query, selectedCategory);
    // eslint-disable-next-line
  }, [setSearchTerm, filterProducts]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterProducts(searchTerm, category);
    // eslint-disable-next-line
  }, [setSearchTerm, filterProducts]);

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
            Price Optimization
          </ToolbarLeft>

          <ToolbarRight>
            <SearchInput value={searchTerm} onChangeHandler={handleSearchChange} />
            <CategorySelect selectedCategory={selectedCategory} categorylist={['All', ...categories]} onChangeHandler={handleCategoryChange} />
          </ToolbarRight>
        </Toolbar>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <TableHeader>Product Name</TableHeader>
                <TableHeader>Product Category</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Cost Price</TableHeader>
                <TableHeader>Selling Price</TableHeader>
                <TableHeader>Optimized Price</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredList.length <= 0 ? "No Data available" :
                filteredList.map((product: ProductResponseInterface, id: number) => (
                  <TableRow key={id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.description}
                    </TableCell>
                    <TableCell>${product.cost_price}</TableCell>
                    <TableCell>${product.selling_price}</TableCell>
                    <TableCell>
                      <OptimizedPriceWrapper>
                        <span style={{ color: "#807f7f" }}>${product.cost_price}</span>
                        <span style={{ color: "#10b981" }}>${product.optimized_price}</span>
                      </OptimizedPriceWrapper>
                    </TableCell>
                  </TableRow>
                ))}
            </tbody>
          </Table>
        </TableWrapper>
      </div>
    </Container>
  )
}

export default withAuth(React.memo(ProductOptimization));