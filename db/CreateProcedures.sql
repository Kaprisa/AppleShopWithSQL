USE AppleShop2
GO

CREATE PROCEDURE AddProduct
(
 @Type nvarchar(20),
 @Model nvarchar(20),
 @Price money,
 @Photo nvarchar(100),
 @Color nvarchar(15),
 @Memory smallint,
 @Count smallint
)
AS
BEGIN
 DECLARE @TypeID int
 DECLARE @MemoryID int
 DECLARE @ColorID int
 DECLARE @ModelID int
 DECLARE @ProductID int
 IF NOT EXISTS (SELECT ID FROM ProductModels WHERE Name = @Model)
 BEGIN
  IF NOT EXISTS (SELECT ID FROM ProductTypes WHERE Name = @Type)
  BEGIN
   INSERT ProductTypes
   VALUES (@Type)
  END
  SELECT @TypeID = (SELECT ID FROM ProductTypes WHERE Name = @Type)
  INSERT ProductModels
  VALUES (@Model, @TypeID)
 END
 SELECT @ModelID = (SELECT ID FROM ProductModels WHERE Name = @Model)
 IF NOT EXISTS (SELECT ID FROM Colors WHERE Name = @Color)
 BEGIN
  INSERT Colors
  VALUES (@Color)
 END
 SELECT @ColorID = (SELECT ID FROM Colors WHERE Name = @Color)
 IF NOT EXISTS (SELECT ID FROM Memories WHERE Volume = @Memory)
 BEGIN
  INSERT Memories
  VALUES (@Memory)
 END
 SELECT @MemoryID = (SELECT ID FROM Memories WHERE Volume = @Memory)
 INSERT Products (ModelID, Price, Photo, ColorID, MemoryID)
 VALUES (@ModelID, @Price, @Photo, @ColorID, @MemoryID)
 SELECT @ProductID = (SELECT SCOPE_IDENTITY())
 INSERT Stock
 VALUES (@ProductID, @Count)
END
GO

CREATE PROCEDURE AddModel
(
 @Type nvarchar(20),
 @Name nvarchar(20),
 @OS nvarchar(15),
 @Processor nvarchar(20),
 @WorkingTime smallint,
 @MainCamera smallint,
 @FrontCamera smallint,
 @Width smallint,
 @Height smallint,
 @Weight smallint,
 @ScreenDiagonal nvarchar(15)
)
AS
BEGIN
 DECLARE @TypeID int
 DECLARE @OSID int
 DECLARE @ModelID int
 DECLARE @ProcessorID int
 IF NOT EXISTS (SELECT ID FROM ProductTypes WHERE Name = @Type)
 BEGIN
  INSERT ProductTypes
  VALUES (@Type)
 END
 SELECT @TypeID = (SELECT ID FROM ProductTypes WHERE Name = @Type)
 IF NOT EXISTS (SELECT ID FROM OS WHERE Name = @OS)
 BEGIN
  INSERT OS
  VALUES (@OS)
 END
 SELECT @OSID = (SELECT ID FROM OS WHERE Name = @OS)
 IF NOT EXISTS (SELECT ID FROM Processors WHERE Name = @Processor)
 BEGIN
  INSERT Processors
  VALUES (@Processor)
 END
 SELECT @ProcessorID = (SELECT ID FROM Processors WHERE Name = @Processor)
 IF NOT EXISTS (SELECT ID FROM ProductModels WHERE Name = @Name)
 BEGIN
  INSERT ProductModels
  VALUES (@Name, @TypeID)
  SELECT @ModelID = (SELECT ID FROM ProductModels WHERE Name = @Name)
  INSERT ProductModelCharacteristics (ProductModelID, OSID, WorkingTime, MainCamera, FrontCamera, Width, Height, ScreenDiagonal, Weight, ProcessorID)
  VALUES (@ModelID, @OSID, @WorkingTime, @MainCamera, @FrontCamera, @Width, @Height, @ScreenDiagonal, @Weight, @ProcessorID)
 END
 ELSE
 BEGIN
  SELECT @ModelID = (SELECT ID FROM ProductModels WHERE Name = @Name)
  UPDATE ProductModelCharacteristics 
  SET OSID = @OSID, WorkingTime = @WorkingTime, MainCamera = @MainCamera, FrontCamera = @FrontCamera, Width = @Width, Height = @Height, ScreenDiagonal = @ScreenDiagonal, Weight = @Weight, ProcessorID = @ProcessorID
  WHERE ProductModelID = @ModelID
 END
END
GO
-- ѕолучаетс€ € позвол€ю добавл€ть модели только при создании(ќни добавл€ютс€ в любом случае, просто € процедуру сделала не сразу)

CREATE PROCEDURE Pagination
	@Page int = 1,
	@Limit int = 6,
	@SortColumn nvarchar(10) = 'ID',
	@Type nvarchar(20) = '',
	@Model nvarchar(20) = ''
AS
	BEGIN
		SET NOCOUNT ON
		SELECT CONCAT(ProductModels.Name, ' ', Memories.Volume, ' Gb ', Colors.Name) AS Name, Products.ID, Products.Price, Products.Photo FROM Products
		JOIN ProductModels ON Products.ModelID = ProductModels.ID
		JOIN ProductTypes ON ProductModels.TypeID = ProductTypes.ID
		JOIN Colors ON Products.ColorID = Colors.ID
		JOIN Memories ON Products.MemoryID = Memories.ID
		WHERE ProductTypes.Name = @Type AND ProductModels.Name LIKE  @Model + '%'
		ORDER BY
			CASE @SortColumn
				WHEN 'ID' THEN Products.ID
				WHEN 'Price' THEN Products.Price
			END
		OFFSET @Limit * (@Page - 1) ROWS
		FETCH NEXT @Limit ROWS ONLY OPTION (RECOMPILE)
	END
