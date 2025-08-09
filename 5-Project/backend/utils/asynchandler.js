const asyncHandler = (asyncHandler) => async (req, res, next) => {
  try {
    await asyncHandler(req, res, next)
    res.status(200).json({success: true, message: 'Successful'})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}

export  { asyncHandler }