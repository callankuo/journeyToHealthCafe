import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'



const SearchBox = ({history}) => {
    
    const [keyword, setKeyword] = useState('')

    const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
        history.push(`/search/${keyword}`)
    } else {
        history.push('/')
    }

}
    return (
        <Form onSubmit={submitHandler} >
            <Row sm='10'>
            
            <Col sm='8' className='px-0'>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='Search Products'
                className='mr-sm-2 ml-sm-5'
            ></Form.Control>
            </Col>
            <Col sm='2' className='px-0'>
            <Button type='submit' variant='link' className='p-3'>
            <i class="fa fa-search-plus fa-lg" aria-hidden="true"></i>
            </Button>
            </Col>
            
            </Row>
        </Form>
            
       
    )
}


export default SearchBox
