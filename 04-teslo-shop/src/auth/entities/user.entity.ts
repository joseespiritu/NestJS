import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../products/entities/product.entity';
import { ApiProperty } from "@nestjs/swagger";


@Entity('users')
export class User {

    @ApiProperty({
        example: '2edaa59c-249c-4825-b1db-82480d45de42',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'jose@email.com',
        description: 'User email'
    })
    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @ApiProperty({
        example: '$2b$10$YldufKKSumtyiWLxdY3c8e82EiCKndJRZb.CUMJrQ7GxJUtm/6hGy',
        description: 'User password'
    })
    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @ApiProperty({
        example: 'José Espíritu',
        description: 'User full name'
    })
    @Column({
        type: 'text'
    })
    fullName: string;

    @ApiProperty({
        example: true,
        description: 'User active status',
        default: true
    })
    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        example: ["user", "admin"],
        description: 'User role',
        default: ["user"]
    })
    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @ApiProperty({
        example: "2edaa59c-249c-4825-b1db-82480d45de42",
        description: "Product ID",
        type: () => Product
    })
    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product;


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
