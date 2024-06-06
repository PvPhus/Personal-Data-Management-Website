CREATE DATABASE PersonalDataManagement
GO

USE PersonalDataManagement
GO

-- Bảng Người dùng (Users)
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY,
    username NVARCHAR(255),
    email NVARCHAR(255),
	password NVARCHAR(255),
	role NVARCHAR(50),
    avatar_url NVARCHAR(MAX),
    join_date DATETIME
);

-- Bảng Tệp (Files)
CREATE TABLE Files (
    file_id INT PRIMARY KEY IDENTITY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    filename_old NVARCHAR(255),
	filename_new NVARCHAR(255),
    file_size FLOAT,
    file_type NVARCHAR(50),
    upload_date DATETIME,
    last_modified DATETIME,
    file_path NVARCHAR(MAX)
);

select*from files;
delete from files where file_id=1;

-- Bảng Thư mục (Folders)
CREATE TABLE Folders (
    folder_id INT PRIMARY KEY IDENTITY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    folder_name NVARCHAR(255),
    parent_folder_id INT FOREIGN KEY REFERENCES Folders(folder_id),
    creation_date DATETIME
);

-- Bảng Quyền truy cập (Permissions)
CREATE TABLE Permissions (
	permission_id INT PRIMARY KEY IDENTITY,
	user_id INT FOREIGN KEY REFERENCES Users(user_id),
	can_read BIT,
	can_download BIT,
	can_share BIT,
	can_delete BIT
);

-- Bảng Nhóm (Groups)
CREATE TABLE Groups (
    group_id INT PRIMARY KEY IDENTITY,
	group_image NVARCHAR(255),
    group_name NVARCHAR(255),
    user_id INT, -- ID của người tạo nhóm
    created_date DATETIME, -- Ngày tạo nhóm
	total_members INT,
    CONSTRAINT FK_Creator_User FOREIGN KEY (user_id) REFERENCES Users(user_id) -- Khóa ngoại tham chiếu đến bảng Users
);



--SELECT TOP(3) * FROM Groups WHERE user_id = @user_id and max(total_members);

delete from groups where group_id=3; 
select * from GroupMembers;


CREATE TABLE GroupRequests (
    request_id INT PRIMARY KEY IDENTITY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    request_date DATETIME NOT NULL,
    CONSTRAINT FK_GroupRequests_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_GroupRequests_Groups FOREIGN KEY (group_id) REFERENCES Groups(group_id)
);
select * from GroupRequests;
select * from users;
INSERT INTO GroupRequests (user_id, group_id, request_date)
VALUES 
(23, 10, '2023-01-01 08:00:00'),
(24, 10, '2023-01-01 08:00:00'),
(22, 10, '2023-01-01 08:00:00'),
(21, 10, '2023-01-01 08:00:00');

