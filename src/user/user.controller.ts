import { Body, Controller, Get, Post, Patch, Delete } from "@nestjs/common";


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
}