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
	can_delete BIT,
	can_chat BIT
);

-- Bảng Nhóm (Groups)
CREATE TABLE Groups (
    group_id INT PRIMARY KEY IDENTITY,
	group_image NVARCHAR(255),
    group_name NVARCHAR(255),
    user_id INT, -- ID của người tạo nhóm
    created_date DATETIME, -- Ngày tạo nhóm
	total_members INT,
	group_content NVARCHAR(256),
    group_update DATETIME,
    CONSTRAINT FK_Creator_User FOREIGN KEY (user_id) REFERENCES Users(user_id) -- Khóa ngoại tham chiếu đến bảng Users
);

-- Bảng yêu cầu join group
CREATE TABLE GroupRequests (
    request_id INT PRIMARY KEY IDENTITY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    request_date DATETIME NOT NULL,
    CONSTRAINT FK_GroupRequests_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_GroupRequests_Groups FOREIGN KEY (group_id) REFERENCES Groups(group_id)
);

-- Bảng dữ liệu của nhóm (GroupData)
CREATE TABLE GroupData (
    file_id INT,
    group_id INT,
	user_id INT,
    upload_date DATETIME,
    CONSTRAINT FK_GroupData_Group FOREIGN KEY (group_id) REFERENCES Groups(group_id),
    CONSTRAINT FK_GroupData_User FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Bảng Tin nhắn nhóm (GroupMessages)
CREATE TABLE GroupMessages (
    message_id INT PRIMARY KEY IDENTITY,
    group_id INT FOREIGN KEY REFERENCES Groups(group_id),
    sender_id INT FOREIGN KEY REFERENCES Users(user_id),
    content NVARCHAR(MAX),
    timestamp DATETIME
);

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
-- Bảng Hoạt động tệp tin (FileActivity)
CREATE TABLE FileActivity (
    activity_id INT PRIMARY KEY IDENTITY,
    file_id INT FOREIGN KEY REFERENCES Files(file_id),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    action NVARCHAR(50), -- xem, sửa, xóa, tải xuống, chia sẻ
    timestamp DATETIME
);

-- Bảng Thống kê tệp tin (FileStatistics)
CREATE TABLE FileStatistics (
    file_id INT PRIMARY KEY FOREIGN KEY REFERENCES Files(file_id),
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0
);

-- Bảng Yêu cầu kết bạn (FriendRequests)
CREATE TABLE FriendRequests (
    request_id INT PRIMARY KEY IDENTITY,
    sender_id INT FOREIGN KEY REFERENCES Users(user_id),
    receiver_id INT FOREIGN KEY REFERENCES Users(user_id),
    status NVARCHAR(50), -- pending, accepted, declined
    request_date DATETIME
);

-- Bảng Tin nhắn (Messages)
CREATE TABLE FriendMessages (
    message_id INT PRIMARY KEY IDENTITY,
    sender_id INT FOREIGN KEY REFERENCES Users(user_id),
    receiver_id INT FOREIGN KEY REFERENCES Users(user_id),
    content NVARCHAR(MAX),
    timestamp DATETIME
);

CREATE TABLE FriendData (
    file_id INT,
    message_id INT,
	user_id INT,
    send_date DATETIME,
    CONSTRAINT FK_FriendData_Message FOREIGN KEY (message_id) REFERENCES FriendMessages(message_id),
    CONSTRAINT FK_FriendData_User FOREIGN KEY (user_id) REFERENCES Users(user_id)
);



-- Thêm dữ liệu vào bảng GroupMessages
INSERT INTO GroupMessages (group_id, sender_id, content, timestamp) 
VALUES 
(24, 21, 'Tin nhắn 1 từ người dùng 21', GETDATE()),
(24, 22, 'Tin nhắn 2 từ người dùng 22', GETDATE()),
(24, 24, 'Tin nhắn 3 từ người dùng 24', GETDATE()),
(24, 21, 'Tin nhắn 4 từ người dùng 21', GETDATE()),
(24, 22, 'Tin nhắn 5 từ người dùng 22', GETDATE()),
(24, 24, 'Tin nhắn 6 từ người dùng 24', GETDATE()),
(24, 21, 'Tin nhắn 7 từ người dùng 21', GETDATE()),
(24, 22, 'Tin nhắn 8 từ người dùng 22', GETDATE()),
(24, 24, 'Tin nhắn 9 từ người dùng 24', GETDATE()),
(24, 21, 'Tin nhắn 10 từ người dùng 21', GETDATE()),
(24, 22, 'Tin nhắn 11 từ người dùng 22', GETDATE()),
(24, 24, 'Tin nhắn 12 từ người dùng 24', GETDATE()),
(24, 21, 'Tin nhắn 13 từ người dùng 21', GETDATE()),
(24, 22, 'Tin nhắn 14 từ người dùng 22', GETDATE()),
(24, 24, 'Tin nhắn 15 từ người dùng 24', GETDATE()),
(24, 21, 'Tin nhắn 16 từ người dùng 21', GETDATE()),
(24, 22, 'Tin nhắn 17 từ người dùng 22', GETDATE()),
(24, 24, 'Tin nhắn 18 từ người dùng 24', GETDATE()),
(24, 21, 'Tin nhắn 19 từ người dùng 21', GETDATE()),
(24, 22, 'Tin nhắn 20 từ người dùng 22', GETDATE());

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

INSERT INTO Groups (group_image, group_name, user_id, created_date, total_members)
VALUES 
('group1.jpg',N'MeMe j97', 22, '2023-01-01 08:00:00', 5),
('group2.jpg',N'Anh em cây khế', 22, '2023-01-02 09:00:00', 3),
('group3.htm',N'3 chị em', 22, '2023-01-03 10:00:00', 7),
('group4.jpg',N'Nhóm hội chợ', 22, '2023-01-04 11:00:00', 4);

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

--==========================================PROCEDURE===================================--
-- Đăng nhập
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
            -- Chèn bản ghi vào bảng ActivityLog
            INSERT INTO ActivityLog (user_id, description, time_log, time_out)
            VALUES (@UserID, 'User logged in', GETDATE(), NULL);

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

CREATE PROCEDURE sp_logout
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Thêm một bản ghi mới vào bảng ActivityLog
    INSERT INTO ActivityLog (user_id, description, time_log, time_out)
    VALUES (@user_id, N'Đăng xuất', NULL, GETDATE());
END;



--Đăng ký
ALTER PROCEDURE sp_register
    @inputUsername NVARCHAR(255),
    @inputEmail NVARCHAR(255),
    @inputPassword NVARCHAR(255),
    @inputRole NVARCHAR(50),
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
    VALUES (@inputUsername, @inputEmail, @hashedPassword, 'NguoiDung', 'images/avatar.jpg', GETDATE());

    PRINT 'Người dùng đã được đăng ký thành công.';
END;
select * from users
delete from users where user_id=41;

EXEC sp_register N'Admin', 'admin@gmail.com', '12345', 'Admin', 'admin.jpg';
EXEC sp_register N'Hùng', 'hung@gmail.com', '12345', 'NguoiDung', 'avatar-5.jpg';
EXEC sp_register N'Phú', 'phu@gmail.com', '12345', 'NguoiDung', 'avatar-4.jpg';
EXEC sp_register N'Nam', 'nam@gmail.com', '12345', 'NguoiDung', 'avatar-3.jpg';
EXEC sp_register N'Phượng', 'phuong@gmail.com', '12345', 'NguoiDung', 'avatar-2.jpg';


DECLARE @i INT = 1;
WHILE @i <= 30
BEGIN
    INSERT INTO Files (user_id, filename_old, filename_new, file_size, file_type, upload_date, last_modified, file_path)
    VALUES (
        FLOOR(RAND() * 4) + 21, -- user_id random từ 21 đến 24
        'image' + CAST(@i AS NVARCHAR(3)) + '.jpg', -- filename_old là image1.jpg -> image30.jpg
        'random_image_' + CAST(FLOOR(RAND() * 1000) AS NVARCHAR(4)) + '.jpg', -- filename_new là tên ngẫu nhiên
        CAST(RAND() * 1000 AS FLOAT), -- file_size ngẫu nhiên
        'jpg', -- file_type là jpg
        DATEADD(DAY, -FLOOR(RAND() * 365), GETDATE()), -- upload_date ngẫu nhiên trong vòng 1 năm qua
        GETDATE(), -- last_modified là thời điểm hiện tại
        'C:\\files\\' + 'image' + CAST(@i AS NVARCHAR(3)) + '.jpg' -- file_path
    );
    SET @i = @i + 1;
END;

DECLARE @counter INT = 1;

-- Insert 20 records with random data
WHILE @counter <= 20
BEGIN
    DECLARE @user_id INT = ROUND(RAND() * 3 + 21, 0); -- Random user_id between 21 and 24
    DECLARE @filename_new NVARCHAR(255);
    DECLARE @file_size FLOAT;
    DECLARE @upload_date DATETIME;

    SET @filename_new = CONCAT('image_', NEWID(), '.mp4'); -- Random filename_new
    SET @file_size = ROUND(RAND() * 1000 + 500, 2); -- Random file_size between 500 and 1500
    SET @upload_date = DATEADD(second, ROUND(RAND() * 31536000, 0), GETDATE()); -- Random upload_date within the past year

    INSERT INTO Files (user_id, filename_old, filename_new, file_size, file_type, upload_date, last_modified, file_path)
    VALUES (
        @user_id,
        CONCAT('video', CAST(@counter AS NVARCHAR(2)), '.mp4'), -- filename_old based on counter
        @filename_new,
        @file_size,
        'mp4',
        @upload_date,
        @upload_date, -- last_modified set to upload_date initially
        '/path/to/files/' -- example file_path
    );

    SET @counter = @counter + 1;
END
-- Insert 20 records into Files table with random data
INSERT INTO Files (user_id, filename_old, filename_new, file_size, file_type, upload_date, last_modified, file_path)
VALUES
    (21, 'file1.pdf', 'important_document.pdf', 1024.5, 'pdf', '2023-04-10', '2023-04-10', '/path/to/important_document.pdf'),
    (21, 'file2.txt', 'meeting_notes.txt', 512.75, 'txt', '2023-06-22', '2023-06-22', '/path/to/meeting_notes.txt'),
    (22, 'file3.pdf', 'proposal.pdf', 2048.0, 'pdf', '2023-05-15', '2023-05-15', '/path/to/proposal.pdf'),
    (22, 'file4.txt', 'todo_list.txt', 256.3, 'txt', '2023-07-01', '2023-07-01', '/path/to/todo_list.txt'),
    (23, 'file5.pdf', 'financial_report.pdf', 4096.75, 'pdf', '2023-03-28', '2023-03-28', '/path/to/financial_report.pdf'),
    (23, 'file6.txt', 'project_plan.txt', 768.1, 'txt', '2023-06-10', '2023-06-10', '/path/to/project_plan.txt'),
    (24, 'file7.pdf', 'research_paper.pdf', 1536.25, 'pdf', '2023-04-05', '2023-04-05', '/path/to/research_paper.pdf'),
    (24, 'file8.txt', 'presentation_notes.txt', 1280.9, 'txt', '2023-07-18', '2023-07-18', '/path/to/presentation_notes.txt'),
    (21, 'file9.pdf', 'contract.pdf', 3072.4, 'pdf', '2023-03-15', '2023-03-15', '/path/to/contract.pdf'),
    (21, 'file10.txt', 'user_guide.txt', 640.2, 'txt', '2023-05-20', '2023-05-20', '/path/to/user_guide.txt'),
    (22, 'file1.pdf', 'invoice.pdf', 8192.8, 'pdf', '2023-02-10', '2023-02-10', '/path/to/invoice.pdf'),
    (22, 'file2.txt', 'memo.txt', 384.6, 'txt', '2023-06-30', '2023-06-30', '/path/to/memo.txt'),
    (23, 'file3.pdf', 'policy_document.pdf', 6144.6, 'pdf', '2023-01-25', '2023-01-25', '/path/to/policy_document.pdf'),
    (23, 'file4.txt', 'survey_results.txt', 1024.7, 'txt', '2023-07-05', '2023-07-05', '/path/to/survey_results.txt'),
    (24, 'file5.pdf', 'manual.pdf', 2048.3, 'pdf', '2023-03-01', '2023-03-01', '/path/to/manual.pdf'),
    (24, 'file6.txt', 'agenda.txt', 512.8, 'txt', '2023-06-15', '2023-06-15', '/path/to/agenda.txt'),
    (21, 'file7.pdf', 'newsletter.pdf', 1024.0, 'pdf', '2023-02-20', '2023-02-20', '/path/to/newsletter.pdf'),
    (21, 'file8.txt', 'report.txt', 768.5, 'txt', '2023-05-05', '2023-05-05', '/path/to/report.txt'),
    (22, 'file9.pdf', 'brochure.pdf', 1536.2, 'pdf', '2023-01-10', '2023-01-10', '/path/to/brochure.pdf'),
    (22, 'file10.txt', 'guidebook.txt', 896.4, 'txt', '2023-04-15', '2023-04-15', '/path/to/guidebook.txt');

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

--GET ALL TABLES--
ALTER PROCEDURE [dbo].[sp_get_all_activitylog]
AS
BEGIN
    SELECT 
        a.log_id,
        a.user_id,
        u.username,
        u.avatar_url,
        a.description,
        a.time_log,
        a.time_out
    FROM 
        ActivityLog a
    JOIN 
        Users u ON a.user_id = u.user_id
    ORDER BY 
        a.log_id DESC;
END;

ALTER PROCEDURE [dbo].[sp_get_files_by_user_id]
    @UserID INT
AS
BEGIN
    SELECT f.*
    FROM Files f
    INNER JOIN Users u ON f.user_id = u.user_id
    WHERE u.user_id = @UserID;
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

ALTER PROCEDURE [dbo].[sp_get_all_groups]
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT g.group_id, g.group_image, g.group_name, g.created_date, g.total_members
    FROM Groups g
    LEFT JOIN GroupMembers gm ON g.group_id = gm.group_id AND gm.user_id = @user_id
    WHERE gm.user_id IS NULL;
END;

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
ALTER PROCEDURE [dbo].[sp_get_groups_by_userId]
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT g.group_id, g.group_image, g.group_name, g.created_date, g.total_members
    FROM Groups g
    INNER JOIN GroupMembers gm ON g.group_id = gm.group_id
    WHERE gm.user_id = @user_id;
END;

CREATE PROCEDURE [dbo].[sp_get_all_permissions]
AS
BEGIN
    SELECT * FROM Permissions;
END;

CREATE PROCEDURE [dbo].[sp_get_all_files]
AS
BEGIN
    SELECT * FROM Files;
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

CREATE PROCEDURE [dbo].[sp_get_all_activitylog]
AS
BEGIN
    SELECT * FROM activitylog;
END;
select * from FriendMessages;
select * from FriendData;
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
	user_id = @user_id 
	and filename_new LIKE '%' + @filename_new + '%';
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

ALTER PROCEDURE sp_group_request_accept
    @request_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @group_id INT;
    DECLARE @user_id INT;
    DECLARE @join_date DATETIME;
    DECLARE @permission_id INT;
    DECLARE @existing_member INT;

    -- Lấy ngày giờ hiện tại
    SET @join_date = GETDATE();

    -- Lấy dữ liệu từ bảng GroupRequests
    SELECT @group_id = group_id, @user_id = user_id
    FROM GroupRequests
    WHERE request_id = @request_id;

    -- Kiểm tra xem user_id đã là thành viên của group_id hay chưa
    SELECT @existing_member = COUNT(*)
    FROM GroupMembers
    WHERE group_id = @group_id AND user_id = @user_id;

    IF @existing_member = 0
    BEGIN
        -- Thêm bản ghi vào bảng Permissions và lấy permission_id
        INSERT INTO Permissions (user_id, can_read, can_download, can_share, can_delete)
        VALUES (@user_id, 0, 0, 0, 0);

        -- Lấy permission_id của bản ghi mới được thêm vào
        SET @permission_id = SCOPE_IDENTITY();

        -- Thêm bản ghi vào bảng GroupMembers
        INSERT INTO GroupMembers (group_id, user_id, permission_id, join_date)
        VALUES (@group_id, @user_id, @permission_id, @join_date);

        -- Cập nhật tổng số thành viên trong nhóm
        UPDATE Groups
        SET total_members = total_members + 1
        WHERE group_id = @group_id;
    END;

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

select * from files;

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

    SELECT 
		   U.user_id,
		   U.avatar_url,
           U.username,
		   GM.group_id,
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
		F.filename_old,
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

CREATE PROCEDURE sp_update_password
    @inputEmail NVARCHAR(255),
    @newPassword NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem email (@inputEmail) có tồn tại trong cơ sở dữ liệu không.
    IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @inputEmail)
    BEGIN
        PRINT 'Email không tồn tại.';
        RETURN;
    END;

    -- Băm mật khẩu mới (@newPassword) với thuật toán SHA2_256
    DECLARE @hashedNewPassword NVARCHAR(255);
    SET @hashedNewPassword = CONVERT(NVARCHAR(64), HASHBYTES('SHA2_256', @newPassword), 2);

    -- Cập nhật mật khẩu mới đã băm cho người dùng có email (@inputEmail)
    UPDATE Users
    SET password = @hashedNewPassword
    WHERE email = @inputEmail;

    PRINT 'Mật khẩu đã được cập nhật thành công.';
