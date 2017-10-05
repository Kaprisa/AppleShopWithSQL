USE AppleShop2
GO

CREATE TABLE Sessions
(
 [sid] varchar(255) NOT NULL PRIMARY KEY,
 [session] varchar(max) NOT NULL,
 [expires] datetime NOT NULL
)
GO

CREATE TABLE Roles
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(15) UNIQUE NOT NULL 
)
GO

CREATE TABLE Users
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 UserName nvarchar(15) UNIQUE NOT NULL,
 Email nvarchar(30) UNIQUE NOT NULL,
 [Password] binary(64) NOT NULL,
 [Role] int REFERENCES Roles(ID) NOT NULL DEFAULT 1
)
GO

ALTER TABLE Users
ADD ResetPasswordToken nvarchar(100) NULL

ALTER TABLE Users
ADD ResetPasswordExpires bigint NULL

INSERT Roles
VALUES ('User'),
       ('Admin'),
       ('Editor'),
	   ('Employee')
GO

 

