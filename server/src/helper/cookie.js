const setAccessTokenCookie = (res,accessToken)=>{
    res.cookie("accessToken", accessToken, {
        maxAge: 5 * 60 * 1000, //5 minitue only
        httpOnly: true,
        // secure: true,
        sameSite: "none",
      });
}


const setRefreshTokenCookie = (res,refreshToken)=>{
    res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days only
        httpOnly: true,
        // secure: true,
        sameSite: "none",
      });
}



module.exports ={setAccessTokenCookie, setRefreshTokenCookie}