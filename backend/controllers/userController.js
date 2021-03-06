import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'

// @desc Auth user and get token
// @route POST /api/users/login
// @access public
const authUser = asyncHandler(async (req,res) => {
    
    const { email, password } = req.body
    
    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))) {

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            totalPoint: user.totalPoint,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }

})

// @desc Get user profile
// @route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id)
    
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            totalPoint: user.totalPoint,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('user not found')
    }

})

// @desc Get all users
// @route GET /api/users
// @access private/admin
const getUsers = asyncHandler(async (req,res) => {
    const users = await User.find()
    res.json(users)

})

// @desc Update user profile
// @route PUT /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id)
    
    if (user) {

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.phone = req.body.phone || user.phone
        user.totalPoint = req.body.totalPoint || user.totalPoint

        if (req.body.password) {
            user.password = req.body.password
        }
        const updateUser = await user.save()

        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            phone: updateUser.phone,
            totalPoint: updateUser.totalPoint,
            isAdmin: updateUser.isAdmin,
            token: generateToken(updateUser._id),
        })
    } else {
        res.status(404)
        throw new Error('user not found')
    }

})

// @desc Register a new user
// @route POST /api/users
// @access public
const registerUser = asyncHandler(async (req,res) => {
    
    const { name, email, phone, totalPoint, password } = req.body
    
    const userExists = await User.findOne({email})

    if(userExists) {

        res.status(400)
        throw new Error('User ' + email + ' already exists')
    }

    const user = await User.create(
        { franchise: process.env.STORE_FRANCHISE_ID, name, email, phone, totalPoint, password }
    )

    if (user) {
        res.status(201).json({
            _id: user._id,
            franchise: user.franchise,
            name: user.name,
            email: user.email,
            phone: user.phone,
            totalPoint : user.totalPoint,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })

    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})

// @desc Delete user
// @route DELETE /api/users/:id
// @access private/admin
const deleteUser = asyncHandler(async (req,res) => {
    console.log('id =' + req.params.id)
    const user = await User.findById(req.params.id)
    if (user) {
        await user.remove()
        res.json({ message: 'user ' + user.name + ' removed'})
    } else {
        res.status(404)
        throw new Error('User not found')
    }
    res.json(users)

})

// @desc Get user by id
// @route GET /api/users/:id
// @access private/admin
const getUserById = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
    

})

// @desc Update user
// @route PUT /api/users/:id
// @access private/admin
const updateUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id)
    
    if (user) {

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin || user.isAdmin
        user.phone = req.body.phone || user.phone
        user.totalPoint = req.body.totalPoint || user.totalPoint
        const updateUser = await user.save()

        res.json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            phone: updateUser.phone,
            totalPoint: updateUser.totalPoint,
            isAdmin: updateUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('user not found')
    }

})
export { authUser, getUserProfile, updateUserProfile, registerUser, getUsers, deleteUser, getUserById, updateUser}