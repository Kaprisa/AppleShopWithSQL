USE AppleShop2
GO

IF (SELECT Balance FROM UsersBuyInfo WHERE UserID = 2) < 0
	BEGIN
		SELECT * FROM Users
		SELECT 'Ваш заказ успешно оплачен!' AS msg
	END
ELSE
	SELECT 'На вашем счету недостаточно денег' AS msg

SELECT * FROM Orders

SELECT * FROM UsersBuyInfo