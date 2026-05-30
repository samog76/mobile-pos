import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-secret'

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}

export function auth(requiredRole) {
  return (req, res, next) => {
    const header = req.headers.authorization || ''
    const token = header.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'missing token' })
    try {
      const user = jwt.verify(token, SECRET)
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ error: 'forbidden' })
      }
      req.user = user
      next()
    } catch {
      return res.status(401).json({ error: 'invalid token' })
    }
  }
}
