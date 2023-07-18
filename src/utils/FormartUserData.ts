import { CreateUserDto } from "src/modules/user/dto/CreatUser.dto";
import { TrimSpaces, CapitalFirstLetter } from "./helpers";

export function formatUserData(createUserDto: CreateUserDto): CreateUserDto {
    // Remover espaços em branco no início e fim dos campos de texto
    createUserDto.username = TrimSpaces(createUserDto.username);
    createUserDto.name = TrimSpaces(createUserDto.name);

    // Transformar a primeira letra de cada palavra em maiúscula e remover espaços extras entre as palavras
    createUserDto.name = CapitalFirstLetter(createUserDto.name);

    // Remover espaços em branco no início e fim do campo de e-mail
    createUserDto.email = TrimSpaces(createUserDto.email);

    // Verificar se o campo Bio existe antes de formatá-lo
    if (createUserDto.Bio) {
        createUserDto.Bio = TrimSpaces(createUserDto.Bio);
    }

    // Verificar se o campo phone existe antes de formatá-lo
    if (createUserDto.phone) {
        createUserDto.phone = TrimSpaces(createUserDto.phone);
    }

    // Verificar se o campo profilePhoto existe antes de formatá-lo
    if (createUserDto.profilePhoto) {
        createUserDto.profilePhoto = TrimSpaces(createUserDto.profilePhoto);
    }

    return createUserDto;
}
