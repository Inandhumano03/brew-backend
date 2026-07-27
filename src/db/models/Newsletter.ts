import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Default,
    Unique,
    CreatedAt,
    UpdatedAt,
} from "sequelize-typescript";

@Table({
    tableName: "Newsletter",
})
export class Newsletter extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Unique
    @AllowNull(false)
    @Column(DataType.STRING)
    declare email: string;

    @Default("ACTIVE")
    @AllowNull(false)
    @Column(
        DataType.ENUM(
            "ACTIVE",
            "UNSUBSCRIBED",
        ),
    )
    declare status: "ACTIVE" | "UNSUBSCRIBED";

    @AllowNull(true)
    @Column(DataType.INTEGER)
    declare createdBy: number;

    @AllowNull(true)
    @Column(DataType.INTEGER)
    declare updatedBy: number;

    @CreatedAt
    @Column(DataType.DATE)
    declare createdAt: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    declare updatedAt: Date;
}