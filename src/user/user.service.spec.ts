import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockRepository = {
    // create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
    create: jest.fn().mockResolvedValue(Promise.resolve('')),
  };
  let createUser: CreateUserDto;
  let people: object[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    createUser = { name: 'so' };
    people = [
      { name: 'ma', age: 2 },
      { name: 'ko', age: 2 },
      { name: 'ni', age: 30 },
    ];
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array with 1 adult', async () => {
    const adults = await service.findAdults(people);
    expect(adults.length).toBe(1);
  });

  it('should return an array containing the correct adult', async () => {
    const adults = await service.findAdults(people);
    expect(adults).toEqual([{ name: 'ni', age: 30 }]);
  });

  it('should throw not found error', async () => {
    people = [
      { name: 'ma', age: 2 },
      { name: 'ko', age: 2 },
    ];
    try {
      const adult = await service.findAdults(people);
      expect(adult).not.toEqual([]);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
// FIXME:
// มันได้ return จาก resolve value ของ repository จริงไหม ถ้าเรียกแค่ service
// How to test intercepter, pipe, guard, decorator
