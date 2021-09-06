import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import franchises from './data/franchises.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'
import Franchise from './models/franchiseModel.js'

dotenv.config()

await connectDB()

const importData = async () => {
    try {
        console.log('delete existing data...')
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()
        await Franchise.deleteMany()
        console.log('delete existing data completed')

        const createFranchise = await Franchise.insertMany(franchises)
        console.log('createFranchise completed')
        console.log('createFranchise[0] ='+createFranchise[0])
        const journey = createFranchise[0]._id
        const superBell = createFranchise[1]._id

        const sampleUsers = users.map((user, index) =>{
            if (index === 0) {
            return {
                ...user, franchise: journey
            }}
            if (index === 1) {
                return {
                    ...user, franchise: superBell
            }}
            if (index === 2) {
                return {
                    ...user, franchise: journey
            }}
            if (index === 3) {
                    return {
                    ...user, franchise: superBell
            }}

        })

        const createUser = await User.insertMany(sampleUsers)
        console.log('createUser completed')
        console.log('createUser[0] ='+createUser[0])
        const journeyAdminUser = createUser[0]._id
        console.log('adminUser completed')
        const sampleProducts = products.map(product =>{
            return {
                ...product, franchise: journey, user: journeyAdminUser
            }
        })

        await Product.insertMany(sampleProducts)

        console.log('Data import completed'.green.inverse)

        process.exit()



    } catch(error){

        console.error(`${error}`)
        process.exit(1)

    }

}

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Destroy completed'.red.inverse)

        process.exit()



    } catch(error){

        console.error(`${error}`.red.inverse)
        process.exit(1)

    }

}

if (process.argv[2] === '-d'){
    destroyData()
} else {
    importData()
}