USE AppleShop2
GO

IF (SELECT Balance FROM UsersBuyInfo WHERE UserID = 2) < 0
	BEGIN
		SELECT * FROM Users
		SELECT '��� ����� ������� �������!' AS msg
	END
ELSE
	SELECT '�� ����� ����� ������������ �����' AS msg

SELECT * FROM Orders

SELECT * FROM UsersBuyInfo