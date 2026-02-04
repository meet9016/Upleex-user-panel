export interface EndPointApi {
    //Auth
    webLoginRegister: string;
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
    //Auth
    webLoginRegister: 'web-login-register',
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