END;


CREATE PROCEDURE sp_update_user_info
    @user_id INT,
    @new_username NVARCHAR(255),
    @new_avatar_url NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem user_id có tồn tại trong cơ sở dữ liệu không.
    IF NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @user_id)
    BEGIN
        PRINT 'Người dùng không tồn tại.';
        RETURN;
    END;

    -- Cập nhật username và avatar_url
    UPDATE Users
    SET username = @new_username,
        avatar_url = @new_avatar_url
    WHERE user_id = @user_id;

    PRINT 'Thông tin người dùng đã được cập nhật thành công.';
END;
exec sp_update_user_info
    @user_id = 22,
    @new_username ="Vũ Phong Phú",
    @new_avatar_url ="avatar-4.jpg";
	select * from users;


CREATE PROCEDURE sp_update_filename_new
    @file_id INT,
    @new_filename NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem file_id có tồn tại trong cơ sở dữ liệu không.
    IF NOT EXISTS (SELECT 1 FROM Files WHERE file_id = @file_id)
    BEGIN
        PRINT 'File không tồn tại.';
        RETURN;
    END;

    -- Cập nhật filename_new với tên file mới
    UPDATE Files
    SET filename_new = @new_filename,
        last_modified = GETDATE() -- Cập nhật thời gian sửa đổi cuối cùng
    WHERE file_id = @file_id;

    PRINT 'Tên file mới đã được cập nhật thành công.';
