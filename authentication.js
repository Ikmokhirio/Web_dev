const authorizedUsername = 'admin';
const {
    HttpError,
    FORBIDDEN,
    NOT_FOUND,
    BAD_REQUEST,
    UNAUTHORIZED
} = require("./HTTP_Error");

function authenticationCheck(req, res, next) { // Authentication
    let username = req.query.username;

    if (username === undefined) {
        throw new HttpError(FORBIDDEN, 'You don\'t have access to this page');
    }
    if (username.toLowerCase() !== authorizedUsername) {
        throw new HttpError(UNAUTHORIZED, 'You should authorize to access this page');
    }

    next();
}

exports.authenticationCheck = authenticationCheck