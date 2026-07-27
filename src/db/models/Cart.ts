import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo
} from 'sequelize-typescript';

import { User } from './User';
import { Product } from './Product';

@Table({
    tableName: 'Carts',
    timestamps: true
})
export class Cart extends Model {

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId!: number;

    @BelongsTo(() => User, {
        foreignKey: 'userId',
        as: 'user'
    })
    user!: User;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    productId!: number;

    @BelongsTo(() => Product, {
        foreignKey: 'productId',
        as: 'product'
    })
    product!: Product;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1
    })
    quantity!: number;

    @Column({
        type: DataType.DECIMAL(10,2),
        allowNull: false
    })
    totalPrice!: number;

    @Column({
        type: DataType.ENUM('ACTIVE', 'ORDERED', 'REMOVED'),
        defaultValue: 'ACTIVE'
    })
    status!: 'ACTIVE' | 'ORDERED' | 'REMOVED';

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
}