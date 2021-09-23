import User from '../models/userModel.js'
import Franchise from '../models/franchiseModel.js'
import UserPoint from '../models/userPointModel.js'
import FranchisePoint from '../models/franchisePointModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'

// @desc franchise grant reward points to a user
// @route POST /api/users/grantpoints
// @access public
const grantPoints = asyncHandler(async (req,res) => {
    //transaction object from http post body
    const { franchiseId, type, userId, points } = req.body
    
    //check if user exist in point systyem
    const userExists = await User.findOne({_id: userId})

    if(!userExists) {

        res.status(400)
        throw new Error('User ' + userId + ' not exists')
    }
    // check if franchiseId exist in point system
    const franchiseExists = await Franchise.findOne({_id: franchiseId})

    if(!franchiseExists) {

        res.status(400)
        throw new Error('Franchise ' + franchiseId + ' not exists')
    }
    //find the franchise last grant transaction record
    const franchiseExistPoints = await FranchisePoint.find({franchiseId}).sort({_id:-1}).limit(1)
    console.log('franchiseExistPoints = '+ franchiseExistPoints)
    //console.log('totalGrantPoint = '+ franchiseExistPoints[0].totalGrantPoint)
    let totalFranchiseGrantPoint =  0
    let totalFranchiseRedemptionPoint =  0
    let franchiseBalancePoint =  0
    if (type === 'grant'){
        totalFranchiseGrantPoint = franchiseExistPoints.length === 1 ? Number(franchiseExistPoints[0].totalGrantPoint + points) : points,
        totalFranchiseRedemptionPoint= franchiseExistPoints.length === 1 ? Number(franchiseExistPoints[0].totalRedemptionPoint) : 0,
        franchiseBalancePoint= franchiseExistPoints.length === 1 ? Number(franchiseExistPoints[0].balancePoint) - points : 0 - points
    } else if (type === 'redemption'){
        totalFranchiseGrantPoint = franchiseExistPoints.length === 1 ? Number(franchiseExistPoints[0].totalGrantPoint) : 0,
        totalFranchiseRedemptionPoint= franchiseExistPoints.length === 1 ? Number(franchiseExistPoints[0].totalRedemptionPoint) + points : points,
        franchiseBalancePoint= franchiseExistPoints.length === 1 ? Number(franchiseExistPoints[0].balancePoint) + points : points
    }
    
    const franchisePoint = await FranchisePoint.create(
        { franchiseId, type, transactionAt: Date.now(), 
        transaction: {user: userId, points: points },
        totalGrantPoint: Number(totalFranchiseGrantPoint),
        totalRedemptionPoint: Number(totalFranchiseRedemptionPoint),
        balancePoint: Number(franchiseBalancePoint) }
    )

    //find the user last transaction record
    const userExistPoints = await UserPoint.find({userId}).sort({_id:-1}).limit(1)

    let totalGrantPoint = 0
    let totalRedemptionPoint = 0
    let balancePoint = 0
    if (type === 'grant'){
        totalGrantPoint = userExistPoints.length === 1 ? Number(userExistPoints[0].totalGrantPoint) + points : points,
        totalRedemptionPoint= userExistPoints.length === 1? Number(userExistPoints[0].totalRedemptionPoint) : 0,
        balancePoint= userExistPoints.length === 1 ? Number(userExistPoints[0].balancePoint) + points: points
    } else if (type === 'redemption'){
        totalGrantPoint = userExistPoints.length === 1 ? Number(userExistPoints[0].totalGrantPoint) : 0,
        totalRedemptionPoint= userExistPoints.length === 1 ? Number(userExistPoints[0].totalRedemptionPoint) + points : points,
        balancePoint= userExistPoints.length === 1 ? Number(userExistPoints[0].balancePoint) - points: 0 - points
    }


    const userPoint = await UserPoint.create(
        { userId, type, transactionAt: Date.now(), 
        transaction: {franchise: franchiseId, points: points },
        totalGrantPoint: Number(totalGrantPoint),totalRedemptionPoint: Number(totalRedemptionPoint),
        balancePoint: Number(balancePoint)}
    )

    if (franchisePoint && userPoint && type === 'grant') {
        res.status(201).json({
          
            franchise_grant_point_transaction_id: franchisePoint._id,
            franchise_transaction_type: franchisePoint.type,
            transactionAt: franchisePoint.transactionAt,
            franchise_grant_point: franchisePoint.transaction.points,
            franchise_balance_point: franchisePoint.balancePoint,
            franchise_grant_point_to_userId: franchisePoint.transaction.user,

            user_grant_point__transaction_id: userPoint._id,
            transaction_type: userPoint.type,   
            user_grant_point: userPoint.transaction.points,
            user_balance_point: userPoint.balancePoint
            
        })

    } else if (franchisePoint && userPoint && type === 'redemption') {
        res.status(201).json({
          
            franchise_redemption_point_transaction_id: franchisePoint._id,
            franchise_transaction_type: franchisePoint.type,
            transactionAt: franchisePoint.transactionAt,
            franchise_redemption_point: franchisePoint.transaction.points,
            franchise_balance_point: franchisePoint.balancePoint,
            franchise_redemption_point_to_userId: franchisePoint.transaction.user,

            user_redemption_point__transaction_id: userPoint._id,
            transaction_type: userPoint.type,   
            user_redemption_point: userPoint.transaction.points,
            user_balance_point: userPoint.balancePoint
            
        })

    } 
    
    else {
        res.status(400)
        throw new Error('Invalid grant user points data')
    }

})

export {grantPoints}