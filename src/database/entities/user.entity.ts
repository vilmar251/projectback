import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { TaskEntity } from './task.entity';

@Table({ tableName: 'users' })
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

  @HasMany(() => TaskEntity, 'authorId')
  public tasks: TaskEntity[];
}
