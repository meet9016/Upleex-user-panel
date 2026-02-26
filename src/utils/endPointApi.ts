export interface EndPointApi {
    //Auth
    webLoginRegister: string;
    logout: string;

    //Vendor
    home: string;
    webSubCategoryList: string;
    webCategoryProductList: string;
    webSingleProductList: string;
    webVendorProductList: string;
    webAllCityList: string;
    webProductSuggestionList: string;
    webSearchProductList: string;

    //Product details
    webGetQuote: string;

    // Content
    blogList: string;
    singleBlog: string;
    faqList: string;

    // Cart
    webAddToCart: string;
    webCartList: string;
    webRemoveCart: string;
    businessRegister: string;
}

// Define and export the API endpoint object
const endPointApi: EndPointApi = {
    //Auth
    webLoginRegister: 'web-login-register',
    logout: 'auth/logout',

    //Vendor
    home: 'categories/getall',
    webSubCategoryList: 'subcategories/getall',
    webCategoryProductList: 'products/getall',
    webSingleProductList: 'products/getById',
    webVendorProductList: 'products/web-vendor-product-list',
    webAllCityList: 'web-all-city-list',
    webProductSuggestionList: 'web-product-suggestion-list',
    webSearchProductList: 'web-search-product-list',

    //Product details
    webGetQuote: 'web-get-quote',

    // Content
    blogList: 'blogs/getall',
    singleBlog: 'blogs/getbyid',
    faqList: 'faqs/getall',

    // Cart
    webAddToCart: 'cart/web-add-to-cart',
    webCartList: 'cart/web-cart-list',
    webRemoveCart: 'cart/web-remove-cart',
    businessRegister: 'vendor/auth/business-register',
};



export default endPointApi;
