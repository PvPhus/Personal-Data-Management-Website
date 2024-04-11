CREATE DATABASE PersonalDataManagement
GO

USE PersonalDataManagement
GO

-- Bảng Người dùng (Users)
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY,
    username NVARCHAR(255),
    email NVARCHAR(255),
    password_hash NVARCHAR(255),
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
	file_id INT FOREIGN KEY REFERENCES Files(file_id),
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


INSERT INTO Users (username, email, password_hash, avatar_url, join_date)
VALUES
('user1', 'user1@example.com', 'password1', 'D:\Personal Data Management Website\Folder\Images\avatar-1.jfif', '2024-01-01 08:00:00'),
('user2', 'user2@example.com', 'password2', 'D:\Personal Data Management Website\Folder\Images\avatar-2.jfif', '2024-01-01 08:00:00'),
('user3', 'user3@example.com', 'password3', 'D:\Personal Data Management Website\Folder\Images\avatar-3.jfif', '2024-01-01 08:00:00'),
('user4', 'user4@example.com', 'password4', 'D:\Personal Data Management Website\Folder\Images\avatar-4.jfif', '2024-01-01 08:00:00'),
('user5', 'user5@example.com', 'password5', 'D:\Personal Data Management Website\Folder\Images\avatar-5.jfif', '2024-01-01 08:00:00'),
('user6', 'user6@example.com', 'password6', 'D:\Personal Data Management Website\Folder\Images\avatar-1.jfif', '2024-01-01 08:00:00'),
('user7', 'user7@example.com', 'password7', 'D:\Personal Data Management Website\Folder\Images\avatar-2.jfif', '2024-01-01 08:00:00'),
('user8', 'user8@example.com', 'password8', 'D:\Personal Data Management Website\Folder\Images\avatar-3.jfif', '2024-01-01 08:00:00'),
('user9', 'user9@example.com', 'password9', 'D:\Personal Data Management Website\Folder\Images\avatar-4.jfif', '2024-01-01 08:00:00'),
('user10', 'user10@example.com', 'password10', 'D:\Personal Data Management Website\Folder\Images\avatar-5.jfif', '2024-01-01 08:00:00');
select*from users;

INSERT INTO Files (user_id, filename, file_size, file_type, upload_date, last_modified, file_path)
VALUES 
(21, 'BaoCaoUML.doc', 1024, 'doc', '2023-01-01 08:00:00', '2023-01-01 08:00:00', 'D:\Personal Data Management Website\Folder\Files\BaoCaoUML.doc'),
(22, 'BaoCaoUML.pdf', 2048, 'pdf', '2023-01-02 09:00:00', '2023-01-02 09:00:00', 'D:\Personal Data Management Website\Folder\Files\BaoCaoUML.pdf'),
(23, 'decoded_TA1.docx', 3072, 'docx', '2023-01-03 10:00:00', '2023-01-03 10:00:00', 'D:\Personal Data Management Website\Folder\Files\decoded_TA1.docx'),
(24, 'Đề 10_Vũ Phong Phú.mp4', 4096, 'mp4', '2023-01-04 11:00:00', '2023-01-04 11:00:00', 'D:\Personal Data Management Website\Folder\Files\Đề 10_Vũ Phong Phú.mp4'),
(25, 'TA1.docx', 5120, 'docx', '2023-01-05 12:00:00', '2023-01-05 12:00:00', 'D:\Personal Data Management Website\Folder\Files\TA1.docx'),
(26, 'TA2.docx', 6144, 'docx', '2023-01-06 13:00:00', '2023-01-06 13:00:00', 'D:\Personal Data Management Website\Folder\Files\TA2.docx'),
(27, 'WebAPI.docx', 7168, 'docx', '2023-01-07 14:00:00', '2023-01-07 14:00:00', 'D:\Personal Data Management Website\Folder\Files\WebAPI.docx'),
(28, 'WebAPI.pdf', 8192, 'pdf', '2023-01-08 15:00:00', '2023-01-08 15:00:00', 'D:\Personal Data Management Website\Folder\Files\WebAPI.pdf'),
(29, 'file9.txt', 9216, 'txt', '2023-01-09 16:00:00', '2023-01-09 16:00:00', 'D:\Personal Data Management Website\Folder\Files\file9.txt'),
(30, 'file10.txt', 10240, 'txt', '2023-01-10 17:00:00', '2023-01-10 17:00:00', 'D:\Personal Data Management Website\Folder\Files\file10.txt');