END;
exec sp_update_filename_new
    @file_id = 16,
    @new_filename = "Mẫu hợp đồng thuê nhà";
	select*from files;


alter PROCEDURE [dbo].[sp_get_all_data_in_group]
    @group_id INT
AS
BEGIN
    SELECT 
        f.file_id,
        f.filename_old,
        f.filename_new,
        f.file_size,
        f.file_type,
        f.upload_date AS file_upload_date,
        f.last_modified,
        f.file_path,
        gd.group_id,
        gd.user_id,
        gd.upload_date,
        g.group_id,
		g.group_image,
        g.group_name,
		u.user_id,
		u.username,
        u.avatar_url,
		(SELECT COUNT(*) FROM GroupRequests WHERE group_id = @group_id) AS total_requests,
		g.total_members
    FROM 
        Files f
    JOIN 
        GroupData gd ON f.file_id = gd.file_id
    JOIN 
        Users u ON gd.user_id = u.user_id
    JOIN 
        Groups g ON gd.group_id = g.group_id
    WHERE 
        g.group_id = @group_id;
END;
exec [sp_get_all_data_in_group] @group_id = 24;

CREATE PROCEDURE sp_check_admin_group
    @group_id INT,
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @is_creator BIT;

    -- Kiểm tra xem user_id có phải là người tạo của group_id hay không
    IF EXISTS (
        SELECT 1
        FROM Groups
        WHERE group_id = @group_id AND user_id = @user_id
    )
    BEGIN
        SET @is_creator = 1;
    END
    ELSE
    BEGIN
        SET @is_creator = 0;
    END

    -- Trả về kết quả
    SELECT @is_creator AS IsCreator;
