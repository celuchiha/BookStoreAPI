using Microsoft.EntityFrameworkCore;

namespace Bookstore.Api.Data
{
    public partial class BookstoreContext : DbContext
    {
        public BookstoreContext(DbContextOptions<BookstoreContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Build the model using EF Fluent configuration
            BookStoreModelConfiguration.BuildModel(modelBuilder);
        }
    }
}