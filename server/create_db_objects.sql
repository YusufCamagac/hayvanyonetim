-- Veritabanı oluşturma (eğer yoksa)
IF NOT EXISTS (SELECT name FROM master.sys.databases WHERE name = N'ef')
BEGIN
    CREATE DATABASE ef;
    PRINT 'ef veritabanı oluşturuldu.';
END;

USE ef;

-- User tablosu oluşturma
IF OBJECT_ID(N'Users', N'U') IS NULL
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(255) NOT NULL DEFAULT 'user',
        createdAt DATETIME NOT NULL DEFAULT SYSDATETIME()
    );
    PRINT 'Users tablosu oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Users tablosu zaten var.';
END;

-- Pets Tablosu
IF OBJECT_ID(N'Pets', N'U') IS NULL
BEGIN
    CREATE TABLE Pets (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ownerId INT, -- Kullanıcı ile ilişkilendirme için eklendi
        name VARCHAR(255) NOT NULL,
        species VARCHAR(255) NOT NULL,
        breed VARCHAR(255),
        age INT,
        gender VARCHAR(255),
        medicalHistory VARCHAR(MAX),
        FOREIGN KEY (ownerId) REFERENCES Users(id) ON DELETE SET NULL -- Kullanıcı silindiğinde ownerId NULL olsun
    );
    PRINT 'Pets tablosu oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Pets tablosu zaten var.';
END;

-- Appointments Tablosu
IF OBJECT_ID(N'Appointments', N'U') IS NULL
BEGIN
    CREATE TABLE Appointments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        petId INT NOT NULL,
        date DATETIME NOT NULL,
        provider VARCHAR(255),
        reason VARCHAR(255),
        FOREIGN KEY (petId) REFERENCES Pets(id) ON DELETE CASCADE -- Pet silindiğinde randevular da silinsin
    );
    PRINT 'Appointments tablosu oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Appointments tablosu zaten var.';
END;

-- MedicalRecords Tablosu
IF OBJECT_ID(N'MedicalRecords', N'U') IS NULL
BEGIN
    CREATE TABLE MedicalRecords (
        id INT IDENTITY(1,1) PRIMARY KEY,
        petId INT NOT NULL,
        recordDate DATETIME NOT NULL,
        description VARCHAR(MAX),
        FOREIGN KEY (petId) REFERENCES Pets(id) ON DELETE CASCADE -- Pet silindiğinde tıbbi kayıtlar da silinsin
    );
    PRINT 'MedicalRecords tablosu oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'MedicalRecords tablosu zaten var.';
END;

-- Reminders Tablosu
IF OBJECT_ID(N'Reminders', N'U') IS NULL
BEGIN
    CREATE TABLE Reminders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        petId INT NOT NULL,
        type VARCHAR(255) NOT NULL,
        date DATETIME NOT NULL,
        notes VARCHAR(MAX),
        FOREIGN KEY (petId) REFERENCES Pets(id) ON DELETE CASCADE -- Pet silindiğinde hatırlatıcılar da silinsin
    );
    PRINT 'Reminders tablosu oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Reminders tablosu zaten var.';
END;

-- Medications Tablosu
IF OBJECT_ID(N'Medications', N'U') IS NULL
BEGIN
    CREATE TABLE Medications (
        id INT IDENTITY(1,1) PRIMARY KEY,
        petId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        startDate DATE,
        endDate DATE,
        dosage VARCHAR(255),
        frequency VARCHAR(255),
        notes VARCHAR(MAX),
        FOREIGN KEY (petId) REFERENCES Pets(id) ON DELETE CASCADE -- Pet silindiğinde ilaçlar da silinsin
    );
    PRINT 'Medications tablosu oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Medications tablosu zaten var.';
END;

-- Fonksiyon oluşturma (ortalama yaş hesabı için) - Daha basit hali
IF OBJECT_ID(N'calculate_average_pet_age', N'FN') IS NOT NULL
    DROP FUNCTION calculate_average_pet_age;
GO
CREATE FUNCTION calculate_average_pet_age()
RETURNS DECIMAL(5,2)
AS
BEGIN
  RETURN (SELECT AVG(CAST(age AS DECIMAL(5,2))) FROM Pets);
END;
GO

PRINT 'calculate_average_pet_age fonksiyonu oluşturuldu.';

-- Stored Procedure oluşturma (kullanıcı ve ilişkili verilerini silmek için) - ON DELETE CASCADE ile daha basit
IF OBJECT_ID (N'sp_DeleteUser', N'P') IS NOT NULL
    DROP PROCEDURE sp_DeleteUser;
GO
CREATE PROCEDURE sp_DeleteUser
    @userId INT
AS
BEGIN
    -- Kullanıcıyı sil (ON DELETE CASCADE ve ON DELETE SET NULL kısıtlamaları sayesinde ilişkili veriler de silinecek veya güncellenecek)
    DELETE FROM Users WHERE id = @userId;
END;
GO

PRINT 'sp_DeleteUser stored procedure oluşturuldu.';

-- View oluşturma (randevu ve ilgili evcil hayvan bilgileri için)
CREATE OR ALTER VIEW vw_AppointmentsWithPets AS
SELECT a.id AS AppointmentId, a.date AS AppointmentDate, a.provider, a.reason,
       p.id AS PetId, p.name AS PetName, p.species, p.breed
FROM Appointments a
JOIN Pets p ON a.petId = p.id;
GO

PRINT 'vw_AppointmentsWithPets view oluşturuldu.';

-- Index oluşturma
CREATE INDEX IX_Pets_Name ON Pets (name);
CREATE INDEX IX_Pets_Species ON Pets (species);
CREATE INDEX IX_Appointments_Date ON Appointments (date); -- Randevular tarihe göre sık sorgulanıyorsa
CREATE INDEX IX_Users_Username ON Users (username); -- Kullanıcı adı ile sorgulama için
CREATE INDEX IX_Users_Email ON Users (email); -- E-posta ile sorgulama için
GO

PRINT 'Indexler oluşturuldu.';

-- Örnek Admin Kullanıcısı Ekleme (MANUEL OLARAK EKLEYİN, HASH'LENMİŞ ŞİFRE İLE)
-- INSERT INTO Users (username, password, email, role) VALUES
-- ('admin', 'HASHED_PASSWORD', 'admin@example.com', 'admin');

-- PRINT 'Örnek admin kullanıcısı eklendi.';
-- GO