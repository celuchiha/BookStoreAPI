using System;

namespace Bookstore.Api.Data
{
    public static class EntityDisplayNameExtensions
    {
        /// <summary>
        /// Gets a generic display name for the entity. This is the fallback in case no specific 
        /// GetDisplayName method is implemented.
        /// </summary>        
        public static string GetDisplayName<TEntity>(this TEntity entity) where TEntity : IEntity
        {
            return $"{entity.GetType().Name} {entity.Id}";
        }

        public static string GetDisplayName(this Author author)
        {
            return $"{author.FirstName} {author.LastName}";
        }

        public static string GetDisplayName(this Book book)
        {
            return book.Title;
        }

        public static string GetDisplayName(this Category category)
        {
            return category.Name;
        }

        public static string GetDisplayName(this Language language)
        {
            return language.IsoName;
        }
    }
}