-- Bảng dữ liệu của nhóm (GroupData)
CREATE TABLE GroupData (
    file_id INT,
    group_id INT,
	user_id INT,
    upload_date DATETIME,
	CONSTRAINT FK_GroupData_Files FOREIGN KEY (file_id) REFERENCES Files(file_id),
    CONSTRAINT FK_GroupData_Group FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    CONSTRAINT FK_GroupData_User FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
select*from GroupData;
--INSERT INTO GroupData (group_id, data_name, data_description, uploaded_by_user_id, upload_date)
--SELECT @group_id, filename, 'Mô tả dữ liệu', @uploaded_by_user_id, GETDATE() -- Thêm dữ liệu vào bảng GroupData
--FROM Files
--WHERE file_id = @file_id; -- Điều kiện để chọn tệp cụ thể từ bảng Files


-- Bảng Thành viên nhóm (GroupMembers)
CREATE TABLE GroupMembers (
    group_id INT,
    user_id INT,
    permission_id INT,
	join_date DATETIME,
    CONSTRAINT PK_GroupMembers PRIMARY KEY (group_id, user_id),
    CONSTRAINT FK_GroupMembers_Group FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    CONSTRAINT FK_GroupMembers_User FOREIGN KEY (user_id) REFERENCES Users(user_id),
	CONSTRAINT FK_GroupMembers_Permissions FOREIGN KEY (permission_id) REFERENCES Permissions(permission_id)
);
-- Bảng Liên kết Thư mục-Tệp (FolderFiles)
CREATE TABLE FolderFiles (
    folder_id INT FOREIGN KEY REFERENCES Folders(folder_id),
    file_id INT FOREIGN KEY REFERENCES Files(file_id),
    PRIMARY KEY (folder_id, file_id)
);

-- Bảng Thẻ (Tags)
CREATE TABLE Tags (
    tag_id INT PRIMARY KEY IDENTITY,
    tag_name NVARCHAR(255)
);

-- Bảng Liên kết Tệp-Thẻ (FileTags)
CREATE TABLE FileTags (
    file_id INT FOREIGN KEY REFERENCES Files(file_id),
    tag_id INT FOREIGN KEY REFERENCES Tags(tag_id),
    PRIMARY KEY (file_id, tag_id)
);

-- Bảng Phiên bản Tệp (FileVersions)
CREATE TABLE FileVersions (
    version_id INT PRIMARY KEY IDENTITY,
    file_id INT FOREIGN KEY REFERENCES Files(file_id),
    version_number INT,
    upload_date DATETIME,
    file_path NVARCHAR(MAX)
);

-- Bảng Lịch sử hoạt động (Activity Log)
CREATE TABLE ActivityLog (
    log_id INT PRIMARY KEY IDENTITY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    description NVARCHAR(MAX),
	time_log DATETIME,
	time_out DATETIME
);

INSERT INTO Users (username, email, password, role, avatar_url, join_date)
VALUES
('admin', 'admin@email.com', CONVERT(NVARCHAR(255), HASHBYTES('SHA2_256', 'password1'), 2), 'Admin', 'avatar-1.jfif', '2024-01-01 08:00:00'),
('Vũ Phong Phú', 'user1@email.com', CONVERT(NVARCHAR(255), HASHBYTES('SHA2_256', 'password1'), 2), 'KhachHang', 'avatar-2.jfif', '2024-01-01 08:00:00'),
('Vũ Văn Tân', 'user2@email.com', CONVERT(NVARCHAR(255), HASHBYTES('SHA2_256', 'password1'), 2), 'KhachHang', 'avatar-3.jfif', '2024-01-01 08:00:00');


select * from users;

INSERT INTO Files (user_id, filename_old, filename_new, file_size, file_type, upload_date, last_modified, file_path)
VALUES 
(22, 'New Text Document.txt',N'test', 10240, 'txt', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'text test'),
(22, 'BaoCaoUML.doc', N'Báo cáo UML', 1024, 'doc', '2023-01-01 08:00:00', '2023-01-01 08:00:00', 'BaoCaoUML.doc'),
(22, 'BaoCaoUML.pdf',N'Báo cáo UML', 2048, 'pdf', '2023-01-02 09:00:00', '2023-01-02 09:00:00', 'BaoCaoUML.pdf'),
(22, 'decoded_TA1.docx',N'Tiếng anh 1', 3072, 'docx', '2023-01-03 10:00:00', '2023-01-03 10:00:00', 'decoded_TA1.docx'),
(22, N'Đề 10_Vũ Phong Phú.mp4',N'Video tiếng anh', 4096, 'mp4', '2023-01-04 11:00:00', '2023-01-04 11:00:00', N'Đề 10_Vũ Phong Phú.mp4'),
(22, 'TA1.docx',N'Tiếng anh 1', 5120, 'docx', '2023-01-05 12:00:00', '2023-01-05 12:00:00', 'TA1.docx'),
(22, 'TA2.docx',N'Tiếng anh 2', 6144, 'docx', '2023-01-06 13:00:00', '2023-01-06 13:00:00', 'TA2.docx'),
(22, 'WebAPI.docx',N'web api', 7168, 'docx', '2023-01-07 14:00:00', '2023-01-07 14:00:00', 'WebAPI.docx'),
(22, 'WebAPI.pdf',N'web api', 8192, 'pdf', '2023-01-08 15:00:00', '2023-01-08 15:00:00', 'WebAPI.pdf'),
(22, 'thungdunglego.webp',N'Thùng đựng lê gô', 10240, 'webp', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'thungdunglego.webp'),
(22, 'thungdunggaothongminh.webp',N'Thùng đựng gạo thông minh', 10240, 'webp', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'thungdunggaothongminh.webp'),
(22, 'thunggaothongminh.webp',N'Thùng đựng gạo', 10240, 'webp', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'thunggaothongminh.webp'),
(22, 'thungracdanang2tang3tang.webp',N'Thùng rác', 10240, 'webp', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'thungracdanang2tang3tang.webp'),
(22, 'thungractreocanhtubep.webp',N'Thùng rác', 10240, 'webp', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'thungractreocanhtubep.webp'),
(22, 'NewTextDocument.txt',N'test', 10240, 'txt', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'text test'),
(22, 'trangtrinhacua.webp',N'Trang trí nhà', 10240, 'webp', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'trangtrinhacua.webp');
select * from files;

INSERT INTO Folders (user_id, folder_name, parent_folder_id, creation_date)
VALUES 
(1, 'Folder 1', NULL, '2023-01-01 08:00:00'),
(2, 'Folder 2', NULL, '2023-01-02 09:00:00'),
(3, 'Folder 3', NULL, '2023-01-03 10:00:00'),
(4, 'Folder 4', NULL, '2023-01-04 11:00:00'),
(5, 'Folder 5', NULL, '2023-01-05 12:00:00'),
(6, 'Folder 6', NULL, '2023-01-06 13:00:00'),
(7, 'Folder 7', NULL, '2023-01-07 14:00:00'),
(8, 'Folder 8', NULL, '2023-01-08 15:00:00'),
(9, 'Folder 9', NULL, '2023-01-09 16:00:00'),
(10, 'Folder 10', NULL, '2023-01-10 17:00:00');


INSERT INTO Permissions (user_id, file_id, can_read, can_write, can_share)
VALUES 
(1, 11, 1, 0, 1),
(2, 2, 1, 1, 0),
(3, 3, 0, 1, 1),
(4, 4, 1, 0, 0),
(5, 5, 1, 1, 1),
(6, 6, 0, 0, 1),
(7, 7, 1, 1, 1),
(8, 8, 0, 0, 0),
(9, 9, 1, 1, 1),
(10, 10, 0, 1, 0);

INSERT INTO Groups (group_image, group_name, user_id, created_date, total_members)
VALUES 
('group1.jpg',N'MeMe j97', 22, '2023-01-01 08:00:00', 5),
('group2.jpg',N'Anh em cây khế', 22, '2023-01-02 09:00:00', 3),
('group3.htm',N'3 chị em', 22, '2023-01-03 10:00:00', 7),
('group4.jpg',N'Nhóm hội chợ', 22, '2023-01-04 11:00:00', 4);

select*from groups;

INSERT INTO GroupData (file_id, group_id, user_id, upload_date)
VALUES 
(11, 1, 1, '2023-01-01 08:00:00'),
(2, 2, 2, '2023-01-02 09:00:00'),
(3, 3, 3, '2023-01-03 10:00:00'),
(4, 4, 4, '2023-01-04 11:00:00'),
(5, 5, 5, '2023-01-05 12:00:00'),
(6, 6, 6, '2023-01-06 13:00:00'),
(7, 7, 7, '2023-01-07 14:00:00'),
(8, 8, 8, '2023-01-08 15:00:00'),
(9, 9, 9, '2023-01-09 16:00:00'),
(10, 10, 10, '2023-01-10 17:00:00');

INSERT INTO GroupMembers (group_id, user_id, permission_id)
VALUES 
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 6),
(7, 7, 7),
(8, 8, 8),
(9, 9, 9),
(10, 10, 10);

