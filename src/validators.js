/* eslint-disable no-useless-escape */
import * as yup from "yup"
import config from "../src/config.js"

//validate page
export const validateLimit = yup
  .number()
  .min(config.view.results.minLimit)
  .max(config.view.results.maxLimit)
  .integer()
  .default(config.view.results.defaultLimit)

export const validateOffset = yup.number().min(0).integer()

//validate users
export const validateId = yup.number().integer().min(1).label("User ID")

export const validateName = yup
  .string()
  .min(2)
  .max(15)
  .matches(
    /^[a-z][a-z0-9._]*/,
    "name must contain only letters, numbers, '.' and '_'"
  )
  .trim()
  .label("Name")

export const validateEmail = yup.string().email().trim().label("E-mail")

export const validatePhoneNumber = yup
  .string()
  .typeError("That doesn't look like a phone number")
  .min(10)
  .max(20)
  .matches(/(\+33\ )[1-9]{1}[0-9 ]{2}[0-9 ]{2}[0-9]{2}[0-9]{2}/, {
    message: "Invalid number",
    excludeEmptyString: false,
  })
  .required("A phone number is required")

export const validatePassword = yup
  .string()
  .min(8)
  .matches(/\W/, "Password must contain at least a special character")
  .label("Password")

export const validateAddress = yup
  .string()
  .min(1)
  .max(30)
  .matches(/^[a-z]/)
  .trim()
  .label("Address")

//validate roles
export const validateRole = yup
  .string()
  .min(1)
  .max(20)
  .trim()
  .matches(/[^\n\r\u00a0]/)
  .label("Role")

//validate generic
export const validateSearch = yup.string().min(3).label("Search terms")

export const validatePublishedAt = yup.date().label("Published at")

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"]
export const validateMedias = yup.object().shape({
  uriImage: yup
    .mixed()
    .nullable()
    .required("A file is required")
    .test(
      "file size",
      "upload file",
      (value) => !value || (value && value.size <= 1024 * 1024)
    )
    .test(
      "format",
      "upload file",
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))
    ),
})

//validate texts
export const validateContent = yup.string().min(1).label("Content")

export const validateTitle = validateContent.label("Title")
export const validateCommentContent = validateContent.label("Topic")
