import http from "./axios"

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData()

    formData.append("file", file)

    return http.post("/admin/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    })
  }

  getFiles(url) {
    return http.get(url)
  }
}

export default new UploadFilesService()