END;

CREATE PROCEDURE sp_get_permission_user_group
    @user_id INT,
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.permission_id,
        p.user_id,
        p.can_read,
        p.can_download,
        p.can_share,
        p.can_delete
    FROM 
        GroupMembers gm
    INNER JOIN 
        Permissions p ON gm.permission_id = p.permission_id
    WHERE 
        gm.user_id = @user_id AND gm.group_id = @group_id;
END
exec GetUserPermissionsByGroup
    @user_id = 21,
    @group_id = 23;

select * from permissions;
select * from groupdata;
select * from files;


ALTER PROCEDURE sp_data_group_search
    @group_id INT,
    @filename_new NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        f.file_id,
        f.user_id,
        f.filename_old,
        f.filename_new,
        f.file_size,
        f.file_type,
        f.upload_date AS file_upload_date,
        f.last_modified,
        f.file_path,
        gd.group_id,
        gd.user_id,
        gd.upload_date
    FROM 
        Files f
    INNER JOIN 
        GroupData gd ON f.file_id = gd.file_id
    WHERE 
        gd.group_id = @group_id
        AND f.filename_new LIKE '%' + @filename_new + '%';
END
select * from users;

ALTER PROCEDURE [dbo].[sp_groupdata_delete]
    @file_id INT,
	@group_id int
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem tệp có tồn tại không
    IF EXISTS (SELECT 1 FROM Groupdata WHERE file_id = @file_id)
    BEGIN
        -- Xóa tệp khỏi bảng Files
        DELETE FROM groupdata WHERE file_id = @file_id and group_id = @group_id;

        PRINT 'Tệp đã được xóa thành công.';
    END
    ELSE
    BEGIN
        PRINT 'Không tìm thấy tệp có ID = ' + CAST(@file_id AS NVARCHAR(10));
    END;
