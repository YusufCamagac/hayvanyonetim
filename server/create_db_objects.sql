-- Veritabanı oluşturma (eğer yoksa)
IF NOT EXISTS (SELECT name FROM master.sys.databases WHERE name = N'ef')
BEGIN
    CREATE DATABASE ef;
    PRINT 'ef veritabanı oluşturuldu.';
END
GO

USE ef;
GO

-- User tablosu oluşturma
IF OBJECT_ID(N'Users', N'U') IS NULL
BEGIN
CREATE TABLE Users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(255) DEFAULT 'user'
);
PRINT 'Users tablosu oluşturuldu.'
END
ELSE
BEGIN
	PRINT 'Users tablosu zaten var.'
END
GO

-- Pets Tablosu
IF OBJECT_ID(N'Pets', N'U') IS NULL
BEGIN
CREATE TABLE Pets (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(255) NOT NULL,
  breed VARCHAR(255),
  age INT,
  gender VARCHAR(255),
  medicalHistory TEXT
);
PRINT 'Pets tablosu oluşturuldu.'
END
ELSE
BEGIN
	PRINT 'Pets tablosu zaten var.'
END
GO

-- Appointments Tablosu
IF OBJECT_ID(N'Appointments', N'U') IS NULL
BEGIN
CREATE TABLE Appointments (
  id INT IDENTITY(1,1) PRIMARY KEY,
  petId INT NOT NULL,
  date DATETIME NOT NULL,
  provider VARCHAR(255),
  reason VARCHAR(255),
  FOREIGN KEY (petId) REFERENCES Pets(id)
);
PRINT 'Appointments tablosu oluşturuldu.'
END
ELSE
BEGIN
	PRINT 'Appointments tablosu zaten var.'
END
GO

-- MedicalRecords Tablosu
IF OBJECT_ID(N'MedicalRecords', N'U') IS NULL
BEGIN
CREATE TABLE MedicalRecords (
  id INT IDENTITY(1,1) PRIMARY KEY,
  petId INT NOT NULL,
  recordDate DATETIME NOT NULL,
  description TEXT,
  FOREIGN KEY (petId) REFERENCES Pets(id)
);
PRINT 'MedicalRecords tablosu oluşturuldu.'
END
ELSE
BEGIN
	PRINT 'MedicalRecords tablosu zaten var.'
END
GO

-- Reminders Tablosu
IF OBJECT_ID(N'Reminders', N'U') IS NULL
BEGIN
CREATE TABLE Reminders (
  id INT IDENTITY(1,1) PRIMARY KEY,
  petId INT NOT NULL,
  type VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL,
  notes TEXT,
  FOREIGN KEY (petId) REFERENCES Pets(id)
);
PRINT 'Reminders tablosu oluşturuldu.'
END
ELSE
BEGIN
	PRINT 'Reminders tablosu zaten var.'
END
GO

-- Trigger oluşturma (şifre hash'leme için)
IF OBJECT_ID ('trg_HashPassword', 'TR') IS NOT NULL
    DROP TRIGGER trg_HashPassword;
GO

CREATE TRIGGER trg_HashPassword
ON Users
INSTEAD OF INSERT
AS
BEGIN
  INSERT INTO Users (username, password, email, role)
  SELECT username, pwdencrypt(password), email, role -- Şifreyi burada hash'leyin (Gerçek uygulamada bcrypt kullanın)
  FROM inserted;
END;
GO

PRINT 'trg_HashPassword trigger oluşturuldu.'

-- Fonksiyon oluşturma (ortalama yaş hesabı için)
IF OBJECT_ID (N'calculate_average_pet_age', N'FN') IS NOT NULL  
    DROP FUNCTION calculate_average_pet_age;  
GO  
CREATE FUNCTION calculate_average_pet_age()
RETURNS DECIMAL(5,2)
AS
BEGIN
  DECLARE @avg_age DECIMAL(5,2);
  SELECT @avg_age = AVG(age) FROM Pets;
  RETURN @avg_age;
END;
GO

PRINT 'calculate_average_pet_age fonksiyonu oluşturuldu.'

-- Stored Procedure oluşturma (randevu eklemek için)
IF OBJECT_ID (N'sp_AddAppointment', N'P') IS NOT NULL  
    DROP PROCEDURE sp_AddAppointment;  
GO  
CREATE PROCEDURE sp_AddAppointment
  @petId INT,
  @date DATETIME,
  @provider VARCHAR(255),
  @reason VARCHAR(255)
AS
BEGIN
  INSERT INTO Appointments (petId, date, provider, reason)
  VALUES (@petId, @date, @provider, @reason);
END;
GO

PRINT 'sp_AddAppointment stored procedure oluşturuldu.'

-- Stored Procedure oluşturma (kullanıcı ve ilişkili verilerini silmek için)
IF OBJECT_ID (N'sp_DeleteUserAndRelatedData', N'P') IS NOT NULL  
    DROP PROCEDURE sp_DeleteUserAndRelatedData;  
GO
CREATE PROCEDURE sp_DeleteUserAndRelatedData
    @userId INT
AS
BEGIN
    -- Kullanıcıya ait evcil hayvanların id'lerini bul
    DECLARE @petIds TABLE (id INT);
    INSERT INTO @petIds SELECT id FROM Pets WHERE id IN (SELECT petId FROM Appointments WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM Appointments WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM Reminders WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM MedicalRecords WHERE petId IN (SELECT id FROM Pets WHERE id IN (SELECT petId FROM Users WHERE id = @userId)))))))));

    -- Randevuları sil
    DELETE FROM Appointments WHERE petId IN (SELECT id FROM @petIds);

    -- Tıbbi kayıtları sil
    DELETE FROM MedicalRecords WHERE petId IN (SELECT id FROM @petIds);

    -- Hatırlatıcıları sil
    DELETE FROM Reminders WHERE petId IN (SELECT id FROM @petIds);

    -- Evcil hayvanları sil
    DELETE FROM Pets WHERE id IN (SELECT id FROM @petIds);

    -- Kullanıcıyı sil
    DELETE FROM Users WHERE id = @userId;
END;
GO

PRINT 'sp_DeleteUserAndRelatedData stored procedure oluşturuldu.'