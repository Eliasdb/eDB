using AutoMapper;
using EDb.Domain.Entities;
using EDb.Domain.Interfaces;
using Edb.PlatformAPI.DTOs.Admin;
using Edb.PlatformAPI.DTOs.Auth;
using Edb.PlatformAPI.Interfaces;
using Edb.PlatformAPI.Utilities;
using Microsoft.EntityFrameworkCore;

namespace Edb.PlatformAPI.Services
{
  public class AuthService(
    IConfiguration configuration,
    IUserRepository userRepository,
    IMapper mapper
  ) : IAuthService
  {
    private readonly IConfiguration _configuration = configuration;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<(bool Success, string Message, UserDto? User)> RegisterUserAsync(
      RegisterRequest request
    )
    {
      if (await _userRepository.ExistsByEmailAsync(request.Email))
      {
        return (false, "Email already exists!", null);
      }

      var (hashedPassword, salt) = AuthUtils.HashPassword(request.Password);

      var user = _mapper.Map<User>(request);
      user.PasswordHash = hashedPassword;
      user.Salt = salt;
      user.Role = UserRole.User;

      await _userRepository.AddAsync(user);
      await _userRepository.SaveChangesAsync();

      var userDto = _mapper.Map<UserDto>(user);
      return (true, "Registration successful!", userDto);
    }

    public async Task<(bool Success, string Message, string? Token, UserDto? User)> LoginAsync(
      LoginRequest request
    )
    {
      var user = await _userRepository
        .GetUsers()
        .FirstOrDefaultAsync(u => u.Email == request.Email);

      if (
        user == null
        || string.IsNullOrEmpty(user.Salt)
        || !AuthUtils.VerifyPassword(request.Password, user.PasswordHash, user.Salt)
      )
      {
        return (false, "Invalid email or password!", null, null);
      }

      var token = AuthUtils.GenerateJwtToken(user, _configuration);

      var userDto = _mapper.Map<UserDto>(user);

      return (true, "Login successful!", token, userDto);
    }
  }
}
