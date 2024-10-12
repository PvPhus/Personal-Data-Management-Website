using BusinessLogicLayer.Interfaces;
using DataAccessLayer.Interfaces;
using DataModel;
using Microsoft.AspNetCore.Mvc;
using System.Text;


namespace API_PersonalDataManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileBusiness _fileBusiness;
        private readonly string _fileDirectory = "D:\\Personal Data Management Website\\Font_End\\pdm_reactjs\\public\\resources\\images"; // Thay thế bằng đường dẫn thật sự của bạn

        public FileController(IFileBusiness fileBusiness)
        {
            _fileBusiness = fileBusiness;
        }
        [HttpGet("get_all_files")]
        public IActionResult GetAllFile()
        {
            try
            {
                var files = _fileBusiness.GetAllFile();
                if (files == null)
                {
                    return NotFound("No files found for the data.");
                }
                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("get_files_by_user")]
        public IActionResult GetFilesByUser(int user_id)
        {
            try
            {
                var files = _fileBusiness.GetFilesByUserId(user_id);
                if (files == null)
                {
                    return NotFound("No files found for the specified user.");
                }
                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("get_all_file_by_user")]
        public IActionResult GetAllFilesByUserId(int user_id)
        {
            try
            {
                var video = _fileBusiness.GetAllFilesByUserId(user_id);
                if (video == null)
                {
                    return NotFound("No video found for the specified user.");
                }
                return Ok(video);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("get_videos_by_user")]
        public IActionResult GetVideosByUser(int user_id)
        {
            try
            {
                var video = _fileBusiness.GetVideosByUserId(user_id);
                if (video == null)
                {
                    return NotFound("No video found for the specified user.");
                }
                return Ok(video);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("get_images_by_user")]
        public IActionResult GetImagesByUser(int user_id)
        {
            try
            {
                var image = _fileBusiness.GetImagesByUserId(user_id);
                if (image == null)
                {
                    return NotFound("No image found for the specified user.");
                }
                return Ok(image);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("search_file_by_name")]
        public IActionResult SearchFile(int user_id, string filename_new)
        {
            try
            {
                var search = _fileBusiness.SearchFile(user_id, filename_new);
                if (search == null)
                {
                    return NotFound("No file found for the search file name.");
                }
                return Ok(search);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("get_file_by_fileId")]
        public IActionResult GetFileByFileId(int file_id)
        {
            try
            {
                var file = _fileBusiness.GetFileByFileId(file_id);
                if (file == null)
                {
                    return NotFound("No file found for the search file name.");
                }
                return Ok(file);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [NonAction]
        public string CreatePathFile(string RelativePathFileName)
        {
            try
            {
                string serverRootPathFolder = @"D:\Personal Data Management Website\Font_End\pdm_reactjs\public\resources";
                string fullPathFile = $@"{serverRootPathFolder}\{RelativePathFileName}";
                string fullPathFolder = System.IO.Path.GetDirectoryName(fullPathFile);
                if (!Directory.Exists(fullPathFolder))
                    Directory.CreateDirectory(fullPathFolder);
                return fullPathFile;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [Route("upload")]
        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            try
            {
                if (file.Length > 0)
                {
                    string filePath = $"images/{file.FileName}";
                    var fullPath = CreatePathFile(filePath);
                    using (var fileStream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }
                    return Ok(new { filePath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [Route("create-file")]
        [HttpPost]
        public IActionResult CreateItem([FromBody] FileModel model)
        {
            try
            {
                _fileBusiness.Create(model);
                return Ok(model); // Trả về kết quả thành công
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Trả về lỗi 500 nếu có lỗi xảy ra
            }
        }

        [HttpPut("update_name_file")]
        public IActionResult UpdateName([FromQuery] int file_id, [FromQuery] string filename_new)
        {
            try
            {
                _fileBusiness.UpdateName(file_id, filename_new);
                return Ok(new { FileId = file_id, NewFileName = filename_new });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [Route("delete-file/{file_id}")]
        [HttpDelete]
        public IActionResult DeleteItem(int file_id)
        {
            try
            {
                bool isDeleted = _fileBusiness.Delete(file_id);

                if (isDeleted)
                {
                    return Ok("File deleted successfully.");
                }
                else
                {
                    return NotFound("File not found or could not be deleted.");
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về lỗi 500 (Internal Server Error)
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(500, "An error occurred while deleting the file.");
            }
        }
        [Route("delete-groupdata/{file_id}")]
        [HttpDelete]
        public IActionResult DeleteFileGroup(int file_id, int group_id)
        {
            try
            {
                bool isDeleted = _fileBusiness.DeleteFileGroup(file_id,group_id);

                if (isDeleted)
                {
                    return Ok("File deleted successfully.");
                }
                else
                {
                    return NotFound("File not found or could not be deleted.");
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về lỗi 500 (Internal Server Error)
                Console.WriteLine("Error: " + ex.Message);
                return StatusCode(500, "An error occurred while deleting the file.");
            }
        }
        [HttpGet("download/{file_id}")]
        public IActionResult DownloadFile(int file_id)
        {
            try
            {
                // Lấy thông tin file từ file_id
                var fileInfo = _fileBusiness.GetFileByFileId(file_id);
                if (fileInfo == null)
                {
                    return NotFound("File not found.");
                }

                // Tạo đường dẫn tới file
                var filePath = Path.Combine(_fileDirectory, fileInfo.filename_old);

                // Kiểm tra xem file có tồn tại không
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("File not found.");
                }

                // Đọc nội dung của file thành byte array
                var bytes = System.IO.File.ReadAllBytes(filePath);

                // Xác định kiểu MIME của file
                var contentType = GetContentType(filePath);

                // Trả về file dưới dạng response
                return File(bytes, contentType, fileInfo.filename_new);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        [HttpGet("read/{file_id}")]
        public IActionResult ReadAndDecodeFile(int file_id)
        {
            try
            {
                // Lấy thông tin file từ file_id
                var fileInfo = _fileBusiness.GetFileByFileId(file_id); //GetFileByFileId là 1 api lấy thông tin của file bằng id
                if (fileInfo == null)
                {
                    return NotFound("File not found.");
                }

                // Tạo đường dẫn tới file
                var filePath = Path.Combine(_fileDirectory, fileInfo.filename_old);

                // Kiểm tra xem file có tồn tại không
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("File not found.");
                }

                // Đọc nội dung của file
                var fileContent = System.IO.File.ReadAllBytes(filePath);

                // Kiểm tra xem file có phải là loại dữ liệu văn bản hay không
                var contentType = GetContentType(filePath);
                if (!contentType.StartsWith("text/") && !contentType.Contains("json") && !contentType.Contains("xml"))
                {
                    // Nếu không phải là dữ liệu văn bản, thì giải mã dưới dạng base64
                    var base64String = Convert.ToBase64String(fileContent);
                    return Content(base64String, contentType);
                }

                // Giải mã dữ liệu nhị phân thành văn bản
                string decodedText = Encoding.UTF8.GetString(fileContent);

                // Trả về dữ liệu giải mã dưới dạng văn bản
                return Content(decodedText, contentType);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        //[HttpGet("read/{file_id}")]
        //public IActionResult ReadAndDecodeFile(int file_id)
        //{
        //    try
        //    {
        //        //Lấy thông tin file từ file_id
        //        var fileInfo = _fileBusiness.GetFileByFileId(file_id);
        //        if (fileInfo == null)
        //        {
        //            return NotFound("File not found.");
        //        }

        //        //Tạo đường dẫn tới file
        //        var filePath = Path.Combine(_fileDirectory, fileInfo.filename_old);

        //        //Kiểm tra xem file có tồn tại không
        //        if (!System.IO.File.Exists(filePath))
        //        {
        //            return NotFound("File not found.");
        //        }

        //        // Đọc nội dung của file
        //        var fileContent = System.IO.File.ReadAllBytes(filePath);

        //        //Giải mã dữ liệu nhị phân thành văn bản
        //        string decodedText;

        //        // Kiểm tra loại file và giải mã nếu cần
        //        var contentType = GetContentType(filePath);
        //        if (contentType == "application/pdf")
        //        {
        //            //Giải mã file PDF bằng iText7
        //            StringBuilder textBuilder = new StringBuilder();
        //            using (PdfReader reader = new PdfReader(new MemoryStream(fileContent)))
        //            using (PdfDocument pdfDocument = new PdfDocument(reader))
        //            {
        //                for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
        //                {
        //                    var page = pdfDocument.GetPage(i);
        //                    var strategy = new SimpleTextExtractionStrategy();
        //                    var text = PdfTextExtractor.GetTextFromPage(page, strategy);
        //                    textBuilder.Append(text);
        //                }
        //            }
        //            decodedText = textBuilder.ToString();
        //        }
        //        else if (contentType == "application/msword" || contentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        //        {
        //           // Giải mã file Word
        //            Aspose.Words.Document doc = new Aspose.Words.Document(filePath);
        //            decodedText = doc.GetText();
        //        }
        //        else if (contentType == "application/vnd.ms-excel" || contentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        //        {
        //           // Giải mã file Excel
        //            Spire.Xls.Workbook workbook = new Spire.Xls.Workbook();
        //            workbook.LoadFromFile(filePath);
        //            StringBuilder textBuilder = new StringBuilder();
        //            foreach (Spire.Xls.Worksheet sheet in workbook.Worksheets)
        //            {
        //                for (int r = 1; r <= sheet.LastRow; r++)
        //                {
        //                    for (int c = 1; c <= sheet.LastColumn; c++)
        //                    {
        //                        textBuilder.Append(sheet.Range[r, c].Text);
        //                        textBuilder.Append("\t");
        //                    }
        //                    textBuilder.AppendLine();
        //                }
        //            }
        //            decodedText = textBuilder.ToString();
        //        }
        //        else if (contentType.StartsWith("text/") || contentType.Contains("json") || contentType.Contains("xml"))
        //        {
        //            //Đối với file văn bản(như.txt, .json, .xml), không cần giải mã, đọc trực tiếp nội dung
        //            decodedText = Encoding.UTF8.GetString(fileContent);
        //        }
        //        else
        //        {
        //            //Nếu không phải là loại file có thể giải mã, trả về nội dung dưới dạng base64
        //            var base64String = Convert.ToBase64String(fileContent);
        //            return Content(base64String, contentType);
        //        }

        //        //Trả về dữ liệu giải mã dưới dạng văn bản
        //        return Content(decodedText, contentType);
        //    }
        //    catch (Exception ex)
        //    {
        //        //Xử lý lỗi nếu có
        //        return StatusCode(500, "Internal server error: " + ex.Message);
        //    }
        //}
        private string GetContentType(string fileType)
        {
            var types = new Dictionary<string, string>
            {
                {"txt", "text/plain"},
                {"pdf", "application/pdf"},
                {"doc", "application/msword"},
                {"docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
                {"xls", "application/vnd.ms-excel"},
                {"xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {"png", "image/png"},
                {"jpg", "image/jpeg"},
                {"jpeg", "image/jpeg"},
                {"gif", "image/gif"},
                {"csv", "text/csv"},
                {"bmp", "image/bmp"},
                {"tiff", "image/tiff"},
                {"svg", "image/svg+xml"}
            };
            return types.ContainsKey(fileType.ToLowerInvariant()) ? types[fileType.ToLowerInvariant()] : "application/octet-stream";
        }
        [Route("share_file_group")]
        [HttpPost]
        public IActionResult ShareFileGroup([FromBody] ShareFileGroupModel model)
        {
            try
            {
                if (model == null || model.group_id == null || !model.group_id.Any())
                {
                    return BadRequest("Invalid data.");
                }

                bool isShared = _fileBusiness.ShareFileGroup(model);
                if (isShared)
                {
                    return Ok("File shared successfully.");
                }
                else
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Trả về lỗi 500 nếu có lỗi xảy ra
            }
        }
        [Route("share_file_friend")]
        [HttpPost]
        public IActionResult ShareFileFriend([FromBody] ShareFileFriendModel model)
        {
            try
            {
                if (model == null || model.receiver_id == null || !model.receiver_id.Any())
                {
                    return BadRequest("Invalid data.");
                }

                bool isShared = _fileBusiness.ShareFileFriend(model);
                if (isShared)
                {
                    return Ok("File shared successfully.");
                }
                else
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Trả về lỗi 500 nếu có lỗi xảy ra
            }
        }
    }
}
