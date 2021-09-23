import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'

// @desc fetch all products
// @route /api/products?keyword=...&pageNumber=...
// @access public
const getProducts = asyncHandler(async (req,res) => {
    //console.log('process.env.STORE_FRANCHISE_ID =' + process.env.STORE_FRANCHISE_ID)
    //pagenation control
    const pageSize = 16
    const page = Number(req.query.pageNumber) || 1
    //search keyword
    const keyword = req.query.keyword ? { 
        name: {
            $regex : req.query.keyword,
            $options : 'i'
        }
    } : {}
    const category = req.query.category? { category: req.query.category} : {}
    var count
    if (category.category) count = await Product.countDocuments({...category, franchise: process.env.STORE_FRANCHISE_ID})
    else count = await Product.countDocuments({...keyword, franchise: process.env.STORE_FRANCHISE_ID})
    var products
    if (category.category) products = await Product.find({...category, franchise: process.env.STORE_FRANCHISE_ID}).limit(pageSize).skip(pageSize * (page - 1))
    else products = await Product.find({...keyword, franchise: process.env.STORE_FRANCHISE_ID}).limit(pageSize).skip(pageSize * (page - 1))
    //throw new Error('some error')
    
    res.json({products, page, pages: Math.ceil(count/pageSize)})

})
// @desc fetch single product
// @route /api/products/:id
// @access public
const getProductById = asyncHandler(async (req,res) => {
    
    const product = await Product.findById(req.params.id)

    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('product not found')
    }

})

// @desc delete single product
// @route /api/products/:id
// @access private/admin
const deleteProduct = asyncHandler(async (req,res) => {
    
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.remove()
        res.json({message: `product ${product.name} removed`})
    } else {
        res.status(404)
        throw new Error('product not found')
    }

})

// @desc create single product
// @route POST /api/products
// @access private/admin
const createProduct = asyncHandler(async (req,res) => {
    
    const product = new Product({
        franchise: process.env.STORE_FRANCHISE_ID,
        name: 'Sample name',
        price: 0,
        point: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'sample brand',
        category: 'sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'sample description'
    })
    console.log("franchise = "+ process.env.STORE_FRANCHISE_ID)
    const createdProduct = product.save()
    res.status(201).json(product)

})

// @desc update single product
// @route PUT /api/products/:id
// @access private/admin
const updateProduct = asyncHandler(async (req,res) => {
    
    const {name, price, point, description, image, brand, category, countInStock} = req.body

    const product = await Product.findById(req.params.id)
    
    if (product) {

        product.name = name
        product.price = price
        product.point = point
        product.description = description
        product.category = category
        product.brand= brand
        product.countInStock = countInStock
        product.image = image

        const updatedProduct = product.save()
        res.json(product)

    } else {
        res.status(404)
        throw new Error(`Product id ${req.params.id} not found`)
    }

    

})

// @desc create new review
// @route POST /api/products/:id/review
// @access private
const createProductReview = asyncHandler(async (req,res) => {
    
    const {rating, comment} = req.body

    const product = await Product.findById(req.params.id)
    
    if (product) {

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
    if (alreadyReviewed) {
        res.status(400)
        throw new Error('product already reviewed')
    }
    const review = {
        createdAt: Date.now(),
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
    }
    product.reviews.push(review)
    product.numReviews = product.reviews.length

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc , 0)
    / product.reviews.length

    await product.save()
    res.status(201).json({message: 'Review added'})
    } else {
        res.status(404)
        throw new Error(`Product id ${req.params.id} not found`)
    }

    

})

// @desc get top rated product
// @route POST /api/products/top
// @access public
const getTopProducts = asyncHandler(async (req,res) => {
    const products = await Product.find({franchise: process.env.STORE_FRANCHISE_ID}).sort({rating: -1}).limit(6)
    res.json(products)
})

// @desc get top categories under franchise
// @route POST /api/products/topcategories
// @access public
const getTopCategories = asyncHandler(async (req,res) => {
    const categories = await Category.find({parentCategoryId: process.env.STORE_FRANCHISE_ID})
    res.json(categories)
})
export {getTopCategories, getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts}