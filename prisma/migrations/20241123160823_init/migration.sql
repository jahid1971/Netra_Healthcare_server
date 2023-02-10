-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "paymentGatewayData" DROP NOT NULL;
