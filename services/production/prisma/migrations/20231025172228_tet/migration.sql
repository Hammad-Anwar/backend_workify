-- CreateTable
CREATE TABLE "customers" (
    "customer_id" SERIAL NOT NULL,
    "customer_name" VARCHAR(75) NOT NULL,
    "customer_email" VARCHAR(120),
    "customer_phone" VARCHAR(120) NOT NULL,
    "customer_address" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "product_name" VARCHAR(120) NOT NULL,
    "product_price" DOUBLE PRECISION NOT NULL,
    "category_name" VARCHAR(120) NOT NULL,
    "brand_name" VARCHAR(120) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_id_UNIQUE" ON "customers"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_id_UNIQUE" ON "products"("product_id");
