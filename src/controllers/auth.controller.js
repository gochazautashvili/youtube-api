import authModule from '../models/auth.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const Register = async (req, res) => {
    const { gmail, name, password, image } = req.body

    if (!gmail | !name | !password) {
        return res.status(400).json({ error: 'All input is required' })
    }

    const user = await authModule.findOne({ gmail })

    if (user) {
        return res.status(400).json({ error: 'This gmail already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await authModule.create({ gmail, name, password: hashedPassword, image })

    const token = await jwt.sign({ id: newUser._id }, process.env.SECRET)

    res.status(201).json({ newUser, token })
}

export const Login = async (req, res) => {
    const { gmail, password } = req.body

    if (!gmail || !password) {
        return res.status(400).json({ error: 'All input is required' })
    }

    const newUser = await authModule.findOne({ gmail })

    if (!newUser) {
        return res.status(400).json({ error: 'user is not find' })
    }

    const hashedPassword = await bcrypt.compare(password, newUser.password)

    if (!hashedPassword) {
        return res.status(400).json({ error: 'password is wrong' })
    }

    const token = jwt.sign({ id: newUser._id }, process.env.SECRET)

    res.status(200).json({ newUser, token })
}


export const channel = async (req, res) => {
    try {
        const newUser = await authModule.findById({ _id: req.query.id })
        const token = await jwt.sign({ id: req.query.id }, process.env.SECRET)


        res.status(200).json({ newUser, token })
    } catch (error) {
        res.status(400).json(error)
    }
}
