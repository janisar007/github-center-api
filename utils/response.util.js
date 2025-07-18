export function responseData(res, ErrorCode, message, status, resData=[]) {
    return res.status(ErrorCode).json({
      message: message,
      status: status,
      code: ErrorCode,
      data: resData,
    });
}