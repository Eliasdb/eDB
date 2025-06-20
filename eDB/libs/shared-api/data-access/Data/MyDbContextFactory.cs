// using System.IO;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Design;
// using Microsoft.Extensions.Configuration;

// namespace EDb.DataAccess.Data
// {
//   public class MyDbContextFactory : IDesignTimeDbContextFactory<MyDbContext>
//   {
//     public MyDbContext CreateDbContext(string[] args)
//     {
//       // Load configuration from appsettings.json or environment variables
//       var config = new ConfigurationBuilder()
//         .SetBasePath(Directory.GetCurrentDirectory())
//         .AddJsonFile("appsettings.Development.json", optional: true)
//         .AddEnvironmentVariables()
//         .Build();

//       var optionsBuilder = new DbContextOptionsBuilder<MyDbContext>();

//       // Get the connection string from configuration
//       var connectionString = config.GetConnectionString("DefaultConnection");

//       optionsBuilder.UseNpgsql(connectionString); // Ensure correct DB provider

//       return new MyDbContext(optionsBuilder.Options);
//     }
//   }
// }