END;
select*from groupdata;
select*from groups;

CREATE PROCEDURE sp_add_file_activity
    @file_id INT,
    @user_id INT,
    @action NVARCHAR(50)
AS
BEGIN
    INSERT INTO FileActivity (file_id, user_id, action, timestamp)
    VALUES (@file_id, @user_id, @action, GETDATE());

    IF @action = 'view'
    BEGIN
        UPDATE FileStatistics
        SET view_count = view_count + 1
        WHERE file_id = @file_id;
    END
    ELSE IF @action = 'download'
    BEGIN
        UPDATE FileStatistics
        SET download_count = download_count + 1
        WHERE file_id = @file_id;
    END
END;

--Chats group
ALTER PROCEDURE sp_Get_Group_Chat_Messages
    @group_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        GM.message_id,
        GM.group_id,
        GM.sender_id,
		u.avatar_url,
        u.username,
        GM.content,
        GM.timestamp
    FROM 
        GroupMessages GM
    INNER JOIN
        Users u ON GM.sender_id = u.user_id
    WHERE 
        GM.group_id = @group_id
    ORDER BY 
        GM.timestamp ASC;
END;
exec sp_Get_Group_Chat_Messages @group_id=24;

select *from Users;
select *from GroupMessages;
select *from Groups;
select *from GroupMembers;


