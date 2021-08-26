import React from 'react'
import {Link} from 'react-router-dom'
import { Card, Row} from 'react-bootstrap'
import Rating from './Rating'

function Product( {product}) {
    const styles = {
        card: {
          backgroundColor: 'rgb(231, 236, 231)',
          borderRadius: 55,
          padding: '1rem'
        },
        cardImage: {
          objectFit: 'cover',
          borderRadius: 55,
          width: '100%',
          
          height: '20vw'
        }
      }
    return (
        <Card className="m-10 border-0 shadow" style={styles.card}>
            <Row>
            <Link to={`/product/${product._id}`}>
            <Card.Img src={product.image} variant='top' style={styles.cardImage} />
            </Link>
            </Row>
            <Row>
            <Card.Body>
            <Link top={`/product/${product._id}`}>
                <Card.Title as='div' >
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>
                <Card.Text as='div'>
                    <Rating 
                        value = {product.rating}
                        text = {`${product.numReviews} reviews`}
                        
                    />
                </Card.Text>
                <Card.Text as='h3'>${product.price} Or P({product.point})</Card.Text>
            </Card.Body>
            </Row>
        </Card>
       
    )
}

export default Product