INSERT INTO FolderFiles (folder_id, file_id)
VALUES 
(1, 11),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

INSERT INTO Tags (tag_name)
VALUES 
('Important'),
('Work'),
('Personal'),
('Finance'),
('Travel'),
('Education'),
('Health'),
('Entertainment'),
('Family'),
('Technology');

INSERT INTO FileTags (file_id, tag_id)
VALUES 
(11, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

INSERT INTO FileVersions (file_id, version_number, upload_date, file_path)
VALUES 
(11, 1, '2023-01-01 08:00:00','BaoCaoUML.doc'),
(2, 1, '2023-01-02 09:00:00', 'BaoCaoUML.pdf'),
(3, 1, '2023-01-03 10:00:00', 'decoded_TA1.docx'),
(4, 1, '2023-01-04 11:00:00', 'Đề 10_Vũ Phong Phú.mp4'),
(5, 1, '2023-01-05 12:00:00','TA1.docx'),
(6, 1, '2023-01-06 13:00:00','TA2.docx'),
(7, 1, '2023-01-07 14:00:00', 'WebAPI.docx'),
(8, 1, '2023-01-08 15:00:00', 'WebAPI.pdf'),
(9, 1, '2023-01-09 16:00:00', 'file9.txt'),
(10, 1, '2023-01-10 17:00:00', 'file10.txt');


INSERT INTO ActivityLog (user_id, description, time_log, time_out)
VALUES 
(1, N'User 1 logged in.', '2023-01-01 08:00:00', '2023-01-01 09:00:00'),
(2, N'User 2 logged in.', '2023-01-01 09:00:00', '2023-01-01 10:00:00'),
(3, N'User 3 logged in.', '2023-01-01 10:00:00', '2023-01-01 11:00:00'),
(4, N'User 4 logged in.', '2023-01-01 11:00:00', '2023-01-01 12:00:00'),
(5, N'User 5 logged in.', '2023-01-01 12:00:00', '2023-01-01 13:00:00'),
(6, N'User 6 logged in.', '2023-01-01 13:00:00', '2023-01-01 14:00:00'),
(7, N'User 7 logged in.', '2023-01-01 14:00:00', '2023-01-01 15:00:00'),
(8, N'User 8 logged in.', '2023-01-01 15:00:00', '2023-01-01 16:00:00'),
(9, N'User 9 logged in.', '2023-01-01 16:00:00', '2023-01-01 17:00:00'),
(10, N'User 10 logged in.', '2023-01-01 17:00:00', '2023-01-01 18:00:00'),
(1, N'User 1 logged out.', '2023-01-01 18:00:00', '2023-01-01 19:00:00'),
(2, N'User 2 logged out.', '2023-01-01 19:00:00', '2023-01-01 20:00:00'),
(3, N'User 3 logged out.', '2023-01-01 20:00:00', '2023-01-01 21:00:00'),
(4, N'User 4 logged out.', '2023-01-01 21:00:00', '2023-01-01 22:00:00'),
(5, N'User 5 logged out.', '2023-01-01 22:00:00', '2023-01-01 23:00:00'),
(6, N'User 6 logged out.', '2023-01-01 23:00:00', '2023-01-02 00:00:00'),
(7, N'User 7 logged out.', '2023-01-02 00:00:00', '2023-01-02 01:00:00'),
(8, N'User 8 logged out.', '2023-01-02 01:00:00', '2023-01-02 02:00:00'),
(9, N'User 9 logged out.', '2023-01-02 02:00:00', '2023-01-02 03:00:00'),
(10, N'User 10 logged out.', '2023-01-02 03:00:00', '2023-01-02 04:00:00'),
(1, N'User 1 logged in.', '2023-01-02 04:00:00', '2023-01-02 05:00:00'),
(2, N'User 2 logged in.', '2023-01-02 05:00:00', '2023-01-02 06:00:00'),
(3, N'User 3 logged in.', '2023-01-02 06:00:00', '2023-01-02 07:00:00'),
(4, N'User 4 logged in.', '2023-01-02 07:00:00', '2023-01-02 08:00:00'),
(5, N'User 5 logged in.', '2023-01-02 08:00:00', '2023-01-02 09:00:00'),
(6, N'User 6 logged in.', '2023-01-02 09:00:00', '2023-01-02 10:00:00'),
(7, N'User 7 logged in.', '2023-01-02 10:00:00', '2023-01-02 11:00:00'),
(8, N'User 8 logged in.', '2023-01-02 11:00:00', '2023-01-02 12:00:00'),
(9, N'User 9 logged in.', '2023-01-02 12:00:00', '2023-01-02 13:00:00'),
(10, N'User 10 logged in.', '2023-01-02 13:00:00', '2023-01-02 14:00:00');

select * from files;
select * from folders;
select * from Groups;
select * from users;
select * from permissions;

delete from users;
delete from files;
delete from users;

drop table files;
drop table folders;
--==========================================PROCEDURE===================================--
	--Đăng nhập
CREATE PROCEDURE sp_login
    @inputEmail NVARCHAR(255),
    @inputPassword NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UserID INT;
    DECLARE @Username NVARCHAR(255);
    DECLARE @Role NVARCHAR(50);
    DECLARE @AvatarUrl NVARCHAR(MAX);
    DECLARE @JoinDate DATETIME;

    -- Tìm kiếm người dùng bằng email
    SELECT
        @UserID = user_id,
        @Username = username,
        @Role = role,
        @AvatarUrl = avatar_url,
        @JoinDate = join_date
    FROM
        Users
    WHERE
        email = @inputEmail;

    -- Kiểm tra xem người dùng có tồn tại không
    IF @UserID IS NOT NULL
    BEGIN
        -- Lấy mật khẩu băm từ cơ sở dữ liệu
        DECLARE @StoredHash NVARCHAR(255);
        SELECT @StoredHash = password FROM Users WHERE user_id = @UserID;

        -- Băm mật khẩu nhập vào để so sánh
        DECLARE @InputHash NVARCHAR(255);
        SET @InputHash = CONVERT(NVARCHAR(64), HASHBYTES('SHA2_256', @inputPassword), 2);

        -- Kiểm tra mật khẩu
        IF @StoredHash = @InputHash
        BEGIN
            -- Trả về thông tin người dùng nếu tìm thấy và mật khẩu khớp
            SELECT
                user_id AS user_id,
                username AS username,
                email AS email,
                role AS role,
                avatar_url AS avatar_url,
                join_date AS join_date
            FROM
                Users
            WHERE
                user_id = @UserID;
        END
        ELSE
        BEGIN
            -- Trường hợp mật khẩu không chính xác
            PRINT 'Mật khẩu không chính xác.';
        END;
    END
    ELSE
    BEGIN
        -- Trường hợp không tìm thấy người dùng
        PRINT 'Email không tồn tại.';
    END;
END;


EXEC sp_login 'phu010501@gmail.com', '12345';

	--Đăng ký
CREATE PROCEDURE sp_register
    @inputUsername NVARCHAR(255),
    @inputEmail NVARCHAR(255),
    @inputPassword NVARCHAR(255),
    @inputRole NVARCHAR(50) = 'NguoiDung', -- Thiết lập mặc định là 'KhachHang'
    @inputAvatarUrl NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra định dạng email (@inputEmail) để đảm bảo nó chứa ký tự '@' và có ít nhất một dấu chấm sau đó.
    IF @inputEmail NOT LIKE '%@%.%'
    BEGIN
        PRINT 'Email không hợp lệ.';
        RETURN;
    END;

    -- Kiểm tra xem email (@inputEmail) đã được đăng ký trong cơ sở dữ liệu chưa.
    IF EXISTS (SELECT 1 FROM Users WHERE email = @inputEmail)
    BEGIN
        PRINT 'Email đã được đăng ký.';
        RETURN;
    END;

    -- Băm mật khẩu (@inputPassword) với thuật toán SHA2_256
    DECLARE @hashedPassword NVARCHAR(255);
    SET @hashedPassword = CONVERT(NVARCHAR(64), HASHBYTES('SHA2_256', @inputPassword), 2);

    -- Thêm người dùng vào bảng Users với mật khẩu đã băm
    INSERT INTO Users (username, email, password, role, avatar_url, join_date)
    VALUES (@inputUsername, @inputEmail, @hashedPassword, @inputRole, @inputAvatarUrl, GETDATE());

    PRINT 'Người dùng đã được đăng ký thành công.';
END;


EXEC sp_register N'Admin', 'admin@gmail.com', '12345', 'Admin', 'admin.jpg';
EXEC sp_register N'Hùng', 'hung@gmail.com', '12345', 'NguoiDung', 'avatar-5.jpg';
EXEC sp_register N'Phú', 'phu@gmail.com', '12345', 'NguoiDung', 'avatar-4.jpg';
EXEC sp_register N'Nam', 'nam@gmail.com', '12345', 'NguoiDung', 'avatar-3.jpg';
EXEC sp_register N'Phượng', 'phuong@gmail.com', '12345', 'NguoiDung', 'avatar-2.jpg';

UPDATE Users
SET 
    avatar_url = 'admin.jpg'
WHERE user_id = 19;

select * from files;
--Get user by user_id
CREATE PROCEDURE sp_get_user_by_userId
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Users
    WHERE user_id = @user_id;
END;

exec sp_get_user_by_userId @user_id=22;
--Nhập email lấy ra all thông tin
CREATE PROCEDURE sp_get_user_by_email
    @email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UserID INT;
    DECLARE @Username NVARCHAR(255);
    DECLARE @Role NVARCHAR(50);
    DECLARE @PasswordHash NVARCHAR(255);
    DECLARE @AvatarUrl NVARCHAR(MAX);
    DECLARE @JoinDate DATETIME;

    -- Tìm kiếm người dùng bằng email
    SELECT
        @UserID = user_id,
        @Username = username,
        @Role = role,
        @PasswordHash = password,
        @AvatarUrl = avatar_url,
        @JoinDate = join_date
    FROM
        Users
    WHERE
        email = @email;

    -- Trả về thông tin người dùng nếu tìm thấy
    IF @@ROWCOUNT > 0
    BEGIN
        SELECT
            user_id AS user_id,
            username AS username,
            email AS email,
            role AS role,
            password AS password,
            avatar_url AS avatar_url,
            join_date AS join_date
        FROM
            Users
        WHERE
            email = @email;
    END
    ELSE
    BEGIN
        -- Trường hợp không tìm thấy email trong bảng Users
        PRINT 'Không tìm thấy người dùng với email này.';
    END;
END;

EXEC sp_get_user_by_email 'admin@email.com';

--GET ALL TABLES--
CREATE PROCEDURE [dbo].[sp_get_all_activitylog]
AS
BEGIN
    SELECT * FROM ActivityLog;
END;

CREATE PROCEDURE [dbo].[sp_get_files_by_user_id]
    @UserID INT
AS
BEGIN
    SELECT f.*
    FROM Files f
    INNER JOIN Users u ON f.user_id = u.user_id
    WHERE u.user_id = @UserID;
END;
exec [sp_get_files_by_user_id]  @UserID = 10;

CREATE PROCEDURE [dbo].[sp_get_all_filetags]
AS
BEGIN
    SELECT * FROM FileTags;
END;

CREATE PROCEDURE [dbo].[sp_get_all_fileversions]
AS
BEGIN
    SELECT * FROM FileVersions;
END;

CREATE PROCEDURE [dbo].[sp_get_all_folders]
AS
BEGIN
    SELECT * FROM Folders;
END;

CREATE PROCEDURE [dbo].[sp_get_all_folderfiles]
AS
BEGIN
    SELECT * FROM FolderFiles;
END;

CREATE PROCEDURE [dbo].[sp_get_all_groupdata]
AS
BEGIN
    SELECT * FROM GroupData;
END;

CREATE PROCEDURE [dbo].[sp_get_all_groupmembers]
AS
BEGIN
    SELECT * FROM GroupMembers;
END;

CREATE PROCEDURE [dbo].[sp_get_all_groups]
    @user_id INT
AS
BEGIN
    SELECT *
    FROM Groups
    WHERE user_id <> @user_id;
END;
select*from groups;
--Create group
CREATE PROCEDURE [dbo].[sp_group_create]
    @group_image NVARCHAR(255),
    @group_name NVARCHAR(255),
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @created_date DATETIME;
    SET @created_date = GETDATE(); -- Lấy ngày giờ hiện tại

    DECLARE @permission_id INT;
    DECLARE @new_group_id INT;

    -- Thêm nhóm mới vào bảng Groups
    INSERT INTO Groups (group_image, group_name, user_id, created_date, total_members)
    VALUES (@group_image, @group_name, @user_id, @created_date, 1); -- Điều chỉnh total_members là 1 cho người tạo nhóm

    -- Lấy group_id của nhóm mới tạo
    SET @new_group_id = SCOPE_IDENTITY();

    -- Tạo một bản ghi mới trong bảng Permissions và lấy permission_id
    INSERT INTO Permissions (user_id, can_read, can_download, can_share, can_delete)
    VALUES (@user_id, 1, 1, 1, 1); -- Giả sử mặc định cho các quyền

    SET @permission_id = SCOPE_IDENTITY(); -- Lấy permission_id của bản ghi mới tạo

    -- Thêm thành viên đầu tiên (người tạo nhóm) vào bảng GroupMembers
    INSERT INTO GroupMembers (group_id, user_id, permission_id, join_date)
    VALUES (@new_group_id, @user_id, @permission_id, @created_date); -- Sử dụng @new_group_id để lấy group_id mới tạo

    PRINT N'Nhóm đã được tạo thành công.';
END;




--Lấy ra danh sách group theo user_id
CREATE PROCEDURE sp_get_groups_by_userId
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT group_id, group_image, group_name, created_date, total_members
    FROM Groups 
    WHERE user_id = @user_id;
END;

exec sp_get_groups_by_userId @user_id=21;


exec sp_group_create 'image.jpg','Anh em oi','22';
exec sp_get_all_groups;
select*from groups;
select*from GroupMembers;
CREATE PROCEDURE [dbo].[sp_get_all_permissions]
AS
BEGIN
    SELECT * FROM Permissions;
END;

CREATE PROCEDURE [dbo].[sp_get_all_tags]
AS
BEGIN
    SELECT * FROM Tags;
END;

CREATE PROCEDURE [dbo].[sp_get_all_users]
AS
BEGIN
    SELECT * FROM Users;
END;


----------FILES------------
----------SHARE FILE WITH GROUPS----------
CREATE PROCEDURE sp_share_file_with_groups
    @file_id INT,
    @user_id INT,
    @group_ids NVARCHAR(MAX) -- Chuỗi chứa các group_id, phân cách bằng dấu phẩy
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @upload_date DATETIME;
    SET @upload_date = GETDATE(); -- Lấy ngày giờ hiện tại

    DECLARE @group_id INT;
    DECLARE @xml XML;
    SET @xml = CAST('<root><r>' + REPLACE(@group_ids, ',', '</r><r>') + '</r></root>' AS XML);

    -- Thực hiện chia sẻ file cho từng group_id trong danh sách
    INSERT INTO GroupData (file_id, group_id, user_id, upload_date)
    SELECT @file_id, T.N.value('.', 'INT'), @user_id, @upload_date
    FROM @xml.nodes('//root/r') T(N);
END;



---------Create File----------
CREATE PROCEDURE sp_file_create
    @user_id INT,
    @filename_old NVARCHAR(255),
	@filename_new NVARCHAR(255),
    @file_size BIGINT,
    @file_type NVARCHAR(50),
    @file_path NVARCHAR(255),
    @upload_date DATETIME,
    @last_modified DATETIME
AS
BEGIN
    INSERT INTO Files (user_id, filename_old, filename_new, file_size, file_type, upload_date , last_modified, file_path)
    VALUES (@user_id, @filename_old, @filename_new, @file_size, @file_type, @upload_date, @last_modified, @file_path);
END
select*from files;

---------Update File-----------
CREATE PROCEDURE sp_file_update
    @file_id INT,
    @filename NVARCHAR(255),
    @file_size FLOAT,
    @file_type NVARCHAR(50),
    @file_path NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem tệp có tồn tại không
    IF EXISTS (SELECT 1 FROM Files WHERE file_id = @file_id)
    BEGIN
        -- Cập nhật thông tin của tệp
        UPDATE Files
        SET
            filename = @filename,
            file_size = @file_size,
            file_type = @file_type,
            last_modified = GETDATE(),
            file_path = @file_path
        WHERE
            file_id = @file_id;

        PRINT 'Thông tin tệp đã được cập nhật thành công.';
    END
    ELSE
    BEGIN
        PRINT 'Không tìm thấy tệp có ID = ' + CAST(@file_id AS NVARCHAR(10));
    END;
END;
---------Delete File-----------
CREATE PROCEDURE sp_file_delete
	@file_id INT
AS
BEGIN
	SET NOCOUNT ON;

	-- Kiểm tra xem tệp có tồn tại không
	IF EXISTS (SELECT 1 FROM Files WHERE file_id = @file_id)
	BEGIN
		-- Xóa tệp khỏi bảng Files
		DELETE FROM Files WHERE file_id = @file_id;

		PRINT 'Tệp đã được xóa thành công.';
	END
	ELSE
	BEGIN
		PRINT 'Không tìm thấy tệp có ID = ' + CAST(@file_id AS NVARCHAR(10));
	END;
END;
--------Search File-----------
CREATE PROCEDURE sp_file_search
@filename_new NVARCHAR(255),
@user_id INT
AS
BEGIN
SET NOCOUNT ON;

-- Tìm các tệp trong bảng Files dựa trên tên file
SELECT
	file_id,
	user_id,
	filename_old,
	filename_new,
	file_size,
	file_type,
	upload_date,
	last_modified,
	file_path
FROM
	Files
WHERE
	user_id = @user_id and filename_new LIKE '%' + @filename_new + '%';
END;
--SEARCH GROUP
CREATE PROCEDURE sp_group_search
    @group_name NVARCHAR(255),
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo một bảng tạm thời để lưu trữ danh sách các nhóm mà user_id chưa tham gia
    CREATE TABLE #TempGroups (
        group_id INT,
        group_name NVARCHAR(255),
        group_image NVARCHAR(255),
        total_members INT
    );

    -- Lấy danh sách các nhóm mà user_id chưa tham gia
    INSERT INTO #TempGroups (group_id, group_name, group_image, total_members)
    SELECT g.group_id, g.group_name, g.group_image, g.total_members
    FROM Groups g
    WHERE NOT EXISTS (
        SELECT 1
        FROM GroupMembers gm
        WHERE gm.group_id = g.group_id AND gm.user_id = @user_id
    ) AND g.group_name LIKE '%' + @group_name + '%';

    -- Trả về kết quả
    SELECT * FROM #TempGroups;

    -- Xóa bảng tạm thời
    DROP TABLE #TempGroups;
END;


select * from groups;

exec sp_file_search @user_id = 22,
@filename_new = thùng;
--Get image_files
CREATE PROCEDURE sp_get_image_files
	@user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Files
    WHERE user_id = @user_id
		AND file_type IN ('JPEG', 'JPG', 'GIF', 'TIFF', 'PSD', 'EPS', 'WEBP', 'PNG');
END;

exec sp_get_image_files @user_id=14;
select * from files;
--Get video_files
CREATE PROCEDURE sp_get_video_files
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Files
    WHERE user_id = @user_id
        AND file_type IN ('AVI', 'MP4','FLV', 'WMV', 'MOV');
END;
EXEC sp_get_video_files @user_id=14;
--Get file_files
CREATE PROCEDURE sp_get_file_files
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Files
    WHERE user_id = @user_id
        AND file_type IN ('TXT', 'DOCX','PDF', 'PPT', 'JAR', 'DOT', 'HTML', 'DOCM', 'DOC');
END;
EXEC sp_get_file_files @user_id=14;

--Lấy ra thông tin file bằng file_id
Create PROCEDURE [dbo].[sp_get_file_by_fileId]
    @fileId NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Tìm các tệp trong bảng Files dựa trên tên file
    SELECT
        file_id,
        user_id,
        filename_old,
		filename_new,
        file_size,
        file_type,
        upload_date,
        last_modified,
        file_path
    FROM
        Files
    WHERE
        file_id = @fileId;