--Update messages group
Alter PROCEDURE sp_Update_Group_Message
    @message_id INT,
    @new_content NVARCHAR(MAX)
   
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra xem message_id có tồn tại không
    IF EXISTS (SELECT 1 FROM GroupMessages WHERE message_id = @message_id)
    BEGIN
        -- Cập nhật bản ghi
        UPDATE GroupMessages
        SET content = @new_content
        WHERE message_id = @message_id;

        PRINT 'Message updated successfully.';
    END
    ELSE
    BEGIN
        PRINT 'Message ID does not exist.';
    END
END;
exec sp_Update_Group_Message @message_id=1, @new_content= N'Anh gì ơi!';

select*from users;

--Create messages group
ALTER PROCEDURE [dbo].[sp_Group_Message_Create]
    @group_id INT,
    @sender_id INT,
    @content NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Thêm bản ghi mới vào bảng GroupMessages
    INSERT INTO GroupMessages (group_id, sender_id, content, timestamp)
    VALUES (@group_id, @sender_id, @content, GETDATE());

    PRINT 'Message added successfully.';
END;

--Create messages friend
ALTER PROCEDURE [dbo].[sp_Friend_Message_Create]
    @sender_id INT,
    @receiver_id INT,
    @content NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Thêm bản ghi mới vào bảng GroupMessages
    INSERT INTO FriendMessages (sender_id, receiver_id, content, timestamp)
    VALUES (@sender_id, @receiver_id, @content, GETDATE());

    PRINT 'Message added successfully.';
END;
select * from FriendMessages;
select * from users;
exec sp_Friend_Message_Create @sender_id=22, @receiver_id=21, @content="con di me may jbduvwdviqtwvdtyqwvydqytwvdyqiwvydvyqvwydqwdqw"

--Gửi lời mời kết bạn
CREATE PROCEDURE [dbo].[sp_friend_request_create]
    @sender_id INT,
    @receiver_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @request_date DATETIME;
    DECLARE @existing_request_count INT;

    -- Kiểm tra số lượng bản ghi tồn tại với user_id và group_id đã cho
    SELECT @existing_request_count = COUNT(*)
    FROM FriendRequests
    WHERE sender_id = @sender_id AND receiver_id = @receiver_id;

    -- Nếu có bản ghi tồn tại, không thêm bản ghi mới và thông báo
    IF @existing_request_count > 0
    BEGIN
        PRINT N'Yêu cầu đã được gửi!';
    END
    ELSE
    BEGIN
        -- Nếu không có bản ghi tồn tại, thêm bản ghi mới vào bảng GroupRequests     
        INSERT INTO FriendRequests (sender_id, receiver_id, status, request_date)
        VALUES (@sender_id, @receiver_id, N'Pending', GETDATE());
        PRINT N'Yêu cầu đã được tạo thành công.';
    END
END;
exec [sp_friend_request_create] @sender_id= 21, @receiver_id=22;
select *from FriendRequests;

--Chấp nhận kết bạn 
CREATE PROCEDURE [dbo].[sp_friend_request_accept]
    @request_id INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Cập nhật quyền cho người dùng trong bảng Permissions
    UPDATE FriendRequests
    SET
        status = N'Accepted',
        request_date = GETDATE()
    WHERE
        request_id = @request_id;
    PRINT N'Kết bạn thành công';
