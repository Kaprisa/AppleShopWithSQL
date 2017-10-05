USE AppleShop2
GO

ALTER VIEW ProductCardsView
AS
	SELECT P.ID, P.Price, P.Photo, CONCAT(M.Name, ' ', V.Volume, ' Gb ', C.Name) AS Name FROM Products P
	JOIN ProductModels M ON P.ModelID = M.ID
	JOIN Colors C ON P.ColorID = C.ID
	JOIN Memories V ON P.MemoryID = V.ID
GO

SELECT * FROM ProductCardsView
GO


SELECT P.* FROM ProductLikes L
JOIN ProductCardsView P ON P.ID = L.ProductID
WHERE L.UserID = 2

SELECT P.* FROM ProductLikes L
JOIN ProductCardsView P ON P.ID = L.ProductID
WHERE L.UserID = 2

SELECT P.ID, P.Name, P.Price, P.Photo, S.ProductCount AS Count  FROM ShoppingCards S
JOIN ProductCardsView P ON S.ProductID = P.ID 
WHERE S.UserID = 2