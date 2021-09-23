import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, Button, Form} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { register, pointRegister } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { REGISTER_EARN_POINT, STORE_FRANCHISE_ID} from '../constants/configConstants'
import MaskedInput from 'react-text-mask'
import { USER_POINT_REGISTER_RESET } from '../constants/userConstants'
const RegisterScreen = ({location, history}) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const totalPoint = REGISTER_EARN_POINT
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()
    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo} = userRegister

    const userPointRegister = useSelector(state => state.userPointRegister)
    const { loading: loadingPoint, error: errorPoint, userPointInfo} = userPointRegister


    const redirect = location.search ? location.search.split('=')[1] : '/'
    useEffect(() => {
        if (userInfo && !userPointInfo) {
            console.log('process point')
            dispatch(pointRegister(STORE_FRANCHISE_ID, 'grant', userInfo._id, REGISTER_EARN_POINT))
        } else if (userInfo && userPointInfo) {
            dispatch({type: USER_POINT_REGISTER_RESET})
            history.push(redirect)
        }
    }, [history, userInfo, userPointInfo, dispatch, redirect])
    
    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(register(name, email, phone, totalPoint, password))
            
        }
        

    }
    
    return (
        <FormContainer>
            <h1>Sign Up</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
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
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmPassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Register
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    Have an account ? {' '}
                    <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                        Login
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen
