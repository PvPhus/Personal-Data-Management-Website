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
    filename NVARCHAR(255),
    file_size FLOAT,
    file_type NVARCHAR(50),
    upload_date DATETIME,
    last_modified DATETIME,
    file_path NVARCHAR(MAX)
);

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
	--file_id INT FOREIGN KEY REFERENCES Files(file_id),
	can_read BIT,
	can_write BIT,
	can_share BIT
);

-- Bảng Nhóm (Groups)
CREATE TABLE Groups (
    group_id INT PRIMARY KEY IDENTITY,
    group_name NVARCHAR(255),
    user_id INT, -- ID của người tạo nhóm
    created_date DATETIME, -- Ngày tạo nhóm
	total_members INT,
    CONSTRAINT FK_Creator_User FOREIGN KEY (user_id) REFERENCES Users(user_id) -- Khóa ngoại tham chiếu đến bảng Users
);

select * from GroupRequests;

--Trạng thái 0: chưa đồng ý; 1: đồng ý
CREATE TABLE GroupRequests (
    request_id INT PRIMARY KEY IDENTITY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    request_status BIT NOT NULL,
    request_date DATETIME NOT NULL,
    CONSTRAINT FK_GroupRequests_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_GroupRequests_Groups FOREIGN KEY (group_id) REFERENCES Groups(group_id)
);

INSERT INTO GroupRequests (user_id, group_id, request_status, request_date)
VALUES (1, 9, 0, GETDATE());


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

INSERT INTO Files (user_id, filename, file_size, file_type, upload_date, last_modified, file_path)
VALUES 
(1, 'BaoCaoUML.doc', 1024, 'doc', '2023-01-01 08:00:00', '2023-01-01 08:00:00', 'BaoCaoUML.doc'),
(2, 'BaoCaoUML.pdf', 2048, 'pdf', '2023-01-02 09:00:00', '2023-01-02 09:00:00', 'BaoCaoUML.pdf'),
(3, 'decoded_TA1.docx', 3072, 'docx', '2023-01-03 10:00:00', '2023-01-03 10:00:00', 'decoded_TA1.docx'),
(4, 'Đề 10_Vũ Phong Phú.mp4', 4096, 'mp4', '2023-01-04 11:00:00', '2023-01-04 11:00:00', 'Đề 10_Vũ Phong Phú.mp4'),
(5, 'TA1.docx', 5120, 'docx', '2023-01-05 12:00:00', '2023-01-05 12:00:00', 'TA1.docx'),
(6, 'TA2.docx', 6144, 'docx', '2023-01-06 13:00:00', '2023-01-06 13:00:00', 'TA2.docx'),
(7, 'WebAPI.docx', 7168, 'docx', '2023-01-07 14:00:00', '2023-01-07 14:00:00', 'WebAPI.docx'),
(8, 'WebAPI.pdf', 8192, 'pdf', '2023-01-08 15:00:00', '2023-01-08 15:00:00', 'WebAPI.pdf'),
(9, 'file9.txt', 9216, 'txt', '2023-01-09 16:00:00', '2023-01-09 16:00:00', 'file9.txt'),
(10, 'file10.txt', 10240, 'txt', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'file10.txt');


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

INSERT INTO Groups (group_name, user_id, created_date, total_members)
VALUES 
('Nhóm 1', 1, '2023-01-01 08:00:00', 5);
--('Nhóm 2', 2, '2023-01-02 09:00:00', 3),
--('Nhóm 3', 3, '2023-01-03 10:00:00', 7),
--('Nhóm 4', 4, '2023-01-04 11:00:00', 4),
--('Nhóm 5', 5, '2023-01-05 12:00:00', 6),
--('Nhóm 6', 6, '2023-01-06 13:00:00', 8),
--('Nhóm 7', 7, '2023-01-07 14:00:00', 2),
--('Nhóm 8', 8, '2023-01-08 15:00:00', 5),
--('Nhóm 9', 9, '2023-01-09 16:00:00', 3),
--('Nhóm 10', 10, '2023-01-10 17:00:00', 9);

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
        SET @InputHash = CONVERT(NVARCHAR(255), HASHBYTES('SHA2_256', CONVERT(VARCHAR(255), @inputPassword)), 2);

        -- Kiểm tra mật khẩu
        IF @StoredHash = @InputHash
        BEGIN
            -- Trả về thông tin người dùng nếu tìm thấy và mật khẩu khớp
            SELECT
                user_id AS UserID,
                username AS Username,
                email AS Email,
                role AS Role,
                avatar_url AS AvatarUrl,
                join_date AS JoinDate
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

