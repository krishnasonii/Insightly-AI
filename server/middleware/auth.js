const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        
        const authHeader = req.header('Authorization');
        let token = req.header('x-auth-token');

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                msg: 'No token, authorization denied',
                code: 'AUTH_REQUIRED'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret'
        );

        req.user = decoded.user;
        return next();

    } catch (err) {
        console.error('Auth middleware error:', err.message);
        return res.status(401).json({
            msg: 'Token is not valid or has expired',
            code: 'INVALID_TOKEN'
        });
    }
};
