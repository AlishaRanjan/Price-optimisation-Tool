
export interface FetchCategories {
    categories: string[];
}
export interface Category {
    name: string;
}

export interface ProductResponseInterface {
    id: number;
    name: string;
    description: string;
    cost_price: string;
    selling_price: string;
    stock_available: number;
    units_sold: number;
    customer_rating: string;
    optimized_price: string;
    category: Category;
}

export interface Forecast {
    product: number;
    forecast_value: string;
}

export interface ForecastResponse {
    created_forecasts: Forecast[];
}


export interface Product {
    name: string;
    category_name: string;
    cost_price: string;
    selling_price: string;
    description: string;
    stock_available: string;
    units_sold: string;
}

export interface AddNewProductModalProps {
    onCloseHandler: () => void;
    product_id?: number;
    product?: Product | undefined;
    isEditMode?: boolean;
}

export interface DemandForecastModalProps {
    demandFrorecastData?: Forecast[];
    filteredList?: ProductResponseInterface[];
    onCloseHandler: () => void;
}

export interface AddNewProductModalProps {
    onCloseHandler: () => void;
    product?: Product;
}
