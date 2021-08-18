import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin user',
        email: 'callankuo@yahoo.com',
        password: bcrypt.hashSync('123456',10),
        isAdmin: true
    },
    {
        name: 'John Doe',
        email: 'johndoe@yahoo.com',
        password: bcrypt.hashSync('123456',10)
    },
    {
        name: 'Jane Doe',
        email: 'janedoe@yahoo.com',
        password: bcrypt.hashSync('123456',10)
    }


]

export default users