END;
------------PERMISSION--------------
-------Create Permission------------
CREATE PROCEDURE sp_permission_create
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem user_id đã tồn tại trong bảng Users chưa
    IF NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @user_id)
    BEGIN
        PRINT N'User không tồn tại.';
        RETURN;
    END;

    -- Thêm bản ghi mới vào bảng Permissions
    INSERT INTO Permissions (user_id, can_read, can_write, can_share)
    VALUES (@user_id, 1, 0, 0);

    PRINT N'Phân quyền thành công.';
END;
-------Update Permission------------
CREATE PROCEDURE sp_permission_update
    @permission_id INT,
    @can_read BIT = NULL,
    @can_download BIT = NULL,
    @can_share BIT = NULL,
	@can_delete BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem user_id có tồn tại trong bảng Permissions hay không
    IF NOT EXISTS (SELECT 1 FROM Permissions WHERE permission_id = @permission_id)
    BEGIN
        PRINT 'Người dùng chưa có quyền.';
        RETURN;
    END;

    -- Cập nhật quyền cho người dùng trong bảng Permissions
    UPDATE Permissions
    SET
        can_read = ISNULL(@can_read, can_read),
        can_download = ISNULL(@can_download, can_download),
        can_share = ISNULL(@can_share, can_share),
		can_delete = ISNULL(@can_delete, can_delete)
    WHERE
        permission_id = @permission_id;

    PRINT 'Cập nhật quyền thành công.';
