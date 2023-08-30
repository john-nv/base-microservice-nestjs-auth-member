import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1691722141496 implements MigrationInterface {
  name = 'Init1691722141496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."register-code_type_enum" AS ENUM('PARTNER', 'REFER_A_FRIEND')`,
    );
    await queryRunner.query(
      `CREATE TABLE "register-code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "bonus" numeric DEFAULT '0', "recommendCode" character varying NOT NULL, "type" "public"."register-code_type_enum" NOT NULL, "detail" character varying, "ownerId" uuid, CONSTRAINT "UQ_0533b155824be83f35f089bff4b" UNIQUE ("recommendCode"), CONSTRAINT "PK_3f5ce756fd4fb790db9ad66bef5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(20) NOT NULL, "description" character varying, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."member_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "nickName" character varying(20) NOT NULL, "fullName" character varying(30) NOT NULL, "doB" TIMESTAMP, "gender" "public"."member_gender_enum" NOT NULL DEFAULT 'MALE', "email" character varying(50), "phone" character varying(20) NOT NULL, "level" integer NOT NULL DEFAULT '0', "group" character varying(1) NOT NULL DEFAULT 'A', "point" bigint NOT NULL DEFAULT '0', "coin" bigint NOT NULL DEFAULT '0', "verifiedEMail" boolean NOT NULL DEFAULT false, "verifiedPhone" boolean NOT NULL DEFAULT false, "address" character varying, "username" character varying(20) NOT NULL, "password" character varying(60) NOT NULL, "exchangePassword" character varying(60) NOT NULL, "money" bigint NOT NULL DEFAULT '0', "depositMoney" bigint NOT NULL DEFAULT '0', "withdrawMoney" bigint NOT NULL DEFAULT '0', "bankName" character varying, "bankOwnerName" character varying, "bankAccountNumber" character varying, "verified" boolean NOT NULL DEFAULT false, "isInterested" boolean NOT NULL DEFAULT false, "leaveDate" TIMESTAMP WITH TIME ZONE, "interceptDate" TIMESTAMP WITH TIME ZONE, "lastAccess" TIMESTAMP WITH TIME ZONE, "lastLoginIP" character varying, "roleId" uuid, "recommenderId" uuid, "recommendedCodeId" uuid, CONSTRAINT "UQ_caaa7c8f5ec452c828677abe125" UNIQUE ("nickName"), CONSTRAINT "UQ_1945f9202fcfbce1b439b47b77a" UNIQUE ("username"), CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "register-code" ADD CONSTRAINT "FK_e4fbb64adac13581205f4a1465a" FOREIGN KEY ("ownerId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_2c5233089e04f3825839eeaa741" FOREIGN KEY ("recommenderId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_0f7e7535c87033ec8faa35f6abb" FOREIGN KEY ("recommendedCodeId") REFERENCES "register-code"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_0f7e7535c87033ec8faa35f6abb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_2c5233089e04f3825839eeaa741"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "register-code" DROP CONSTRAINT "FK_e4fbb64adac13581205f4a1465a"`,
    );
    await queryRunner.query(`DROP TABLE "member"`);
    await queryRunner.query(`DROP TYPE "public"."member_gender_enum"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "register-code"`);
    await queryRunner.query(`DROP TYPE "public"."register-code_type_enum"`);
  }
}
