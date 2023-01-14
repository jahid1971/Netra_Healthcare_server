import { Request, Response } from 'express'

const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Api Not Found for ${req.originalUrl}`,
  })
}

export default notFound