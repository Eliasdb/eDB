using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Utilities
{
    public class InMemoryDbContextFactory
    {
        public static MyDbContext CreateDbContext()
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString()) // Unique DB name
                .Options;
            return new MyDbContext(options);
        }
    }
}
