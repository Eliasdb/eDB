using System.IdentityModel.Tokens.Jwt;

namespace Edb.PlatformAPI.Middleware;

public class TokenLoggingMiddleware(RequestDelegate next, ILogger<TokenLoggingMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<TokenLoggingMiddleware> _logger = logger;

    public async Task InvokeAsync(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
        {
            var tokenString = authHeader.Substring("Bearer ".Length).Trim();
            var handler = new JwtSecurityTokenHandler();
            if (handler.CanReadToken(tokenString))
            {
                var jwtToken = handler.ReadJwtToken(tokenString);
                _logger.LogDebug("Decoded JWT Token:");
                _logger.LogDebug("Issuer: {Issuer}", jwtToken.Issuer);
                foreach (var claim in jwtToken.Claims)
                {
                    _logger.LogDebug("Claim: {Type} = {Value}", claim.Type, claim.Value);
                }
            }
        }

        await _next(context);
    }
}
