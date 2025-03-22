import { FetchCategories, ForecastResponse, ProductResponseInterface } from './types';
import { getHeaders, handleUnauthorized } from './utils';


export const fetchCategories = async (): Promise<FetchCategories> => {
    try {
        const response = await fetch('http://127.0.0.1:8000/pot/api/categories/', {
            method: 'GET',
            headers: getHeaders(),
        });
        if (response.status === 401) {
            handleUnauthorized();
        }
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const data: FetchCategories = await response.json();
        return data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
};


export const fetchProductList = async (): Promise<ProductResponseInterface[]> => {
    try {
        const response = await fetch('http://127.0.0.1:8000/pot/api/products/', {
            method: 'GET',
            headers: getHeaders(),
        });
        if (response.status === 401) {
            handleUnauthorized();
        }
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const data: ProductResponseInterface[] = await response.json();
        return data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
};

export const deleteProduct = async (id: number) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/pot/api/product/${id}/`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        if (!response.ok) {
            throw new Error('Failed to delete the product');
        }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
};


export const addDataToTable = async (selectedProducts: string[]) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/pot/api/demand-forecast/', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ 'product_id_list': selectedProducts }),
        });
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const newData: ForecastResponse = await response.json();
        return newData;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
}

export const updateProduct = async (product_id: number | undefined, updatedFields: any) => {
    const apiUrl = `http://127.0.0.1:8000/pot/api/product/${product_id}/`;
    console.log('Put API')

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(updatedFields),
        });
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        if (!response.ok) {
            throw new Error(`Failed to update the product. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
};

export const postProductData = async (formData: any) => {
    const apiUrl = 'http://127.0.0.1:8000/pot/api/product/';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(formData),
        });
        if (response.status === 401) {
            handleUnauthorized();
            return;
        }
        if (!response.ok) {
            throw new Error('Failed to submit the product data');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'An error occurred');
    }
};
