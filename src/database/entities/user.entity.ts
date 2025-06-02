import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { TaskEntity } from './task.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Table({
  tableName: 'users',
  timestamps: false,
  underscored: true,
})
export class UserEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  public email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER,
  })
  public role: UserRole;

  @HasMany(() => TaskEntity, 'authorId')
  public tasks: TaskEntity[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
    defaultValue: DataType.NOW,
  })
  public createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
    defaultValue: DataType.NOW,
  })
  public updatedAt: Date;
}
