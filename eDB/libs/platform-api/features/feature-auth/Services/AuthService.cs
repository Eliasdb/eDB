using System.Net.Http;
using AutoMapper;
using EDb.AuthUtils;
using EDb.Domain.Entities;
using EDb.Domain.Interfaces;
using EDb.FeatureAuth.DTOs;
using EDb.FeatureAuth.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace EDb.FeatureAuth.Services
{
  public class AuthService(
    IConfiguration configuration,
    IUserRepository userRepository,
    IMapper mapper,
    IHttpContextAccessor httpContextAccessor
  ) : IAuthService
  {
    private readonly IConfiguration _configuration = configuration;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IMapper _mapper = mapper;
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public async Task<(bool Success, string Message, UserDto? User)> RegisterUserAsync(
      RegisterRequest request
    )
    {
      if (await _userRepository.ExistsByEmailAsync(request.Email))
      {
        return (false, "Email already exists!", null);
      }

      var (hashedPassword, salt) = AllAuthUtils.HashPassword(request.Password);

      var user = _mapper.Map<User>(request);
      user.PasswordHash = hashedPassword;
      user.Salt = salt;
      user.Role = UserRole.User;

      await _userRepository.AddAsync(user);
      await _userRepository.SaveChangesAsync();

      var userDto = _mapper.Map<UserDto>(user);
      return (true, "Registration successful!", userDto);
    }

    public async Task<(bool Success, string Message, UserDto? User)> LoginAsync(
      LoginRequest request
    )
    {
      var user = await _userRepository
        .GetUsers()
        .FirstOrDefaultAsync(u => u.Email == request.Email);

      if (
        user == null
        || string.IsNullOrEmpty(user.Salt)
        || !AllAuthUtils.VerifyPassword(request.Password, user.PasswordHash, user.Salt)
      )
      {
        return (false, "Invalid email or password!", null);
      }

      var userDto = _mapper.Map<UserDto>(user);
      return (true, "Login successful!", userDto);
    }
  }
}
