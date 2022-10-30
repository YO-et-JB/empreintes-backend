/* eslint-disable no-console */
import multer from "multer"

const upload = multer()

const makeUploadRoutes = ({ app }) => {
  app.post(
    "/photographs/picture",
    upload.single("picture"),
    async (req, res) => {
      console.log(req.file)

      res.send("OK")
    }
  )
  app.post("books/picture", upload.array("picture", 5), async (req, res) => {
    console.log(req.file)

    res.send("OK")
  })
}

export default makeUploadRoutes
