using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using Bookstore.Api.Data;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Cors.Internal;

namespace Api
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<BookstoreContext>(opt => opt.UseInMemoryDatabase("Bookstore"));
            services.AddCors();           
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            // Seed the database with some initial test data
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<BookstoreContext>();
                DbInitializer.Initialize(context); // <-- uncomment this after uncommenting DbInitializer.cs
            }

            // Adds a 'Access-Control-Allow-Origin' header to each response, because we are accessing the API from a web app that runs on a 
            // different URL. This avoids client error 'No 'Access-Control-Allow-Origin' header is present on the requested resource.'.
            // Important: Add this call before calling app.UseMvc(). 
            // More info here: https://docs.microsoft.com/en-us/aspnet/core/security/cors
            app.UseCors(builder => builder
                .WithOrigins("http://localhost")
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            app.UseMvc();
        }
    }
}
