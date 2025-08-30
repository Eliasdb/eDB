using EDb.DataAccess.Data;
using Microsoft.EntityFrameworkCore;

namespace Edb.PlatformAPI.Utilities
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
