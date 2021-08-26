import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Button, Form} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUser } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { USER_UPDATE_RESET } from '../constants/userConstants'
import MaskedInput from 'react-text-mask'
const UserEditScreen = ({match, history}) => {

    const userId = match.params.id

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [totalPoint, setTotalPoint] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()
    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user} = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading:loadingUpdate, 
            error: errorUpdate, 
            success: successUpdate} = userUpdate


    useEffect(() => {
        if (successUpdate) {
            dispatch({
                type: USER_UPDATE_RESET
            })
            history.push('/admin/userlist')
        } else {
            if (!user.name || user._id !== userId){
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
                setPhone(user.phone)
                setTotalPoint(user.totalPoint)
            }
        }
       
        
    }, [dispatch, history, userId, user, successUpdate])
    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({ _id: userId, name, email, phone, totalPoint, isAdmin}))
        
    }
    
    return (
        <>
            <Link to='/admit/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

            {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message>
            : ( <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='phone'>
                    <Form.Label>Phone Number</Form.Label>
                    <MaskedInput
                        mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                        className="form-control"
                        placeholder="Enter a phone number"
                        guide={false}
                        id="my-phone-number"
                        value={phone}
                        //onBlur={() => {}}
                        onChange={(e) => {setPhone(e.target.value)}}
                    />
                </Form.Group>
                <Form.Group controlId='totalPoint'>
                    <Form.Label>Total Point</Form.Label>
                    <Form.Control
                        plaintext readOnly
                        value={totalPoint}
                        //onChange={(e) => setTotalPoint(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                    <Form.Group controlId='isAdmin'>
                        <Form.Check
                            type='checkbox'
                            label='Is Admin'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        ></Form.Check>
                    </Form.Group>
                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>)}
            
            </FormContainer>
        </>
        
    )
}

export default UserEditScreen
