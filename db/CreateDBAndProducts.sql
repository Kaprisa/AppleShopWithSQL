CREATE DATABASE AppleShop2
GO

-- Нужно сделать отдельную таблицу с моделями тк они могут быть разных цветов а продукты будут каждый по отдельности
-- Либо прописывать конкретный цвет в конкретом заказе, а сведения о цветах хранить на складе

USE AppleShop2
GO

CREATE TABLE ProductTypes
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(20) NOT NULL
)
GO

CREATE TABLE Processors 
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(20) NOT NULL
)
GO

CREATE TABLE Colors
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(15) UNIQUE NOT NULL
)
GO

CREATE TABLE Memories
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 Volume smallint UNIQUE NOT NULL
)
GO

CREATE TABLE ProductModels
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(20) UNIQUE NOT NULL,
 TypeID int NOT NULL REFERENCES ProductTypes(ID) ON DELETE CASCADE
)
GO

CREATE TABLE Products
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 ModelID int NOT NULL REFERENCES ProductModels(ID) ON DELETE CASCADE,
 Price money NOT NULL,
 Created date NOT NULL DEFAULT GETDATE(),
 Photo nvarchar(30),
 ColorID int NOT NULL REFERENCES Colors(ID),
 MemoryID int NOT NULL REFERENCES Memories(ID),
 UNIQUE (ModelID, ColorID, MemoryID)
)
GO

--ALTER TABLE ProductModels
--  ADD CONSTRAINT FK__ProductMo__TypeI__2C3393D0
--  FOREIGN KEY (TypeID) 
--  REFERENCES ProductTypes(ID) 
--  ON DELETE CASCADE;



--EXEC sp_rename 'Products.Memory', 'MemoryID', 'COLUMN'
--GO

--ALTER TABLE Products
--ADD UNIQUE (ModelID, ColorID, MemoryID)
--GO

--ALTER TABLE ProductModels
--DROP COLUMN [Description]
--GO

--ALTER TABLE ProductModelCharacteristics
--ADD [Description] nvarchar(1000) NULL
--GO

CREATE TABLE OS
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 [Name] nvarchar(15) NOT NULL
)
GO

-- Лучше сделаю характеристики модели а у конкретного продукта будут цвет память

CREATE TABLE ProductModelCharacteristics
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 ProductModelID int REFERENCES ProductModels(ID) ON DELETE CASCADE, --Добавила позже в новой базе работать будет
 OSID int NOT NULL REFERENCES OS(ID),
 ProcessorID int NOT NULL REFERENCES Processors(ID),
 [Description] nvarchar(1000) NULL,
 WorkingTime smallint,
 MainCamera smallint,
 FrontCamera smallint,
 Width smallint,
 Height smallint,
 ScreenDiagonal nvarchar(15),
 [Weight] smallint
)
GO


CREATE TABLE Stock
(
 ID int IDENTITY(1,1) PRIMARY KEY,
 ProductID int REFERENCES Products(ID),
 ProductCount int DEFAULT 0 CHECK (ProductCount >= 0)
)
GO