END;

select * from files;
exec sp_permission_update
    @permission_id = 57,
    @can_read  = 1,
    @can_download  = 1,
    @can_share  = 1,
	@can_delete  = 0;



----------------GROUP REQUEST-----------------
-------Create Request---------- 

--Đồng ý yêu cầu thêm thành viên vào group
CREATE PROCEDURE sp_group_request_accept
    @request_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @group_id INT;
    DECLARE @user_id INT;
    DECLARE @join_date DATETIME;
    DECLARE @permission_id INT;

    -- Lấy ngày giờ hiện tại
    SET @join_date = GETDATE();

    -- Lấy dữ liệu từ bảng GroupRequests
    SELECT @group_id = group_id, @user_id = user_id
    FROM GroupRequests
    WHERE request_id = @request_id;

    -- Thêm bản ghi vào bảng Permissions và lấy permission_id
    INSERT INTO Permissions (user_id, can_read, can_download, can_share, can_delete)
    VALUES (@user_id, 0, 0, 0, 0);

    -- Lấy permission_id của bản ghi mới được thêm vào
    SET @permission_id = SCOPE_IDENTITY();

    -- Thêm bản ghi vào bảng GroupMembers
    INSERT INTO GroupMembers (group_id, user_id, permission_id, join_date)
    VALUES (@group_id, @user_id, @permission_id, @join_date);

    -- Xóa bản ghi khỏi bảng GroupRequests
    DELETE FROM GroupRequests
    WHERE request_id = @request_id;

    PRINT 'Request đã được chuyển thành công vào bảng GroupMembers.';
