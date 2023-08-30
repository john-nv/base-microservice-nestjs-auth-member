import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { RegisterCode } from './register-code.entity';
import { Role } from './role.entity';

enum GenderEnum {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

@Entity({ name: 'member' })
export class Member extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: false, length: 20, unique: true })
  nickName: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  fullName: string;

  @Column({ type: 'timestamp', nullable: true })
  doB: Date;

  @Column({ type: 'enum', enum: GenderEnum, default: GenderEnum.Male })
  gender: GenderEnum;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  phone: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  level: number;

  @Column({ type: 'varchar', nullable: false, default: 'A', length: 1 })
  group: string;

  @Column({ type: 'bigint', default: 0 })
  point: number;

  @Column({ type: 'bigint', default: 0 })
  coin: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  verifiedEMail: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  verifiedPhone: boolean;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: false, length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false, length: 60, select: false })
  password: string;

  @Column({ type: 'varchar', nullable: false, length: 60, select: false })
  exchangePassword: string;

  @Column({ type: 'bigint', default: 0 })
  money: number;

  @Column({ type: 'bigint', default: 0 })
  depositMoney: number;

  @Column({ type: 'bigint', default: 0 })
  withdrawMoney: number;

  @Column({ type: 'varchar', nullable: true })
  bankName: string;

  @Column({ type: 'varchar', nullable: true })
  bankOwnerName: string;

  @Column({ type: 'varchar', nullable: true })
  bankAccountNumber: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  verified: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  isInterested: boolean;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  leaveDate: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  interceptDate: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  lastAccess: Date;

  @Column({ type: 'varchar', nullable: true, default: null })
  lastLoginIP: string;

  @ManyToOne(() => Role, (role) => role.members, {
    onDelete: 'SET NULL',
  })
  role: Role;

  @ManyToOne(() => Member, (member) => member.recommended, {
    onDelete: 'SET NULL',
  })
  recommender: Member;

  @OneToMany(() => Member, (member) => member.recommender, {
    onDelete: 'SET NULL',
  })
  recommended: Member[];

  @OneToMany(() => RegisterCode, (registerCode) => registerCode.owner, {
    onDelete: 'SET NULL',
  })
  registerCodes: RegisterCode[];

  @ManyToOne(
    () => RegisterCode,
    (registerCode) => registerCode.recommendedMembers,
    {
      onDelete: 'SET NULL',
    },
  )
  recommendedCode: RegisterCode;

  @BeforeInsert()
  @BeforeUpdate()
  formatGroup() {
    this.group = this.group ? this.group.toLocaleUpperCase() : 'A';
  }
}
