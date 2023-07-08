const { MSG_TYPES } = require("../constants/types");

function JsonResponse(res, status, message, data = null, meta = null) {
  const body = {
    message: "",
    data: null,
    meta: {
      total: 1,
      pagination: {
        pageSize: 1,
        page: 1,
        // currentPage: 1,
      },
    },
  };

  if (data || data == 0) {
    body.data = data;
  }
  if (meta) {
    body.meta = meta;
  } else {
    delete body.meta;
  }
  
  if (typeof message === "string") {
    const data = MSG_TYPES[message];
    if (typeof data !== "undefined") {
      body.message = MSG_ERRORS[message];
    } else {
      body.message = message;
    }
  }
  res.status(status).send(body);
  return;
}

module.exports = {
  JsonResponse
};
