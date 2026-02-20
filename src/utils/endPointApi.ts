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
    home: 'home',
    webSubCategoryList: 'web-sub-category-list',
    webCategoryProductList: 'web-category-product-list',
    webSingleProductList: 'web-single-product-list',
    webVendorProductList: 'web-vendor-product-list',
    webAllCityList: 'web-all-city-list',
    webProductSuggestionList: 'web-product-suggestion-list',
    webSearchProductList: 'web-search-product-list',

    //Product details
    webGetQuote: 'web-get-quote',

    // Content
    blogList: 'blog-list',
    singleBlog: 'single-blog',
    faqList: 'faq-list',

    // Cart
    webAddToCart: 'web-add-to-cart',
    webCartList: 'web-cart-list',
    webRemoveCart: 'web-remove-cart',
    businessRegister: 'business-register',
};



export default endPointApi;
