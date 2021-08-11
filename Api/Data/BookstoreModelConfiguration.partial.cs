using Microsoft.EntityFrameworkCore;

namespace Bookstore.Api.Data
{
    public partial class BookStoreModelConfiguration
    {
        public static void BuildModel(ModelBuilder modelBuilder)
        {
            // Call the generated OnBuildModel code
            OnBuildModel(modelBuilder);

            // Do any manual configuration here...
        }

        /// <summary>
        /// This partial method will be implemented by the generated configuration class.      
        /// </summary>
        static partial void OnBuildModel(ModelBuilder modelBuilder);
    }
}