import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "not authorized login again",
      });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    req.body = req.body || {};
    req.body.DocId = token_decode.id;

    next();
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};

export default authDoctor;