EXEC sp_login 'admin@email.com', 'password1';

	--Đăng ký
CREATE PROCEDURE sp_register
    @inputUsername NVARCHAR(255),
    @inputEmail NVARCHAR(255),
    @inputPassword NVARCHAR(255),
    @inputRole NVARCHAR(50) = 'KhachHang', -- Thiết lập mặc định là 'KhachHang'
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


EXEC sp_register 'newuser', 'user14@gmail.com', '12345', DEFAULT, 'avatar-url.jfif';
select * from users;


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
            user_id AS UserID,
            username AS Username,
            email AS Email,
            role AS Role,
            password AS PasswordHash,
            avatar_url AS AvatarUrl,
            join_date AS JoinDate
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

CREATE PROCEDURE [dbo].[sp_get_all_files]
AS
BEGIN
    SELECT * FROM Files;
END;

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
AS
BEGIN
    SELECT * FROM Groups;
END;

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
---------Create File----------
CREATE PROCEDURE sp_file_create
    @user_id INT,
    @filename NVARCHAR(255),
    @file_size FLOAT,
    @file_type NVARCHAR(50),
    @file_path NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Thêm một bản ghi mới vào bảng Files
    INSERT INTO Files (user_id, filename, file_size, file_type, upload_date, last_modified, file_path)
    VALUES (@user_id, @filename, @file_size, @file_type, GETDATE(), GETDATE(), @file_path);
    
    -- Trả về ID của bản ghi vừa được thêm vào (nếu cần)
    SELECT SCOPE_IDENTITY() AS inserted_file_id;
END;
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
@filename NVARCHAR(255)
AS
BEGIN
SET NOCOUNT ON;

-- Tìm các tệp trong bảng Files dựa trên tên file
SELECT
	file_id,
	user_id,
	filename,
	file_size,
	file_type,
	upload_date,
	last_modified,
	file_path
FROM
	Files
WHERE
	filename LIKE '%' + @filename + '%';
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
    @user_id INT,
    @can_read BIT = NULL,
    @can_write BIT = NULL,
    @can_share BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem user_id có tồn tại trong bảng Permissions hay không
    IF NOT EXISTS (SELECT 1 FROM Permissions WHERE user_id = @user_id)
    BEGIN
        PRINT 'Người dùng chưa có quyền.';
        RETURN;
    END;

    -- Cập nhật quyền cho người dùng trong bảng Permissions
    UPDATE Permissions
    SET
        can_read = ISNULL(@can_read, can_read),
        can_write = ISNULL(@can_write, can_write),
        can_share = ISNULL(@can_share, can_share)
    WHERE
        user_id = @user_id;

    PRINT 'Cập nhật quyền thành công.';
END;

select * from permissions;




----------------GROUP REQUEST-----------------
-------Create Request---------- 
CREATE PROCEDURE sp_grouprequest_create
    @user_id INT,
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem user_id và group_id đã tồn tại trong bảng Users và Groups
    IF NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @user_id)
    BEGIN
        PRINT 'Người dùng không tồn tại.';
        RETURN;
    END;

    IF NOT EXISTS (SELECT 1 FROM Groups WHERE group_id = @group_id)
    BEGIN
        PRINT 'Nhóm không tồn tại.';
        RETURN;
    END;

    -- Thêm yêu cầu tham gia nhóm mới vào bảng GroupRequests
    INSERT INTO GroupRequests (user_id, group_id, request_status, request_date)
    VALUES (@user_id, @group_id, 0, GETDATE());

    PRINT 'Yêu cầu tham gia nhóm đã được tạo thành công.';
END;

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

select *from GroupRequests;