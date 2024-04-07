import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    const myToken = req.headers.authorization
    
    const token = myToken.split(' ')[1] || myToken

    if (!token) {
        return res.status(404).json({ error: 'you have not token try login or register again' })
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(404).json({ error: 'token is not found try login or register again' })
        }

        req.user = user

        next()
    })
}