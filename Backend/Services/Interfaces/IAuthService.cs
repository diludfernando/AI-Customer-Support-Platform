using System.Threading.Tasks;
using AICustomerSupport.Backend.DTOs.Auth;

namespace AICustomerSupport.Backend.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<UserDto?> GetUserByIdAsync(Guid userId);
}
