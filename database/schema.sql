-- ============================================================
--  AgenciaSi — Base de datos MySQL
--  Importar en phpMyAdmin: selecciona tu base de datos y usa
--  la pestaña "Importar" para subir este archivo.
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ── ContactLead (formulario de contacto de la web) ────────────────────────────
CREATE TABLE IF NOT EXISTS `ContactLead` (
  `id`        INT            NOT NULL AUTO_INCREMENT,
  `name`      VARCHAR(191)   NOT NULL,
  `company`   VARCHAR(191)   NULL,
  `budget`    VARCHAR(191)   NULL,
  `status`    VARCHAR(191)   NOT NULL DEFAULT 'nuevo',
  `createdAt` DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Client (clientes del portal) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `Client` (
  `id`        INT            NOT NULL AUTO_INCREMENT,
  `email`     VARCHAR(191)   NOT NULL,
  `password`  VARCHAR(191)   NOT NULL,
  `name`      VARCHAR(191)   NOT NULL,
  `company`   VARCHAR(191)   NULL,
  `phone`     VARCHAR(191)   NULL,
  `plan`      VARCHAR(191)   NULL,
  `active`    TINYINT(1)     NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Client_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Metric (métricas de campañas) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `Metric` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `clientId`    INT          NOT NULL,
  `date`        DATETIME(3)  NOT NULL,
  `platform`    VARCHAR(191) NOT NULL,
  `impressions` INT          NOT NULL DEFAULT 0,
  `clicks`      INT          NOT NULL DEFAULT 0,
  `spend`       DOUBLE       NOT NULL DEFAULT 0,
  `conversions` INT          NOT NULL DEFAULT 0,
  `revenue`     DOUBLE       NOT NULL DEFAULT 0,
  `ctr`         DOUBLE       NOT NULL DEFAULT 0,
  `cpc`         DOUBLE       NOT NULL DEFAULT 0,
  `roas`        DOUBLE       NOT NULL DEFAULT 0,
  `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `Metric_clientId_fkey`
    FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Payment (cobros y facturación) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `Payment` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `clientId`    INT          NOT NULL,
  `amount`      DOUBLE       NOT NULL,
  `currency`    VARCHAR(191) NOT NULL DEFAULT 'CLP',
  `status`      VARCHAR(191) NOT NULL DEFAULT 'pendiente',
  `description` VARCHAR(191) NULL,
  `invoiceUrl`  VARCHAR(191) NULL,
  `dueDate`     DATETIME(3)  NULL,
  `paidAt`      DATETIME(3)  NULL,
  `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `Payment_clientId_fkey`
    FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Meeting (reuniones agendadas) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `Meeting` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `clientId`    INT          NOT NULL,
  `title`       VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `date`        DATETIME(3)  NOT NULL,
  `duration`    INT          NOT NULL DEFAULT 60,
  `meetLink`    VARCHAR(191) NULL,
  `status`      VARCHAR(191) NOT NULL DEFAULT 'programada',
  `createdAt`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `Meeting_clientId_fkey`
    FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── ClientFile (archivos subidos a clientes) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS `ClientFile` (
  `id`           INT          NOT NULL AUTO_INCREMENT,
  `clientId`     INT          NOT NULL,
  `filename`     VARCHAR(191) NOT NULL,
  `originalName` VARCHAR(191) NOT NULL,
  `category`     VARCHAR(191) NOT NULL DEFAULT 'general',
  `size`         INT          NOT NULL,
  `mimeType`     VARCHAR(191) NOT NULL,
  `createdAt`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `ClientFile_clientId_fkey`
    FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Ticket (soporte técnico) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `Ticket` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `clientId`  INT          NOT NULL,
  `subject`   VARCHAR(191) NOT NULL,
  `status`    VARCHAR(191) NOT NULL DEFAULT 'abierto',
  `priority`  VARCHAR(191) NOT NULL DEFAULT 'normal',
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `Ticket_clientId_fkey`
    FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── TicketMessage (mensajes del ticket) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS `TicketMessage` (
  `id`        INT         NOT NULL AUTO_INCREMENT,
  `ticketId`  INT         NOT NULL,
  `content`   TEXT        NOT NULL,
  `isAdmin`   TINYINT(1)  NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `TicketMessage_ticketId_fkey`
    FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Task (tareas/checklist por cliente) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS `Task` (
  `id`        INT          NOT NULL AUTO_INCREMENT,
  `clientId`  INT          NOT NULL,
  `title`     VARCHAR(191) NOT NULL,
  `detail`    VARCHAR(191) NULL,
  `priority`  VARCHAR(191) NOT NULL DEFAULT 'normal',
  `dueDate`   DATETIME(3)  NULL,
  `done`      TINYINT(1)   NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `Task_clientId_fkey`
    FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
