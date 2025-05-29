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

@Table({ tableName: 'tasks' })
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

  // Поля createdAt и updatedAt будут созданы автоматически Sequelize
}