END;
--Chặn bạn bè
CREATE PROCEDURE [dbo].[sp_friend_block]
    @request_id INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Cập nhật quyền cho người dùng trong bảng Permissions
    UPDATE FriendRequests
    SET
        status = N'Block',
        request_date = GETDATE()
    WHERE
        request_id = @request_id;
    PRINT N'Chặn thành công!';
END;
exec [sp_friend_block] @request_id=3;

--TỪ chối kết bạn
CREATE PROCEDURE [dbo].[sp_friend_declined]
    @request_id INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Cập nhật quyền cho người dùng trong bảng Permissions
    UPDATE FriendRequests
    SET
        status = N'Declined',
        request_date = GETDATE()
    WHERE
        request_id = @request_id;
    PRINT N'Từ chối kết bạn';
END;
--Hủy kết bạn
CREATE PROCEDURE [dbo].[sp_friend_destroy]
    @request_id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FriendRequests
    WHERE
        request_id = @request_id;
    PRINT N'Hủy kết bạn thành công';
END;

Alter PROCEDURE [dbo].[sp_get_all_users]
	@user_id int
AS
BEGIN
    SELECT * FROM Users where role='NguoiDung' and @user_id != user_id;
END;

CREATE PROCEDURE [dbo].[sp_get_all_friend_request]
	@user_id int
AS
BEGIN
    SELECT * FROM FriendRequests where @user_id != sender_id or @user_id = receiver_id;
END;

--Xóa tin nhắn hoặc dữ liệu chia sẻ
CREATE PROCEDURE sp_delete_data_friend
    @message_id INT
AS
BEGIN
    -- Bắt đầu một giao dịch để đảm bảo tính toàn vẹn dữ liệu
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Xóa dữ liệu trong bảng FriendData trước
        DELETE FROM FriendData
        WHERE message_id = @message_id;

        -- Xóa dữ liệu trong bảng FriendMessages
        DELETE FROM FriendMessages
        WHERE message_id = @message_id;

        -- Hoàn tất giao dịch nếu không có lỗi
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Nếu có lỗi, hủy bỏ giao dịch và ghi nhận lỗi
        ROLLBACK TRANSACTION;

        -- Trả về thông tin lỗi
        DECLARE @ErrorMessage NVARCHAR(4000), @ErrorSeverity INT, @ErrorState INT;
        SELECT @ErrorMessage = ERROR_MESSAGE(), 
               @ErrorSeverity = ERROR_SEVERITY(), 
               @ErrorState = ERROR_STATE();
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;

--Lấy danh sách yêu cầu của người dùng(mục bạn bè)
ALTER PROCEDURE [dbo].[sp_get_all_request_friend]
    @user_id INT
AS
BEGIN
    SELECT
        u.user_id,
        u.username,
        u.avatar_url,
        fr.request_id,
        fr.sender_id,
        fr.receiver_id,
        fr.status,
        fr.request_date
    FROM 
        Users u
    JOIN
        FriendRequests fr 
        ON (u.user_id = fr.sender_id OR u.user_id = fr.receiver_id)
    WHERE 
        fr.sender_id = @user_id OR fr.receiver_id = @user_id
END;
   
--Chia sẻ file giữa các người dùng
CREATE PROCEDURE sp_share_file_for_friend
    @file_id INT,
    @sender_id INT,
    @receiver_list NVARCHAR(MAX), -- Danh sách mã người nhận dạng chuỗi, ví dụ: '1,2,3'
    @content NVARCHAR(MAX) = N'data shared' -- Nội dung chia sẻ mặc định là 'data shared'
AS
BEGIN
    -- Tách danh sách người nhận thành bảng tạm
    DECLARE @xml XML = N'<root><id>' + REPLACE(@receiver_list, ',', '</id><id>') + '</id></root>';

    -- Duyệt từng người nhận và chèn vào bảng FriendMessages và FriendData
    INSERT INTO FriendMessages (sender_id, receiver_id, content, timestamp)
    SELECT 
        @sender_id,
        receivers.id.value('.', 'INT') AS receiver_id,
        @content,
        GETDATE()
    FROM @xml.nodes('/root/id') AS receivers(id);

    -- Chèn dữ liệu vào bảng FriendData dựa trên các message_id vừa được tạo
    INSERT INTO FriendData (file_id, message_id, user_id, send_date)
    SELECT 
        @file_id,
        fm.message_id,
        @sender_id,
        GETDATE()
    FROM FriendMessages fm
    WHERE fm.sender_id = @sender_id
    AND fm.timestamp = (SELECT MAX(timestamp) FROM FriendMessages WHERE sender_id = @sender_id);
END;

