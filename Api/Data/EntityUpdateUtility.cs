using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

using System.Linq;
using System.Linq.Expressions;

namespace Bookstore.Api.Data
{
    /// <summary>
    /// A utility class for simplifying entity updates using the Entity Framework.
    /// </summary>
    public class EntityUpdateUtility
    {
        /// <summary>
        /// Updates the references to a collection of related child entities using a collection as child ids 
        /// as input.
        /// </summary>        
        public static ICollection<TChild> UpdateRelatedChildren<TDbContext, TChild> (            
            DbSet<TChild> childDbSet,
            ICollection<TChild> children,
            ICollection<int> selectedChildIds)
            where TDbContext : DbContext where TChild : class, IEntity
        {
            if (children == null) children = new List<TChild>();

            if (selectedChildIds == null || selectedChildIds.Count == 0)
            {
                children.Clear();
                return children;
            }
            var selectedChildren = new HashSet<int>(selectedChildIds);
            var currentChildren = new HashSet<int>(children.Select(c => c.Id));            

            // Remove children not selected anymore
            children = children.Where(c => selectedChildren.Contains(c.Id)).ToList();
            foreach (var childToRemove in children.Where(c => !selectedChildren.Contains(c.Id)))
            {
                children.Remove(childToRemove);
            }
            // Add new children
            var newChildIds = selectedChildren.Where(id => !currentChildren.Contains(id)).ToList();
            foreach (var newChild in childDbSet.Where(c => newChildIds.Contains(c.Id)))
            {
                children.Add(newChild);
            }
            return children;            
        }
    }
}
