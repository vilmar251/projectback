import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserEntity } from './user.entity';

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

  @Column({ type: DataType.ENUM('low', 'medium', 'high'), allowNull: false })
  public severity: 'low' | 'medium' | 'high';

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.INTEGER, allowNull: true })
  public authorId: number;

  @BelongsTo(() => UserEntity, 'authorId')
  public author: UserEntity;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public assigneeId: number;

  @Column({ type: DataType.ENUM('low', 'medium', 'high'), allowNull: false })
  public importance: 'low' | 'medium' | 'high';

  @Column({ type: DataType.ENUM('in_progress', 'review', 'done'), allowNull: false })
  public status: 'in_progress' | 'review' | 'done';

  @Column({ type: DataType.DATE })
  public createdAt: Date;

  @Column({ type: DataType.DATE })
  public updatedAt: Date;
}