--Chia sẻ nhiều dữ liệu cho 1 người dùng
ALTER PROCEDURE sp_share_friend_list_data
    @sender_id INT,               -- ID của người gửi
    @receiver_id INT,             -- ID của người nhận
    @message_content NVARCHAR(MAX) = N'Shared List Data', -- Nội dung tin nhắn mặc định
    @file_ids NVARCHAR(MAX)       -- Danh sách file_id, ngăn cách bằng dấu phẩy (e.g. '1,2,3')
AS
BEGIN
    -- Bắt đầu transaction để đảm bảo tính nhất quán
    BEGIN TRANSACTION;

    BEGIN TRY
        -- 1. Thêm tin nhắn vào bảng FriendMessages
        DECLARE @message_id INT;
        INSERT INTO FriendMessages (sender_id, receiver_id, content, timestamp)
        VALUES (@sender_id, @receiver_id, @message_content, GETDATE());

        -- Lấy message_id của tin nhắn vừa thêm
        SET @message_id = SCOPE_IDENTITY();

        -- 2. Xử lý danh sách file_id (chuỗi file_ids được truyền vào)
        DECLARE @file_id NVARCHAR(50);
        DECLARE @pos INT;

        WHILE LEN(@file_ids) > 0
        BEGIN
            -- Lấy file_id đầu tiên từ danh sách
            SET @pos = CHARINDEX(',', @file_ids);

            IF @pos = 0
                SET @file_id = @file_ids;
            ELSE
                SET @file_id = SUBSTRING(@file_ids, 1, @pos - 1);

            -- Loại bỏ file_id đã xử lý khỏi danh sách
            IF @pos = 0
                SET @file_ids = '';
            ELSE
                SET @file_ids = SUBSTRING(@file_ids, @pos + 1, LEN(@file_ids) - @pos);

            -- 3. Thêm thông tin chia sẻ file vào bảng FriendData
            INSERT INTO FriendData (file_id, message_id, user_id, send_date)
            VALUES (CAST(@file_id AS INT), @message_id, @sender_id, GETDATE());
        END;

        -- Commit transaction nếu mọi thứ thành công
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback transaction nếu có lỗi
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

ALTER PROCEDURE [Get_Data_Friend_Chat]
    @sender_id INT,
    @receiver_id INT
AS
BEGIN
    -- Kiểm tra nếu có tin nhắn giữa hai user
    IF EXISTS (
        SELECT 1 
        FROM FriendMessages fm
        WHERE (fm.sender_id = @sender_id AND fm.receiver_id = @receiver_id)
           OR (fm.sender_id = @receiver_id AND fm.receiver_id = @sender_id)
    )
    BEGIN
        -- Trường hợp 2: Nếu đã có tin nhắn giữa hai user, lấy tất cả các thông tin
        SELECT 
            -- Tin nhắn
            fm.message_id,
            fm.sender_id,
            fm.receiver_id,
            fm.content,
            fm.timestamp,
            
            -- Dữ liệu file
            fd.file_id,
            f.filename_new,
            f.filename_old,
            f.file_size,
            f.file_type,
            fd.send_date,
            
            -- Trạng thái yêu cầu kết bạn
            fr.status,
            fr.request_date,
            
            -- Thông tin người nhận
            us_receiver.username,
            us_receiver.avatar_url,
            us_receiver.email

        FROM FriendMessages fm
        LEFT JOIN FriendData fd ON fd.message_id = fm.message_id
        LEFT JOIN Files f ON f.file_id = fd.file_id
        LEFT JOIN Users us_sender ON us_sender.user_id = fm.sender_id
        LEFT JOIN Users us_receiver ON us_receiver.user_id = fm.receiver_id
        LEFT JOIN FriendRequests fr ON (
            (fr.sender_id = @sender_id AND fr.receiver_id = @receiver_id)
            OR (fr.sender_id = @receiver_id AND fr.receiver_id = @sender_id)
        )
        WHERE (fm.sender_id = @sender_id AND fm.receiver_id = @receiver_id)
           OR (fm.sender_id = @receiver_id AND fm.receiver_id = @sender_id)
        ORDER BY fm.timestamp;
    END
    ELSE
    BEGIN
        -- Trường hợp 1: Nếu chưa có tin nhắn giữa hai user, chỉ lấy thông tin người nhận
        SELECT 
            us_receiver.username,
            us_receiver.avatar_url,
            us_receiver.email
        FROM Users us_receiver
        WHERE us_receiver.user_id = @receiver_id;
    END
END;



exec Get_Data_Friend_Chat @sender_id=22, @receiver_id=21;
select * from ActivityLog;
delete from activitylog;

