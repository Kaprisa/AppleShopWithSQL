CREATE TRIGGER DeleteEmptyTypes
ON ProductModels
AFTER DELETE
AS 
	DECLARE @TypeID INT 
	BEGIN
		SELECT @TypeID = (SELECT TypeID FROM deleted)
		IF NOT EXISTS (SELECT * FROM ProductModels WHERE TypeID = @TypeID)
			DELETE ProductTypes WHERE ID = @TypeID
	END
GO

CREATE TRIGGER DeleteEmptyModels
ON Products
AFTER DELETE
AS 
	DECLARE @ModelID INT 
	BEGIN
		SELECT @ModelID = (SELECT ModelID FROM deleted)
		IF NOT EXISTS (SELECT * FROM Products WHERE ModelID = @ModelID)
			DELETE ProductModels WHERE ID = @ModelID

	END
GO

CREATE TRIGGER FindBonusCard
ON UsersBuyInfo
AFTER UPDATE
AS
	DECLARE @UserID int
	SELECT @UserID = (SELECT UserID FROM inserted)
	DECLARE @Money money 
	 = (SELECT WastedMoney FROM inserted)
	BEGIN
	END
GO