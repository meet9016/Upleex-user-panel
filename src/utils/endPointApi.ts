export interface EndPointApi {
    login: string;
    register: string;
    logout: string;

    //Vendor
    home: string;
    webSubCategoryList: string;
    webCategoryProductList: string;
    webSingleProductList: string;

    //Product details
    webGetQuote: string;
}

// Define and export the API endpoint object
const endPointApi: EndPointApi = {
    login: 'vendor-login',
    register: 'auth/register',
    logout: 'auth/logout',

    //Vendor
    home: 'home',
    webSubCategoryList: 'web-sub-category-list',
    webCategoryProductList: 'web-category-product-list',
    webSingleProductList: 'web-single-product-list',

    //Product details
    webGetQuote: 'web-get-quote',
};

export default endPointApi;