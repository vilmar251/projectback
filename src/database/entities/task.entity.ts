import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserEntity } from './user.entity';

export enum SeverityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum ImportanceEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum StatusEnum {
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

@Table({
  tableName: 'tasks',
  timestamps: false,
  underscored: true,
})
export class TaskEntity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  public description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public severity: SeverityEnum;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.INTEGER, allowNull: true })
  public authorId: number;

  @BelongsTo(() => UserEntity, 'authorId')
  public author: UserEntity;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.INTEGER, allowNull: true })
  public assigneeId: number;

  @BelongsTo(() => UserEntity, 'assigneeId')
  public assignee: UserEntity;

  @Column({ type: DataType.STRING, allowNull: false })
  public importance: ImportanceEnum;

  @Column({ type: DataType.STRING, allowNull: false })
  public status: StatusEnum;

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
