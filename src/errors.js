export class HttpAccessError extends Error {
  constructor(message = "forbidden") {
    super(message)
  }
}