GO

CREATE PROCEDURE LikeProduct
	@ProductID int,
    @UserID int
AS
BEGIN 
 IF EXISTS (SELECT * FROM ProductLikes WHERE UserID = @UserID AND ProductID = @ProductID)
  BEGIN
   DELETE ProductLikes 
   WHERE UserID = @UserID AND ProductID = @ProductID
  END
 ELSE
  BEGIN
   INSERT ProductLikes (UserID, ProductID)
   VALUES (@UserID, @ProductID)
  END
END
GO

CREATE PROCEDURE AddToCard
	@UserID int,
	@ProductID int,
	@ProductCount int
AS
	DECLARE @Count int
	BEGIN
		IF EXISTS (SELECT * FROM ShoppingCards WHERE UserID = @UserID AND ProductID = @ProductID)
			BEGIN
				SELECT @Count = (SELECT ProductCount FROM ShoppingCards WHERE UserID = @UserID AND ProductID = @ProductID)
				UPDATE ShoppingCards 
				SET ProductCount = @Count + @ProductCount
			END
		ELSE 
			BEGIN
				INSERT ShoppingCards (UserID, ProductID, ProductCount)
				VALUES (@UserID, @ProductID, @ProductCount)
			END
	END
GO

CREATE TRIGGER BuyProduct
ON Orders
AFTER INSERT
AS
	DECLARE @ProductID int
	DECLARE @OrderID int
	DECLARE @UserID int
	DECLARE @Count int
	DECLARE @Total money
	DECLARE @BonusCard int
	DECLARE @CURSOR CURSOR
	BEGIN
		SELECT @OrderID = (SELECT ID FROM inserted)
		SELECT @UserID = (SELECT UserID FROM inserted)
		SELECT @Total = (SELECT Total FROM inserted)
		SET @CURSOR  = CURSOR SCROLL
		FOR
			SELECT ProductID, ProductCount FROM ShoppingCards
			WHERE  UserID = @UserID
		OPEN @CURSOR
		FETCH NEXT FROM @CURSOR INTO @ProductID, @Count
		WHILE @@FETCH_STATUS = 0
		BEGIN
			INSERT OrdersProducts (ProductID, ProductCount, OrderID) 
			VALUES (@ProductID, @Count, @OrderID)
			UPDATE Stock
			SET ProductCount = ProductCount - @Count
			WHERE ProductID = @ProductID
			FETCH NEXT FROM @CURSOR INTO @ProductID, @Count
		END
		CLOSE @CURSOR
		DELETE FROM ShoppingCards
		WHERE UserID = @UserID
		--IF NOT EXISTS (SELECT UserID FROM UsersBuyInfo WHERE UserID = @UserID) INSERT UsersBuyInfo (UserID) VALUES (@UserID) Ќет это пока не надо делать тк € пока не разрешаю покупать без пополнени€ счета в котором создаетс€ запись в таблице UsersBuyInfo если ее нет, позже можно исправить 
		SELECT @BonusCard = 
			(SELECT ID FROM BonusCardsTypes WHERE MinWastedMoney =
				(SELECT MAX(T.MinWastedMoney) FROM BonusCardsTypes T WHERE T.MinWastedMoney < @Total + (SELECT WastedMoney FROM UsersBuyInfo WHERE UserID = 2)))
		UPDATE UsersBuyInfo 
		SET Balance = Balance - @Total, WastedMoney = WastedMoney + @Total, BonusCardID = @BonusCard
		WHERE UserID = @UserID
	END
GO
-- ѕотом наверное нужно сделать отдельную таблицу номер Ѕ  и ее тип, тк иначе номер без смысла

CREATE PROCEDURE AddEmployee
	@Email nvarchar(30),
	@FirstName nvarchar(20),
	@LastName nvarchar(20),
	@Position nvarchar(20),
	@Phone char(12),
	@Salary money,
	@Experience tinyint
AS
	DECLARE @PositionID int
	DECLARE @UserID int
	BEGIN
		SELECT @UserID = (SELECT ID FROM Users WHERE Email = @Email)
		IF NOT EXISTS (SELECT ID FROM EmployeesPositions WHERE Name = @Position)
			INSERT EmployeesPositions (Name)
			VALUES (@Position)
		SELECT @PositionID = (SELECT ID FROM EmployeesPositions WHERE Name = @Position)
		IF EXISTS (SELECT ID FROM Employees WHERE UserID = @UserID)
			UPDATE Employees
			SET FirstName = @FirstName, LastName = @LastName, PositionID = @PositionID, Phone = @Phone, Salary = @Salary, Experience = @Experience
			WHERE UserID = @UserID
		ELSE
			BEGIN
				INSERT Employees (UserID, FirstName, LastName, PositionID, Phone, Salary, Experience)
				VALUES (@UserID, @FirstName, @LastName, @PositionID, @Phone, @Salary, @Experience)
				UPDATE Users
				SET Role = (SELECT ID FROM Roles WHERE Name = 'Employee')
			END
	END
GO

SELECT CONCAT(E.FirstName, ' ', E.LastName) AS Name, U.Email, P.Name AS Position FROM Employees E
JOIN Users U ON U.ID = E.UserID
JOIN EmployeesPositions P ON P.ID = E.PositionID










