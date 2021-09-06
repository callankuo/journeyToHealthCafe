import bcrypt from 'bcryptjs'

const users = [
    {   
        name: 'Journey Admin user',
        email: 'callankuo@yahoo.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin: true
    },
    {   
        name: 'Super Bell Admin user',
        email: 'lohuang@yahoo.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin: true
    },
    {
        name: 'Journey cs',
        email: 'journeycs1@yahoo.com',
        password: bcrypt.hashSync('123456',10)
    },
    {
        name: 'super bell cs',
        email: 'superbellcs1@yahoo.com',
        password: bcrypt.hashSync('123456',10)
    }


]

export default users