INSERT INTO Folders (user_id, folder_name, parent_folder_id, creation_date)
VALUES 
(21, 'Folder 1', NULL, '2023-01-01 08:00:00'),
(22, 'Folder 2', NULL, '2023-01-02 09:00:00'),
(23, 'Folder 3', NULL, '2023-01-03 10:00:00'),
(24, 'Folder 4', NULL, '2023-01-04 11:00:00'),
(25, 'Folder 5', NULL, '2023-01-05 12:00:00'),
(26, 'Folder 6', NULL, '2023-01-06 13:00:00'),
(27, 'Folder 7', NULL, '2023-01-07 14:00:00'),
(28, 'Folder 8', NULL, '2023-01-08 15:00:00'),
(29, 'Folder 9', NULL, '2023-01-09 16:00:00'),
(30, 'Folder 10', NULL, '2023-01-10 17:00:00');


INSERT INTO Permissions (user_id, file_id, can_read, can_write, can_share)
VALUES 
(21, 11, 1, 0, 1),
(22, 2, 1, 1, 0),
(23, 3, 0, 1, 1),
(24, 4, 1, 0, 0),
(25, 5, 1, 1, 1),
(26, 6, 0, 0, 1),
(27, 7, 1, 1, 1),
(28, 8, 0, 0, 0),
(29, 9, 1, 1, 1),
(30, 10, 0, 1, 0);

INSERT INTO Groups (group_name, user_id, created_date, total_members)
VALUES 
('Nhóm 1', 21, '2023-01-01 08:00:00', 5),
('Nhóm 2', 22, '2023-01-02 09:00:00', 3),
('Nhóm 3', 23, '2023-01-03 10:00:00', 7),
('Nhóm 4', 24, '2023-01-04 11:00:00', 4),
('Nhóm 5', 25, '2023-01-05 12:00:00', 6),
('Nhóm 6', 26, '2023-01-06 13:00:00', 8),
('Nhóm 7', 27, '2023-01-07 14:00:00', 2),
('Nhóm 8', 28, '2023-01-08 15:00:00', 5),
('Nhóm 9', 29, '2023-01-09 16:00:00', 3),
('Nhóm 10', 30, '2023-01-10 17:00:00', 9);

INSERT INTO GroupData (file_id, group_id, user_id, upload_date)
VALUES 
(11, 11, 21, '2023-01-01 08:00:00'),
(2, 2, 22, '2023-01-02 09:00:00'),
(3, 3, 23, '2023-01-03 10:00:00'),
(4, 4, 24, '2023-01-04 11:00:00'),
(5, 5, 25, '2023-01-05 12:00:00'),
(6, 6, 26, '2023-01-06 13:00:00'),
(7, 7, 27, '2023-01-07 14:00:00'),
(8, 8, 28, '2023-01-08 15:00:00'),
(9, 9, 29, '2023-01-09 16:00:00'),
(10, 10, 30, '2023-01-10 17:00:00');

INSERT INTO GroupMembers (group_id, user_id, permission_id)
VALUES 
(11, 21, 1),
(2, 22, 2),
(3, 23, 3),
(4, 24, 4),
(5, 25, 5),
(6, 26, 6),
(7, 27, 7),
(8, 28, 8),
(9, 29, 9),
(10, 30, 10);

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
(11, 1, '2023-01-01 08:00:00','D:\Personal Data Management Website\Folder\Files\BaoCaoUML.doc'),
(2, 1, '2023-01-02 09:00:00', 'D:\Personal Data Management Website\Folder\Files\BaoCaoUML.pdf'),
(3, 1, '2023-01-03 10:00:00', 'D:\Personal Data Management Website\Folder\Files\decoded_TA1.docx'),
(4, 1, '2023-01-04 11:00:00', 'D:\Personal Data Management Website\Folder\Files\Đề 10_Vũ Phong Phú.mp4'),
(5, 1, '2023-01-05 12:00:00','D:\Personal Data Management Website\Folder\Files\TA1.docx'),
(6, 1, '2023-01-06 13:00:00','D:\Personal Data Management Website\Folder\Files\TA2.docx'),
(7, 1, '2023-01-07 14:00:00', 'D:\Personal Data Management Website\Folder\Files\WebAPI.docx'),
(8, 1, '2023-01-08 15:00:00', 'D:\Personal Data Management Website\Folder\Files\WebAPI.pdf'),
(9, 1, '2023-01-09 16:00:00', 'D:\\Personal Data Management Website\\Files\\file9.txt'),
(10, 1, '2023-01-10 17:00:00', 'D:\\Personal Data Management Website\\Files\\file10.txt');


