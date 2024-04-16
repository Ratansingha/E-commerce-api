//Create access cookie

const setAccessTokenCookie = (res, accessToken) => {
    res.cookie('access_token', accessToken, {
        maxAge: 5 * 60 * 60 * 1000, //5 minutes
        httpOnly: true,
        sameSite: "none",
    });
};

//Refresh token cookie

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refresh_token', refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days
        httpOnly: true,
        sameSite: "none",
    });
};


module.exports = { setAccessTokenCookie, setRefreshTokenCookie };