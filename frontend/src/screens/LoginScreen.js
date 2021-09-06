import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, Button, Form} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { GUEST_ACCOUNT_ID, GUEST_ACCOUNT_PASSWORD, REGISTER_EARN_POINT } from '../constants/configConstants'

const LoginScreen = ({location, history}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo} = userLogin


    const redirect = location.search ? location.search.split('=')[1] : '/'
    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history,userInfo, redirect])
    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email,password))

    }

    const guestCheckout = () => {
        dispatch(login(GUEST_ACCOUNT_ID,GUEST_ACCOUNT_PASSWORD))

    }
    
    return (
        <FormContainer>
            <h1>Sign In</h1><h3 style={{ color: 'green' }}>{' '} to earn <i class="fas fa-coins"></i> <i class="fas fa-coins"></i>{' '} every dollar you spent</h3>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <Button type='submit' variant='success'>
                    Sign In
                </Button>
            </Form>
            <Row className='py-3'>
                <Col style={{ color: 'red' }}>
                    New customer? {' '}
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                         <i class="far fa-registered"></i>Register Here
                    </Link>
                    {' '} To earn <i class="fas fa-coins"></i> {' ' + REGISTER_EARN_POINT} points to your Vegan Member account!
                </Col>
            </Row>
            <Row>
                <Col> Or {' '}
                    <Button type='button' variant='success' onClick={guestCheckout}>
                    Guest checkout
                    </Button> 
                    {' '} without earning any points
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