END;

select*from GroupMembers;
select*from GroupRequests;
select*from Groups;
select*from users;

exec sp_group_request_accept @group_id =9, @user_id =22;
----------Update Request----------
CREATE PROCEDURE sp_grouprequest_update
    @request_id INT,
    @request_status BIT
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem request_id đã tồn tại trong bảng GroupRequests hay không
    IF NOT EXISTS (SELECT 1 FROM GroupRequests WHERE request_id = @request_id)
    BEGIN
        PRINT 'Yêu cầu không tồn tại.';
        RETURN;
    END;

    -- Cập nhật trạng thái yêu cầu tham gia nhóm
    UPDATE GroupRequests
    SET request_status = @request_status
    WHERE request_id = @request_id;

    PRINT 'Cập nhật trạng thái yêu cầu thành công.';
END;

--Lấy ra danh sách yêu cầu xin vào nhóm (chủ group)
CREATE PROCEDURE sp_get_list_request
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        GR.request_id,
		GR.user_id,
		GR.group_id,
        U.username,
        U.avatar_url,
        GR.request_date
    FROM 
        GroupRequests GR
    INNER JOIN 
        Users U ON GR.user_id = U.user_id
    WHERE 
        GR.group_id = @group_id;
END;


exec sp_get_list_request @group_id=9;
--Select top 3 group
CREATE PROCEDURE sp_get_3_groups
	@user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 3
        group_id,
        group_image,
        group_name,
        user_id,
        created_date,
        total_members
    FROM
        Groups
	WHERE 
		user_id = @user_id
    ORDER BY
        total_members DESC;
END;
exec sp_get_3_groups @user_id=22;
--COUNT MEMBER
CREATE PROCEDURE sp_count_group_members
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
		COUNT(*) AS total_members
    FROM 
		GroupMembers
    WHERE 
		group_id = @group_id;
END;

select * from groupmembers
--COUNT REQUEST
CREATE PROCEDURE sp_count_group_requests
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        COUNT(*) AS total_requests
    FROM 
        GroupRequests
    WHERE 
        group_id = @group_id;
END;
select*from grouprequests;
---------Delete Request-----------
CREATE PROCEDURE sp_grouprequest_delete
    @request_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem request_id đã tồn tại trong bảng GroupRequests hay không
    IF NOT EXISTS (SELECT 1 FROM GroupRequests WHERE request_id = @request_id)
    BEGIN
        PRINT 'Yêu cầu không tồn tại.';
        RETURN;
    END;

    -- Xóa yêu cầu tham gia nhóm
    DELETE FROM GroupRequests
    WHERE request_id = @request_id;

    PRINT 'Xóa yêu cầu tham gia nhóm thành công.';
END;
exec sp_grouprequest_delete @request_id=1;

select *from GroupRequests;

CREATE PROCEDURE sp_group_request_create
    @user_id INT,
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @request_date DATETIME;
    DECLARE @existing_request_count INT;

    -- Kiểm tra số lượng bản ghi tồn tại với user_id và group_id đã cho
    SELECT @existing_request_count = COUNT(*)
    FROM GroupRequests
    WHERE user_id = @user_id AND group_id = @group_id;

    -- Nếu có bản ghi tồn tại, không thêm bản ghi mới và thông báo
    IF @existing_request_count > 0
    BEGIN
        PRINT 'Yêu cầu đã tồn tại.';
    END
    ELSE
    BEGIN
        -- Nếu không có bản ghi tồn tại, thêm bản ghi mới vào bảng GroupRequests
        SET @request_date = GETDATE();
        INSERT INTO GroupRequests (user_id, group_id, request_date)
        VALUES (@user_id, @group_id, @request_date);
        PRINT 'Yêu cầu đã được tạo thành công.';
    END
