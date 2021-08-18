import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({title, description, keywords}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            
        </Helmet>
    )
}
Meta.defaultProps={
    title: 'Welcome to Journey To  Good Health Cafe',
    description: 'We deliver health vegan food to community',
    keywords: 'Healing health foods, Vegan foods, vegetarian foods'
}
export default Meta
