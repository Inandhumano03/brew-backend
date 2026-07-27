import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import { User } from './User';
import { Cart } from './Cart';

@Table({
  tableName: 'Products',
  timestamps: true
})
export class Product extends Model {

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  productName!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  price!: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0
  })
  discount?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  category!: string;

  /* -------------------------------------------------------------------------- */
  /*                               Product Image                                */
  /* -------------------------------------------------------------------------- */

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    defaultValue: null
  })
  image?: string;

  // Created By
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  createdBy!: number;

  @BelongsTo(() => User, {
    foreignKey: 'createdBy',
    as: 'creator'
  })
  creator!: User;

  // Updated By
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  updatedBy?: number;

  @BelongsTo(() => User, {
    foreignKey: 'updatedBy',
    as: 'updater'
  })
  updater?: User;

  @HasMany(() => Cart)
  carts!: Cart[];
}