END;
exec sp_group_request_create
    @user_id =22,
    @group_id =21;
	select * from GroupRequests;
--lấy ra request
CREATE PROCEDURE sp_get_request_by_id
    @request_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        request_id,
        user_id,
        group_id
    FROM 
        GroupRequests
    WHERE 
        request_id = @request_id;
END;
exec sp_get_request_by_id @request_id=1;
select*from GroupMembers;



--GROUPMEMBER
CREATE PROCEDURE sp_add_group_member
    @group_id INT,
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @join_date DATETIME;
    DECLARE @permission_id INT;

    -- Lấy ngày giờ hiện tại
    SET @join_date = GETDATE();

    BEGIN TRANSACTION;

    -- Thêm bản ghi vào bảng Permissions
    INSERT INTO Permissions (user_id, can_read, can_download, can_share, can_delete)
    VALUES (@user_id, 1, 0, 0, 0); 

    -- Lấy permission_id của bản ghi mới được thêm vào
    SET @permission_id = SCOPE_IDENTITY();

    -- Thêm bản ghi vào bảng GroupMembers
    INSERT INTO GroupMembers (group_id, user_id, permission_id, join_date)
    VALUES (@group_id, @user_id, @permission_id, @join_date);

    -- Cập nhật cột total_members trong bảng Groups
    UPDATE Groups
    SET total_members = total_members + 1
    WHERE group_id = @group_id;

    COMMIT TRANSACTION;

    PRINT 'Thành viên đã được thêm vào nhóm thành công.';
END;

exec sp_add_group_member @group_id=9, @user_id=23;

select * from groups;

--Xóa thành viên khỏi group
CREATE PROCEDURE sp_delete_group_member
    @group_id INT,
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @permission_id INT;

    -- Lấy permission_id của thành viên cần xóa
    SELECT @permission_id = permission_id
    FROM GroupMembers
    WHERE group_id = @group_id AND user_id = @user_id;

    -- Kiểm tra nếu permission_id tồn tại
    IF @permission_id IS NOT NULL
    BEGIN
        BEGIN TRANSACTION;

        -- Xóa bản ghi từ bảng GroupMembers
        DELETE FROM GroupMembers
        WHERE group_id = @group_id AND user_id = @user_id;

        -- Xóa bản ghi từ bảng Permissions
        DELETE FROM Permissions
        WHERE permission_id = @permission_id;

        -- Cập nhật cột total_members trong bảng Groups
        UPDATE Groups
        SET total_members = total_members - 1
        WHERE group_id = @group_id;

        COMMIT TRANSACTION;

        PRINT 'Thành viên đã được xóa khỏi nhóm thành công.';
    END
    ELSE
    BEGIN
        PRINT 'Không tìm thấy thành viên trong nhóm.';
    END
END;

CREATE PROCEDURE sp_get_group_members
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT U.avatar_url,
           U.username,
           GM.join_date,
		   p.permission_id,
           P.can_read,
           P.can_download,
           P.can_share,
           P.can_delete
    FROM GroupMembers GM
    INNER JOIN Users U ON GM.user_id = U.user_id
    INNER JOIN Permissions P ON GM.permission_id = P.permission_id
    WHERE GM.group_id = @group_id;
END;
exec sp_get_group_members @group_id= 10;
select * from GroupRequests;

CREATE PROCEDURE sp_check_group_request
    @user_id INT,
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @existing_request_count INT;

    -- Kiểm tra số lượng bản ghi tồn tại với user_id và group_id đã cho
    SELECT @existing_request_count = COUNT(request_id)
    FROM GroupRequests
    WHERE user_id = @user_id AND group_id = @group_id;

    -- Nếu có bản ghi tồn tại, thông báo yêu cầu đã được gửi trước đó
    IF @existing_request_count > 0
    BEGIN
        PRINT N'Yêu cầu đã được gửi trước đó.';
    END
    ELSE
    BEGIN
        -- Nếu không có bản ghi tồn tại, tiếp tục xử lý yêu cầu
        -- Có thể thêm mã xử lý tại đây nếu cần
        PRINT N'Bạn có thể gửi yêu cầu.';
    END
END;
select * from GroupRequests;
exec sp_check_group_request
    @user_id =22,
    @group_id =21;


--GROUP DATA--
CREATE PROCEDURE sp_get_group_data_by_userId_groupId
    @user_id INT,
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        GD.file_id,
        GD.group_id,
        GD.user_id,
        GD.upload_date,
        F.filename_new,
		F.file_type,  
        F.file_size,     
        U.username,
        U.avatar_url
    FROM
        GroupData GD
    INNER JOIN
        Files F ON GD.file_id = F.file_id
    INNER JOIN
        Groups G ON GD.group_id = G.group_id
    INNER JOIN
        Users U ON GD.user_id = U.user_id
    WHERE
        GD.user_id = @user_id AND
        GD.group_id = @group_id;
END;
exec sp_get_group_data_by_userId_groupId @user_id = 21,
    @group_id =9;


--Total_request, total_members
CREATE PROCEDURE sp_get_total_requests_members
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        (SELECT COUNT(*) 
         FROM GroupRequests 
         WHERE group_id = @group_id) AS total_requests,
        (SELECT COUNT(*)
         FROM GroupMembers
         WHERE group_id = @group_id) AS total_members
END;
exec sp_get_total_requests_members @group_id = 9;