INSERT INTO ActivityLog (user_id, description, time_log, time_out)
VALUES 
(21, N'User 1 logged in.', '2023-01-01 08:00:00', '2023-01-01 09:00:00'),
(22, N'User 2 logged in.', '2023-01-01 09:00:00', '2023-01-01 10:00:00'),
(23, N'User 3 logged in.', '2023-01-01 10:00:00', '2023-01-01 11:00:00'),
(24, N'User 4 logged in.', '2023-01-01 11:00:00', '2023-01-01 12:00:00'),
(25, N'User 5 logged in.', '2023-01-01 12:00:00', '2023-01-01 13:00:00'),
(26, N'User 6 logged in.', '2023-01-01 13:00:00', '2023-01-01 14:00:00'),
(27, N'User 7 logged in.', '2023-01-01 14:00:00', '2023-01-01 15:00:00'),
(28, N'User 8 logged in.', '2023-01-01 15:00:00', '2023-01-01 16:00:00'),
(29, N'User 9 logged in.', '2023-01-01 16:00:00', '2023-01-01 17:00:00'),
(30, N'User 10 logged in.', '2023-01-01 17:00:00', '2023-01-01 18:00:00'),
(21, N'User 1 logged out.', '2023-01-01 18:00:00', '2023-01-01 19:00:00'),
(22, N'User 2 logged out.', '2023-01-01 19:00:00', '2023-01-01 20:00:00'),
(23, N'User 3 logged out.', '2023-01-01 20:00:00', '2023-01-01 21:00:00'),
(24, N'User 4 logged out.', '2023-01-01 21:00:00', '2023-01-01 22:00:00'),
(25, N'User 5 logged out.', '2023-01-01 22:00:00', '2023-01-01 23:00:00'),
(26, N'User 6 logged out.', '2023-01-01 23:00:00', '2023-01-02 00:00:00'),
(27, N'User 7 logged out.', '2023-01-02 00:00:00', '2023-01-02 01:00:00'),
(28, N'User 8 logged out.', '2023-01-02 01:00:00', '2023-01-02 02:00:00'),
(29, N'User 9 logged out.', '2023-01-02 02:00:00', '2023-01-02 03:00:00'),
(30, N'User 10 logged out.', '2023-01-02 03:00:00', '2023-01-02 04:00:00'),
(21, N'User 1 logged in.', '2023-01-02 04:00:00', '2023-01-02 05:00:00'),
(22, N'User 2 logged in.', '2023-01-02 05:00:00', '2023-01-02 06:00:00'),
(23, N'User 3 logged in.', '2023-01-02 06:00:00', '2023-01-02 07:00:00'),
(24, N'User 4 logged in.', '2023-01-02 07:00:00', '2023-01-02 08:00:00'),
(25, N'User 5 logged in.', '2023-01-02 08:00:00', '2023-01-02 09:00:00'),
(26, N'User 6 logged in.', '2023-01-02 09:00:00', '2023-01-02 10:00:00'),
(27, N'User 7 logged in.', '2023-01-02 10:00:00', '2023-01-02 11:00:00'),
(28, N'User 8 logged in.', '2023-01-02 11:00:00', '2023-01-02 12:00:00'),
(29, N'User 9 logged in.', '2023-01-02 12:00:00', '2023-01-02 13:00:00'),
(30, N'User 10 logged in.', '2023-01-02 13:00:00', '2023-01-02 14:00:00');

select * from files;
select * from folders;
select * from Groups;
select * from users;
select * from permissions;

--==========================================PROCEDURE===================================--