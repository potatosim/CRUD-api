import { validate } from 'uuid';
import { CreateUserDto, UpdateUserDto } from './users';

type ValidationResult = {
  message: string | null;
  success: boolean;
};

export const validateCreateUserDto = (dto: CreateUserDto): ValidationResult => {
  const { age, hobbies, username } = dto;

  if (!username || typeof username !== 'string') {
    return {
      success: false,
      message: 'Username should be a non-empty string',
    };
  }

  if (typeof age !== 'number' || (typeof age === 'number' && age <= 0)) {
    return {
      success: false,
      message: 'Age should be a number and higher than zero',
    };
  }

  if (!Array.isArray(hobbies) || hobbies.some((hobby) => typeof hobby !== 'string')) {
    return {
      success: false,
      message: 'Hobbies should be an Array of strings!(Could be empty)',
    };
  }

  return {
    success: true,
    message: null,
  };
};

export const isUuid = (id: string): boolean => {
  return validate(id);
};

export const validateUpdateUserDto = (dto: UpdateUserDto): ValidationResult => {
  if (
    dto.username !== null &&
    dto.username !== undefined &&
    (!dto.username.length || typeof dto.username !== 'string')
  ) {
    return {
      success: false,
      message: 'Username should be a non-empty string',
    };
  }

  if (
    dto.age !== null &&
    dto.age !== undefined &&
    (typeof dto.age !== 'number' || (typeof dto.age === 'number' && dto.age <= 0))
  ) {
    return {
      success: false,
      message: 'Age should be a number and higher than zero',
    };
  }

  if (
    dto.hobbies !== null &&
    dto.hobbies !== undefined &&
    (!Array.isArray(dto.hobbies) || dto.hobbies.some((hobby) => typeof hobby !== 'string'))
  ) {
    return {
      success: false,
      message: 'Hobbies should be an Array of strings!(Could be empty)',
    };
  }

  return { success: true, message: null };
};
