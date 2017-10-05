USE AppleShop2
GO

CREATE TABLE Cities
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(30) NOT NULL,
 Lat float(10) NOT NULL,
 Lng float(10) NOT NULL,
 UNIQUE (Lat, Lng)
 --[Location] geography
)
GO

CREATE TABLE BonusCardsTypes
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(15) UNIQUE,
 MinWastedMoney money NOT NULL,
 Discount tinyint CHECK (Discount >=0 AND Discount <= 100)
)
GO

INSERT BonusCardsTypes (Name, MinWastedMoney, Discount)
VALUES ('Ïðîñòàÿ', 0, 0),
       ('Áðîíçîâàÿ', 100000, 5),
	   ('Ñåðåáðÿííàÿ', 300000, 10),
	   ('Çîëîòàÿ', 700000, 25)
GO

CREATE TABLE UsersBuyInfo
(
 --CreditCard nvarchar(20) UNIQUE,
 UserID int REFERENCES Users(ID) NOT NULL UNIQUE,
 BonusCardID int REFERENCES BonusCardsTypes(ID) DEFAULT 1,-- Òèï êàðòû
 BonusCard uniqueidentifier UNIQUE DEFAULT NEWID(),--Íîìåð êàðòû
 Balance money DEFAULT 0,
 WastedMoney money DEFAULT 0
)
GO


CREATE Table UsersPassportInfo
(
 UserID int NOT NULL REFERENCES Users(ID),
 Number char(6) NOT NULL,
 Seria char(4) NOT NULL,
 PRIMARY KEY (Number, Seria)
)
GO

CREATE TABLE ProductLikes
(
 ProductID int NOT NULL REFERENCES Products(ID),
 UserID int NOT NULL REFERENCES Users(ID),
 PRIMARY KEY (ProductID, UserID)
)
GO

--ÌÎÆÍÎ ÑÄÅËÀÒÜ ÑÈÑÒÅÌÓ ÑÊÈÄÎÊ ÊÀÊ Â ÑÏÎÐÒÌÀÑÒÅÐÅ ÏÎ ÊÀÐÒÀÌ ÇÎËÎÒÀß ÑÅÐÅÁÐßÍÍÀß È ÒÄ

CREATE TABLE UsersProfiles
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 UserID int UNIQUE NOT NULL REFERENCES Users(ID),
 FirstName nvarchar(20) NULL,
 LastName nvarchar(20) NULL,
 Address nvarchar(50) NULL,
 Phone char(12) NULL CHECK (Phone LIKE '8[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]')
)
GO

CREATE TABLE ShoppingCards
(
 ProductID int NOT NULL REFERENCES Products(ID),
 UserID int NOT NULL REFERENCES Users(ID),
 ProductCount int NOT NULL DEFAULT 1,
 PRIMARY KEY (ProductID, UserID)
)
GO

CREATE TABLE EmployeesPositions
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(20) NOT NULL UNIQUE,
 MinSalary money --ÍÀ×ÀËÜÍÀß ÇÀÐÏËÀÒÀ ÏÎ ÄÀÍÍÎÉ ÄÎËÆÍÎÑÒÈ
)
GO

CREATE TABLE Achivements
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(20) NOT NULL UNIQUE,
 Icon nvarchar(20),
 [Description] nvarchar(50) NULL
)
GO

CREATE TABLE EmployeesAchivements
(
 EmployeeID int NOT NULL REFERENCES Employees(ID),
 AchivementID int NOT NULL REFERENCES Achivements(ID),
 PRIMARY KEY (EmployeeID, AchivementID)
)
GO

CREATE TABLE Employees 
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 UserID int NOT NULL UNIQUE REFERENCES Users(ID),
 FirstName nvarchar(20) NOT NULL,
 LastName nvarchar(20) NOT NULL,
 PositionID int NOT NULL REFERENCES EmployeesPositions(ID),
 Phone char(12) NOT NULL UNIQUE CHECK (Phone LIKE '8[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
 Salary money NOT NULL,
 Experience tinyint
)
GO
